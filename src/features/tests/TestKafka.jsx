import { useMemo, useState } from "react";

import { useKafka } from "../../hooks/useKafka";

import KAFKA_CONFIG from "../../assets/data/kafka/kafka.config";

function KafkaServiceTest()
{
	const { messages, status, error, isSending, produceStatus, subscribedTopics, sendMessage, clearMessages, getMessagesByTopic } = useKafka();

	const [messageInput, setMessageInput] = useState("");
	const [targetTopic, setTargetTopic] = useState(KAFKA_CONFIG.TOPICS_PRODUCE_NAMES[0]);
	const [filterTopic, setFilterTopic] = useState("");

	const displayedMessages = useMemo(() => getMessagesByTopic(filterTopic), [getMessagesByTopic, filterTopic]);
	const handleSendMessage = async () => { sendMessage(messageInput, targetTopic); setMessageInput(""); };

	return (
		<div style={{padding: "20px"}}>
			<h1>Kafka Integration Test</h1>

			<div style={{border: "1px solid #ccc", padding: "10px", marginBottom: "20px"}}>
                <h2>1. Producer</h2>
                
				<div style={{marginBottom: "10px"}}>
					<label>Target Topic: </label>
					<select onChange={(event) => setTargetTopic(event.target.value)} value={targetTopic}>
						{KAFKA_CONFIG.TOPICS_PRODUCE_NAMES.map(topic => <option key={topic} value={topic}>{topic}</option>)}
					</select>
				</div>
                <textarea style={{width: "100%", height: "80px"}} value={messageInput} onChange={event => setMessageInput(event.target.value)} placeholder='Enter message here...'/>

                <button onClick={handleSendMessage} disabled={!messageInput || isSending}>{isSending ? "Sending..." : "Send Message"}</button>
                { produceStatus && <span style={{marginLeft: "10px", color: produceStatus.success ? "green" : "red"}}>{produceStatus.message}</span> }
            </div>

			<div style={{border: "1px solid #ccc", padding: "10px"}}>
                <h2>2. Consumer</h2>
                
				<p>Status: <b>{status}</b></p>
                { error && <p style={{color: "red"}}>{error}</p> }

                <div style={{display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center"}}>
                    <button onClick={() => clearMessages()}>Clear Log</button>
                
                    <label>Filter View:</label>
                    <select onChange={(event) => setFilterTopic(event.target.value)} value={filterTopic}>
                        <option value="">All Topics</option>
                        {subscribedTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                    </select>
                </div>

                <ul>
                    {displayedMessages.length === 0 && <li>No messages found.</li>}
                    
                    {
						displayedMessages.map
						(
							(message, index) =>
							(
								<li key={index} style={{ background: "#f4f4f4", margin: "5px 0", padding: "5px", borderLeft: "4px solid #007bff" }}>
									<small style={{color: "#666"}}>[{message.topic}]</small><br/>
									<strong>Offset {message.offset}:</strong>
									{" "}
									{typeof message.value === "object" ? JSON.stringify(message.value) : message.value}
								</li>
							)
						)
                    }
                </ul>
            </div>
		</div>
	);
}

export default KafkaServiceTest;