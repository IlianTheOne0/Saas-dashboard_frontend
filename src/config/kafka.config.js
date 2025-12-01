const KAFKA_CONFIG =
{
	BASE_URL: "http://localhost:8082",

	CONTENT_TYPE_FORMAT: "application/json",
	CONTENT_TYPE_CONFIG: "application/vnd.kafka.v2+json",
	CONTENT_TYPE_JSON: "application/vnd.kafka.json.v2+json",
	CONTENT_TYPE_BINARY: "application/vnd.kafka.binary.v2+json",

	TOPICS_PRODUCE_NAMES: ["auth-topic"],
	TOPICS_CONSUMER_NAMES: ["auth-topic-answers"],

	CONSUMER_GROUP: "frontend",
	FETCH_TIMEOUT_MS: 3000,
	POLL_INTERVAL_MS: 0,
}

export default KAFKA_CONFIG;