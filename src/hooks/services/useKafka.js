import { useContext } from "react";

import { KafkaContext } from "../../store/kafka.context";

function useKafka()
{
	const context = useContext(KafkaContext);
	
	if (!context) { throw new Error("useKafka must be used within a KafkaProvider"); }

	const { sendMessage, addEventListener, removeEventListener } = context;

	const sendRequest = (sendEvent, sendData, responseEvent, timeout = 10000) =>
	{
		return new Promise
		(
			(resolve, reject) =>
			{
				const handler = responseData =>
				{
					clearTimeout(timer);
					removeEventListener(responseEvent, handler);

					if (responseData && responseData.status && responseData.status.toLowerCase() === "error") { reject(new Error(responseData.message || "Unknown Backend Error")); }
					else { resolve(responseData); }
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
				sendMessage(sendEvent, sendData)
					.catch
					(
						error =>
						{
							removeEventListener(responseEvent, handler);
							clearTimeout(timer);
							reject(error);
						}
					);
			}
		)
	}

	return { sendRequest };
}

export { useKafka };