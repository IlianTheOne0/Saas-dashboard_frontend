import { createContext, useState, useRef, useCallback, useEffect } from 'react';

import { useSecurity } from "../hooks/services/useSecurity";

import { producerService } from '../services/kafka/producer';
import { consumerService } from '../services/kafka/consumer';

import KAFKA_CONFIG from '../config/kafka.config';

const KafkaContext = createContext(null);

function KafkaProvider({ children })
{
	const { encryptData, decryptData } = useSecurity();

	const [messages, setMessages] = useState([]);
	const [status, setStatus] = useState('Disconnected');
	const [error, setError] = useState(null);
	const [subscribedTopics, _] = useState(KAFKA_CONFIG.TOPICS_CONSUMER_NAMES);

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

			setMessages(previousMessages => [...previousMessages, data]);

			if (event && eventListenersRef.current[event]) { eventListenersRef.current[event].forEach(callback => callback(data)); }
		},
		[]
	);

	const sendMessage = useCallback
	(
		async (event, data, topic = KAFKA_CONFIG.TOPICS_PRODUCE_NAMES[0]) =>
		{
			const payload = JSON.stringify({ Event: event, Data: data });

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

				if (isMountedRef.current && newMessages && newMessages.length > 0)
				{
					newMessages.forEach
					(
						message =>
						{
							let cipherText = message.value;
							try { cipherText = atob(message.value); } 
							catch (error) { console.error("Failed to decode binary message", error); return; }

							const plainText = decryptData(cipherText);
							
							if (plainText)
							{
								try { const json = JSON.parse(plainText); dispatchMessage(json); }
								catch (error) { console.warn("Failed to parse incoming message:", plainText, "; ", error); }
							}
						}
					)
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
					if (isMountedRef.current) { setStatus("Session expired. Refreshing..."); }
				}
				else
				{
					if (isMountedRef.current) { pollTimeoutRef.current = setTimeout(() => pollMessages(instanceUrl), 5000); }
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
					setStatus("Initializing...");
					
					const url = await consumerService.createConsumer();
					
					if (!isMountedRef.current) { consumerService.destroy(url); return; }
					consumerInstanceUrlRef.current = url;

					setStatus("Subscribing...");
					await consumerService.subscribe(url, subscribedTopics);

					if (!isMountedRef.current) { return; }

					setStatus("Connected & Listening");
					pollMessages(url);
				}
				catch (error)
				{
					console.error("Consumer Setup Failed:", error);
					if (isMountedRef.current) { setError(`Connection Failed: ${error.message}`); setStatus("Error"); }
				}
			};

			initializeConsumer();

			return () =>
			{
				isMountedRef.current = false;
				if (pollTimeoutRef.current) { clearTimeout(pollTimeoutRef.current); }
				if (consumerInstanceUrlRef.current) { const urlToDestroy = consumerInstanceUrlRef.current; consumerInstanceUrlRef.current = null; consumerService.destroy(urlToDestroy); }
			};
		},
		[pollMessages, subscribedTopics]
	);

	const value = { messages, status, error, sendMessage, addEventListener, removeEventListener };
	return <KafkaContext.Provider value={value}>{children}</KafkaContext.Provider>;
}

export { KafkaContext, KafkaProvider };