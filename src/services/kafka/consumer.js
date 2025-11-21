import KAFKA_CONFIG from "../../assets/data/kafka/kafka.config";

class ConsumerService
{
	constructor() { this.baseUri = null; }

	async createConsumer()
	{
		const uniqueId = "client-" + Math.random().toString(36).substring(2, 15);
		const url = `${KAFKA_CONFIG.BASE_URL}/consumers/${KAFKA_CONFIG.CONSUMER_GROUP}-${uniqueId}`;

		const payload =
		{
			name: uniqueId,
			format: "json",
			"auto.offset.reset": "latest",
			"auto.commit.enable": "true",
		};

		try
		{
			const response = await fetch
			(
				url,
				{
					method: "POST",
					headers: { "Content-Type": KAFKA_CONFIG.CONTENT_TYPE_CONFIG },
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) { const errorText = await response.text(); throw new Error(`Failed to create consumer (Status ${response.status}): ${errorText}`); }

			const instanceUrl = `${url}/instances/${uniqueId}`;
			this.baseUri = instanceUrl;
			
			console.log(`[Kafka] Consumer created: ${uniqueId}`);
			return instanceUrl;
		}
		catch (error) { console.error("[Kafka] Create Consumer Error:", error.message); throw error; }
	}

	async subscribe(instanceUrl, topics = null)
	{
		const targetUrl = instanceUrl || this.baseUri;
		if (!targetUrl) { throw new Error("Cannot subscribe: No consumer instance URL provided."); }

		const url = `${targetUrl}/subscription`;
		const payload = { topics: topics || [ KAFKA_CONFIG.TOPIC_CONSUMER_NAME ] };

		try 
		{
			const response = await fetch
			(
				url,
				{
					method: "POST",
					headers: { "Content-Type": KAFKA_CONFIG.CONTENT_TYPE_CONFIG },
					body: JSON.stringify(payload),
				}
			);

			if (!response.ok) { const errorText = await response.text(); throw new Error(`Failed to subscribe (Status ${response.status}): ${errorText}`); }

			console.log(`[Kafka] Subscribed to: ${payload.topics.join(", ")}`);
		}
		catch (error) { console.error("[Kafka] Subscribe Error:", error.message); throw error; }
	}

	async fetchData(instanceUrl)
	{
		const targetUrl = instanceUrl || this.baseUri;
		if (!targetUrl) { return []; }

		const url = `${targetUrl}/records?timeout=${KAFKA_CONFIG.POLL_INTERVAL_MS}`;

		try
		{
			const response = await fetch
			(
				url,
				{
					method: "GET",
					headers: { "Accept": KAFKA_CONFIG.CONTENT_TYPE_JSON },
				}
			);

			if (!response.ok)
			{
				if (response.status === 404) { throw new Error("Consumer instance not found"); }
				
				const txt = await response.text();
				throw new Error(`Fetch error ${response.status}: ${txt}`);
			}

			const data = await response.json();

			if (!Array.isArray(data)) return [];

			return data.map
			(
				record =>
				(
					{
					topic: record.topic,
					partition: record.partition,
					offset: record.offset,
					key: record.key,
					value: record.value
					}
				)
			);
		}
		catch (error)
		{
			if (error.message === "Consumer instance not found") { throw error; }
			console.warn(`[Kafka] Fetch Data Warning: ${error.message}`);
			throw error;
		}
	}

	async destroy(instanceUrl)
	{
		const targetUrl = instanceUrl || this.baseUri;
		if (!targetUrl) { return; }

		if (this.baseUri === targetUrl) { this.baseUri = null; }

		try
		{
			await fetch
			(
				targetUrl,
				{
					method: "DELETE",
					headers: { "Content-Type": KAFKA_CONFIG.CONTENT_TYPE_CONFIG },
				}
			);
			console.log("[Kafka] Consumer instance destroyed successfully.");
		}
		catch (error) { console.error(`[Kafka] Failed to destroy consumer: ${error.message}`); }
	}
}

export const consumerService = new ConsumerService();