import "../assets/styles/MessageBubble.css";

function MessageBubble({ text, isMe })
{
	return (<div className={`message-bubble ${isMe ? "me" : "them"}`}>{text}</div>);
}

export default MessageBubble;