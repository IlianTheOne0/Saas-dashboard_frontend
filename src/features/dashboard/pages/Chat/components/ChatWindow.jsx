import { useState, useRef, useEffect } from "react";

import MessageBubble from "./MessageBubble";
import DefaultAvatar from "../assets/images/default_avatar.jpg";

import "../assets/styles/ChatWindow.css"

function ChatWindow({ selectedContact, messages, onSendMessage, isConnected, onBack })
{
	const [inputValue, setInputValue] = useState("");
	const endRef = useRef(null);

	useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

	const handleSend = () => { if (!inputValue.trim()) { return; } onSendMessage(inputValue); setInputValue(""); };
	const handleKeyDown = (event) => { if (event.key === "Enter") handleSend(); };

	if (!selectedContact)
	{
		return (
			<section className="chat-window-component empty">
				<p className="empty-text">Select a contact to start chatting</p>
			</section>
		);
	}

	const isUserOnline = selectedContact.IsOnline || selectedContact.isOnline || selectedContact.is_online;

	return (
		<section className="chat-window-component">
			<div className="header">
				<button className="back-button" onClick={onBack}>←</button>
				<img src={selectedContact.AvatarUrl || DefaultAvatar} alt="Avatar" className="header-avatar"/>

				<div className="contact-info-text">
					<div className="contact-name-large">{selectedContact.Name}</div>
					<div className={`status-text ${isUserOnline ? "online" : "offline"}`}>{isUserOnline ? "Online" : "Offline"}</div>
				</div>
			</div>

			<div className="messages-list custom-scrollbar">
				{messages.length === 0 && (<p className="no-messages-placeholder">No messages yet. Say hello!</p>)}

				{messages.map((msg, index) => (<MessageBubble key={index} text={msg.content} isMe={msg.isMe}/>))}
				<div ref={endRef}/>
			</div>

			<div className="input-wrapper">
				<input className="message-input" placeholder="Type a message..." value={inputValue} onChange={(event) => setInputValue(event.target.value)} onKeyDown={handleKeyDown}/>
				<button className="send-button" onClick={handleSend} disabled={!isConnected}>Send</button>
			</div>
		</section>
	);
}

export default ChatWindow;