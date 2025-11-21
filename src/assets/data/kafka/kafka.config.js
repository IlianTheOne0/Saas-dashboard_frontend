const KAFKA_CONFIG =
{
	BASE_URL: 'http://localhost:8082',

	CONTENT_TYPE_FORMAT: "application/json",
	CONTENT_TYPE_CONFIG: 'application/vnd.kafka.v2+json',
	CONTENT_TYPE_JSON: 'application/vnd.kafka.json.v2+json',

	TOPIC_PRODUCE_NAME: 'default-topic',
	TOPIC_CONSUMER_NAME: 'default-topic-answers',

	CONSUMER_GROUP: "react-dashboard-group",
	POLL_INTERVAL_MS: 1000,
}

export default KAFKA_CONFIG;