const keys = require("../../../../../config/encryption_keys.json");

import CryptoJS from "crypto-js";

import { useState, useEffect, useCallback, useRef } from 'react';

import { useUser } from '../../../../../hooks/store/useUser';

import { encrypt } from "../../../../../services/security/encrypt";
import { decrypt } from "../../../../../services/security/decrypt";


const key = CryptoJS.enc.Hex.parse(keys.key);
const iv = CryptoJS.enc.Hex.parse(keys.iv);

const WS_URL = "ws://172.20.10.5:8083/chat"; 

function useChatSocket(onEvent, currentUserId)
{
	const { accessToken } = useUser();
	const [messages, setMessages] = useState([]);
	const [isConnected, setIsConnected] = useState(false);
	const socketRef = useRef(null);

	const safeDecrypt = (cipherText) =>
	{
		try { return decrypt(key, iv, cipherText); }
		catch (error) { console.error("Decryption failed", error); return "Error decrypting message"; }
	};

	useEffect
	(
		() =>
		{
			if (!accessToken || !currentUserId) { return; }

			const socket = new WebSocket(`${WS_URL}?token=${accessToken}&userId=${currentUserId}`);
			socketRef.current = socket;

			socket.onopen = () => { console.log("Chat Socket: Connected"); setIsConnected(true); };

			socket.onmessage = (event) =>
			{
				try
				{
					const incomingData = JSON.parse(event.data);

					if (incomingData.type === "history")
					{
						const decryptedHistory = incomingData.data.map
						(
							message =>
							(
								{ ...message, content: safeDecrypt(message.content), isMe: message.senderId === currentUserId }
							)
						);
						setMessages(decryptedHistory);
					}
					else if (incomingData.type === "chat_message")
					{
						const decryptedMsg = { ...incomingData, content: safeDecrypt(incomingData.content), isMe: incomingData.senderId === currentUserId || incomingData.isMe };
						setMessages((prev) => [...prev, decryptedMsg]);
					}

					if (onEvent) { onEvent(incomingData); }

				}
				catch (error) { console.error("Chat Socket parse error", error); }
			};

			socket.onclose = () => { console.log("Chat Socket: Disconnected"); setIsConnected(false); };

			return () => { if (socket.readyState === 1) { socket.close(); } };
			}, [accessToken, currentUserId, onEvent]);

	const sendMessage = useCallback
	(
		(content, receiverId) =>
		{
			if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN)
			{
				const encryptedContent = encrypt(key, iv, content);

				const payload = { type: "chat_message", content: encryptedContent, receiverId, timestamp: new Date().toISOString() };
				socketRef.current.send(JSON.stringify(payload));
			}
			else { console.warn("Socket is not connected. Message not sent."); }
		},
		[]
	);

	return { messages, sendMessage, isConnected };
}

export { useChatSocket };