const KAFKA_CONFIG =
{
	BASE_URL: "http://localhost:8082",

	CONTENT_TYPE_FORMAT: "application/json",
	CONTENT_TYPE_CONFIG: "application/vnd.kafka.v2+json",
	CONTENT_TYPE_JSON: "application/vnd.kafka.json.v2+json",

	TOPICS_PRODUCE_NAMES: ["default-1-topic", "default-2-topic"],
	TOPICS_CONSUMER_NAMES: ["default-1-topic-answers", "default-2-topic-answers"],

	CONSUMER_GROUP: "react-dashboard-group",
	POLL_INTERVAL_MS: 3000,
}

export default KAFKA_CONFIG;