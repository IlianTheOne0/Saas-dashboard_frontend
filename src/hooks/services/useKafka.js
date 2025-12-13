import KAFKA_CONFIG from "../../config/kafka.config";

import { useContext, useCallback } from "react";

import { KafkaContext } from "../../store/kafka.context";

import { generateUUID } from "../../utils/generateUUID.js";

function useKafka()
{
	const context = useContext(KafkaContext);
	
	if (!context) { throw new Error("useKafka must be used within a KafkaProvider"); }

	const { status, sendMessage, addEventListener, removeEventListener } = context;

	const isInitializing = status === KAFKA_CONFIG.STATUS.CONNECTING || status === KAFKA_CONFIG.STATUS.DISCONNECTED || status === KAFKA_CONFIG.STATUS.RECONNECTING;
	const isError = status === KAFKA_CONFIG.STATUS.ERROR;
	const isConnected = status === KAFKA_CONFIG.STATUS.CONNECTED;

	const isServiceUnavailable = () => { return status === KAFKA_CONFIG.STATUS.ERROR; };

	const sendRequest = useCallback
	(
		(sendEvent, sendData, responseEvent, timeout = 10000, topic = null) =>
		{
			return new Promise
			(
				(resolve, reject) =>
				{
					const correlationId = generateUUID();
					const handler = responseData =>
					{
						if (responseData.correlationId !== correlationId) { return; }
						
						clearTimeout(timer);
						removeEventListener(responseEvent, handler);
						
						if (responseData && responseData.status && responseData.status.toLowerCase() === "error") { reject(new Error(responseData.message || "Unknown Backend Error")); }
						else { resolve(responseData.data); }
					};

					const timer = setTimeout
					(
						() =>
						{
							removeEventListener(responseEvent, handler);
							reject(new Error("Request timed out"));
						},
						timeout
					);

					addEventListener(responseEvent, handler);
					sendMessage(sendEvent, sendData, topic || undefined, correlationId).catch(error => { removeEventListener(responseEvent, handler); clearTimeout(timer); reject(error); });
				}
			)
		},
		[sendMessage, addEventListener, removeEventListener]
	);
	
	const handleBackendError = useCallback
	(
		(error) =>
		{
			const defaultMessage = "An unexpected error occurred while processing your request. Please try again later.";

			if (!error || !error.message) { return defaultMessage; }

			let errorString = null;

			const delimiters =
			[
				"Registration failed and was rolled back:",
				"Failed to login the user:"
			];

			for (const delimiter of delimiters)
			{
				if (error.message.includes(delimiter))
				{
					const parts = error.message.split(delimiter);
					
					if (parts.length > 1) { errorString = parts[1].trim(); break; }
				}
			}

			if (!errorString) { return error.message; }

			try
			{
				const errorObj = JSON.parse(errorString);
				
				if (errorObj && errorObj.msg) { return errorObj.msg; }
				else { return defaultMessage; }
			}
			catch (error) { return errorString || defaultMessage; }
		},
		[]
	);

	return { isInitializing, isError, isConnected, isServiceUnavailable, sendRequest,  handleBackendError,  status };
}

export { useKafka };