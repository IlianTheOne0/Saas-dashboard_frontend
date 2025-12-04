const KAFKA_CONFIG =
{
	BASE_URL: "http://172.20.10.5:8082",

	CONTENT_TYPE_FORMAT: "application/json",
	CONTENT_TYPE_CONFIG: "application/vnd.kafka.v2+json",
	CONTENT_TYPE_JSON: "application/vnd.kafka.json.v2+json",
	CONTENT_TYPE_BINARY: "application/vnd.kafka.binary.v2+json",

	STATUS:
	{
		DISCONNECTED: "DISCONNECTED",
		CONNECTING: "CONNECTING",
		CONNECTED: "CONNECTED",
		ERROR: "ERROR",
		RECONNECTING: "RECONNECTING"
	},

	TOPICS_PRODUCER_NAMES:
	[
        { name: "auth", topic: "auth-topic" },
        { name: "user", topic: "user-topic" }
    ],
	TOPICS_CONSUMER_NAMES:
	[
		{ name: "auth", topic: "auth-topic-answers" },
		{ name: "user", topic: "user-topic-answers" }
	],

	CONSUMER_GROUP: "frontend",
	FETCH_TIMEOUT_MS: 3000,
	POLL_INTERVAL_MS: 0
}

export default KAFKA_CONFIG;