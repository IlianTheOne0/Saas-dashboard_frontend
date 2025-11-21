import { useState, useEffect, useCallback, useRef } from "react";

import { producerService } from "../services/kafka/producer";
import { consumerService } from "../services/kafka/consumer";

import KAFKA_CONFIG from "../assets/data/kafka/kafka.config";

function useKafka()
{
	const [status, setStatus] = useState("Disconnected");
	const [messages , setMessages] = useState([]);
	const [produceStatus, setProduceStatus] = useState(null);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState(null);

	const isMountedRef = useRef(false);
	const consumerInstanceUrlRef = useRef(null);
	const pollTimeoutRef = useRef(null);

	const sendMessage = useCallback
	(
		async (message) =>
		{
			if (!message) { return; }

			setIsSending(true);
			setProduceStatus(null);

			try { await producerService.sendData(message); setProduceStatus({ success: true, message: "Message sent successfully" }); }
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
					await consumerService.subscribe(url);

					if (!isMountedRef.current) return;

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
		[pollMessages]
	);

	return { sendMessage, clearMessages, messages, status, error, producedStatus: produceStatus, isSending, TOPIC_ANSWERS_NAME: KAFKA_CONFIG.TOPIC_CONSUMER_NAME };
}

export { useKafka };