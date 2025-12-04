import KAFKA_CONFIG from '../config/kafka.config';

import { createContext, useState, useRef, useCallback, useEffect } from 'react';

import { useSecurity } from "../hooks/services/useSecurity";

import { producerService } from '../services/kafka/producer';
import { consumerService } from '../services/kafka/consumer';

import { generateUUID } from '../utils/generateUUID.js';

const KafkaContext = createContext(null);

function KafkaProvider({ children })
{
	const { encryptData, decryptData } = useSecurity();

	const [messages, setMessages] = useState([]);
	const [status, setStatus] = useState(KAFKA_CONFIG.STATUS.DISCONNECTED);
	const [error, setError] = useState(null);
	const [subscribedTopics, _] = useState(KAFKA_CONFIG.TOPICS_CONSUMER_NAMES.map(topic => topic.topic));

	const isMountedRef = useRef(true);
	const consumerInstanceUrlRef = useRef(null);
	const pollTimeoutRef = useRef(null);

	const eventListenersRef = useRef({});

	const addEventListener = useCallback
	(
		(event, callback) =>
		{
			if (!eventListenersRef.current[event]) { eventListenersRef.current[event] = []; }
			eventListenersRef.current[event].push(callback);
		},
		[]
	)
	const removeEventListener = useCallback
	(
		(event, callback) =>
		{
			if (!eventListenersRef.current[event]) { return; }
			eventListenersRef.current[event] = eventListenersRef.current[event].filter(callback => callback !== callback);
		},
		[]
	);
	const dispatchMessage = useCallback
	(
		(message) =>
		{
			const event = message.event || message.Event;
			const data = message.data || message.Data;
			const correlationId = message.correlationId || message.CorrelationId;

			setMessages(previousMessages => [...previousMessages, data]);

			if (event && eventListenersRef.current[event]) { eventListenersRef.current[event].forEach(callback => callback({ data, correlationId })); }
		},
		[]
	);

	const sendMessage = useCallback
	(
		async (event, data, topic = KAFKA_CONFIG.TOPICS_PRODUCE_NAMES[0].topic, correlationId = null) =>
		{
			const cid = correlationId || generateUUID();

			const payload = JSON.stringify({ Event: event, CorrelationId: cid, Data: data });

			const encryptedPayload = encryptData(payload);
			
			try { await producerService.sendData(encryptedPayload, topic); }
			catch (error) { console.error("Error sending message:", error); throw error; }
		},
		[encryptData]
	);

	const pollMessages = useCallback
	(
		async (instanceUrl) =>
		{
			if (!isMountedRef.current || !instanceUrl) { return; }

			try
			{
				const newMessages = await consumerService.fetchData(instanceUrl);

				setStatus
				(
					(prevStatus) =>
					{
						if (prevStatus === KAFKA_CONFIG.STATUS.ERROR) { setError(null); return KAFKA_CONFIG.STATUS.CONNECTED; }
						return prevStatus;
					}
				);

				if (isMountedRef.current && newMessages && newMessages.length > 0)
				{
					newMessages.forEach
					(
						message =>
						{
							let cipherText = message.value;
							try { cipherText = atob(message.value); } 
							catch (error) { console.error("Failed to decode binary", error); return; }

							const plainText = decryptData(cipherText);
							if (plainText)
							{
								try { const json = JSON.parse(plainText); dispatchMessage(json); }
								catch (error) { console.warn("Failed to parse message", error); }
							}
						}
					);
				}

				if (isMountedRef.current)
				{
					const nextPollDelay = newMessages && newMessages.length > 0 ? 0 : KAFKA_CONFIG.POLL_INTERVAL_MS;
					pollTimeoutRef.current = setTimeout(() => pollMessages(instanceUrl), nextPollDelay); 
				}
			}
			catch (error)
			{
				console.warn("Polling error:", error.message);
				if (error.message === "Consumer instance not found")
				{
					if (isMountedRef.current) { setStatus(KAFKA_CONFIG.STATUS.RECONNECTING); }
				}
				else
				{
					if (isMountedRef.current) { setStatus(KAFKA_CONFIG.STATUS.ERROR); setError(error.message);pollTimeoutRef.current = setTimeout(() => pollMessages(instanceUrl), 5000); }
				}
			}
		},
		[dispatchMessage, decryptData]
	);

	useEffect
	(
		() =>
		{
			isMountedRef.current = true;
			
			const initializeConsumer = async () =>
			{
				try
				{
					setStatus(KAFKA_CONFIG.STATUS.CONNECTING);
					
					const url = await consumerService.createConsumer();
					
					if (!isMountedRef.current) { consumerService.destroy(url); return; }
					consumerInstanceUrlRef.current = url;

					await consumerService.subscribe(url, subscribedTopics);

					if (!isMountedRef.current) { return; }

					setStatus(KAFKA_CONFIG.STATUS.CONNECTED);
					pollMessages(url);
				}
				catch (error)
				{
					console.error("Consumer Setup Failed:", error);

					if (isMountedRef.current) { setError(`Connection Failed: ${error.message}`); setStatus(KAFKA_CONFIG.STATUS.ERROR); }
				}
			};

			initializeConsumer();

			return () =>
			{
				isMountedRef.current = false;

				if (pollTimeoutRef.current) { clearTimeout(pollTimeoutRef.current); }
				if (consumerInstanceUrlRef.current) { const urlToDestroy = consumerInstanceUrlRef.current; consumerInstanceUrlRef.current = null;  consumerService.destroy(urlToDestroy); }
			};
		},
		[pollMessages, subscribedTopics]
	);

	const value = { messages, status, error, sendMessage, addEventListener, removeEventListener };
	return <KafkaContext.Provider value={value}>{children}</KafkaContext.Provider>;
}

export { KafkaContext, KafkaProvider };