import KAFKA_CONFIG from "../../assets/data/kafka/kafka.config";

const producerService =
{
	sendData: async (message) =>
	{
		const url = `${KAFKA_CONFIG.BASE_URL}/topics/${KAFKA_CONFIG.TOPIC_PRODUCE_NAME}`;

		const payload = { records: [{ value: message }] };

		try
		{
			const response = await fetch
			(
				url,
				{
					method: "POST",
					headers: { "Content-Type": KAFKA_CONFIG.CONTENT_TYPE_JSON, "Accept": `${KAFKA_CONFIG.CONTENT_TYPE_CONFIG}, ${KAFKA_CONFIG.CONTENT_TYPE_FORMAT}` },
					body: JSON.stringify(payload),
				}
			)

			if (!response.ok) { const errorText = await response.text(); throw new Error(`Error ${response.status}: ${errorText}`); }
			return await response.json();
		}
		catch (error) { console.error(`Failed to send data to Kafka topic: ${error.message}`); throw error; }
	}
}

export { producerService };