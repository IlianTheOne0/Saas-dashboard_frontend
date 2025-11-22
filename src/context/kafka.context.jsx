import { createContext, useState, useRef, useCallback, useEffect } from 'react';

import { producerService } from '../services/kafka/producer';
import { consumerService } from '../services/kafka/consumer';

import KAFKA_CONFIG from '../config/kafka.config';

const KafkaContext = createContext(null);

function KafkaProvider({ children })
{
	const [messages, setMessages] = useState([]);
	const [status, setStatus] = useState('Disconnected');
	const [error, setError] = useState(null);
	const [isSending, setIsSending] = useState(false);
	const [produceStatus, setProduceStatus] = useState(null);

	const [subscribedTopics, _] = useState(KAFKA_CONFIG.TOPICS_CONSUMER_NAMES);

	const isMountedRef = useRef(true);
	const consumerInstanceUrlRef = useRef(null);
	const pollTimeoutRef = useRef(null);

	const sendMessage = useCallback
	(
		async (message, topic) =>
		{
			if (!message) { return; }

			setIsSending(true);
			setProduceStatus(null);

			try { await producerService.sendData(message, topic); setProduceStatus({ success: true, message: "Message sent successfully" }); }
			catch (error) { setProduceStatus({ success: false, message: `Failed to send message: ${error.message}` }); console.error("Error sending message:", error); }
			finally { setIsSending(false); }
		},
		[]
	);
	const clearMessages = useCallback(() => { setMessages([]); }, []);
	const pollMessages = useCallback
	(
		async (instanceUrl) =>
		{
			if (!isMountedRef.current || !instanceUrl) { return; }

			try
			{
				const newMessages = await consumerService.fetchData(instanceUrl);
				
				if (isMountedRef.current && newMessages && newMessages.length > 0) { setMessages(previous => [...previous, ...newMessages]); }
				if (isMountedRef.current) { pollTimeoutRef.current = setTimeout(() => pollMessages(instanceUrl), KAFKA_CONFIG.POLL_INTERVAL_MS); }
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
		[]
	);
	const getMessagesByTopic = useCallback
	(
		(topic) =>
		{
			if (!topic) { return messages; }
			return messages.filter(message => message.topic === topic);
		}
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

	const value = { messages, status, error, isSending, produceStatus, subscribedTopics, sendMessage, clearMessages, getMessagesByTopic };
	return <KafkaContext.Provider value={value}>{children}</KafkaContext.Provider>;
}

export { KafkaContext, KafkaProvider };