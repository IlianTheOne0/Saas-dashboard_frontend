import { useContext } from "react";

import { KafkaContext } from "../context/kafka.context";

function useKafka()
{
	const context = useContext(KafkaContext);
	
	if (!context) { throw new Error("useKafka must be used within a KafkaProvider"); }
	return context;
}

export { useKafka };