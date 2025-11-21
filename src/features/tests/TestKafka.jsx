import { useState } from "react";

import { useKafka } from "../../hooks/useKafka";

function KafkaServiceTest()
{
	const { sendMessage, clearMessages, messages, status, error, producedStatus: produceStatus, isSending, TOPIC_ANSWERS_NAME } = useKafka();

	const [messageInput, setMessageInput] = useState("");

	const handleSendMessage = async () => { sendMessage(messageInput); setMessageInput(""); };
	const handleClearMessages = () => { clearMessages(); };

	return (
		<div style={{padding: "20px"}}>
			<h1>Kafka Integration Test</h1>

			<div style={{border: "1px solid #ccc", padding: "10px", marginBottom: "20px"}}>
				<h2>1. Producer (React to Backend)</h2>
				
				<textarea style={{width: "100%", height: "100px"}} value={messageInput} onChange={event => setMessageInput(event.target.value)} placeholder='Enter message here...'/>
				
				<br/>
				
				<button onClick={handleSendMessage} disabled={!messageInput || isSending}>{isSending ? "Sending..." : "Send Message"}</button>
				{ produceStatus && <span style={{marginLeft: "10px"}}>{produceStatus.message}</span> }
			</div>

			<div style={{border: "1px solid #ccc", padding: "10px"}}>
				<h2>2. Consumer (Backend to React)</h2>
				<p>Listening on: <b>{TOPIC_ANSWERS_NAME}</b></p>
				<p>Status: <b>{status}</b></p>
				{ error && <p style={{color: "red"}}>{error}</p> }

				<button onClick={handleClearMessages}>Clear Log</button>

				<ul>
					{
						messages.map
						(
							(message, index) =>
							(
								<li key={index} style={{ background: "#f4f4f4", margin: "5px 0", padding: "5px" }}>
								<strong>Offset {message.offset}:</strong>
								{" "}{typeof message.value === "object" ? JSON.stringify(message.value) : message.value}
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