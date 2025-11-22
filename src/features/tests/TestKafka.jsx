import { useMemo, useState } from "react";

import { useKafka } from "../../hooks/useKafka";

import KAFKA_CONFIG from "../../config/kafka.config";

import "../../assets/styles/features/tests/TestKafka/TestKafka.css";

function KafkaServiceTest()
{
	const { messages, status, error, isSending, produceStatus, subscribedTopics, sendMessage, clearMessages, getMessagesByTopic } = useKafka();

	const [messageInput, setMessageInput] = useState("");
	const [targetTopic, setTargetTopic] = useState(KAFKA_CONFIG.TOPICS_PRODUCE_NAMES[0]);
	const [filterTopic, setFilterTopic] = useState("");

	const displayedMessages = useMemo(() => getMessagesByTopic(filterTopic), [getMessagesByTopic, filterTopic]);
	const handleSendMessage = async () => { sendMessage(messageInput, targetTopic); setMessageInput(""); };

	return (
		<div className="features-tests-kafka">
			<h1>Kafka Integration Test</h1>

			<div className="container producer">
                <h2>1. Producer</h2>
                
				<div className="form-group">
					<label>Target Topic: </label>
					<select onChange={(event) => setTargetTopic(event.target.value)} value={targetTopic}>
						{KAFKA_CONFIG.TOPICS_PRODUCE_NAMES.map(topic => <option key={topic} value={topic}>{topic}</option>)}
					</select>
				</div>
                <textarea className="textarea" value={messageInput} onChange={event => setMessageInput(event.target.value)} placeholder='Enter message here...'/>

                <button onClick={handleSendMessage} disabled={!messageInput || isSending}>{isSending ? "Sending..." : "Send Message"}</button>
                { produceStatus && <span className={`produce-status ${produceStatus.success ? "success" : "error"}`}>{produceStatus.message}</span> }
            </div>
			<div className="container consumer">
                <h2>2. Consumer</h2>
                
				<p>Status: <b>{status}</b></p>
                { error && <p className="error">{error}</p> }

                <div className="controls">
                    <button onClick={() => clearMessages()}>Clear Log</button>
                
                    <label>Filter View:</label>
                    <select onChange={(event) => setFilterTopic(event.target.value)} value={filterTopic}>
                        <option value="">All Topics</option>
                        {subscribedTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                    </select>
                </div>

                <ul className="message-log">
                    {displayedMessages.length === 0 && <li>No messages found.</li>}
                    
                    {
						displayedMessages.map
						(
							(message, index) =>
							(
								<li className="message-log-item" key={index}>
									<small className="small">[{message.topic}]</small><br/>
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