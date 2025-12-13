import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useUser } from "../../../../hooks/store/useUser";
import { useChat } from "../../../../hooks/store/useChat";

import ChatSidebar from "./components/LeftSide";
import ChatWindow from "./components/ChatWindow";

import "./assets/styles/Chat.css";
import "../../assets/styles/CustomScrollbar.css";

function Chat()
{
	const location = useLocation(); 
	
	const { getAllContacts } = useUser();
	const { messages, sendMessage, isConnected, currentUserId, unreadSenders, markAsRead, clearActiveChat } = useChat(); 

	const [contacts, setContacts] = useState([]);
	const [selectedContact, setSelectedContact] = useState(null);

	useEffect(() => { return () => { clearActiveChat(); }; }, [clearActiveChat]);

	useEffect
	(
		() =>
		{
			let isMounted = true;
			const loadContacts = async () =>
			{
				const result = await getAllContacts();

				if (isMounted && result?.data && currentUserId)
				{
					const favs = result.data.FavouriteContacts || [];
					const others = result.data.NonFavouriteContacts || [];

					const contactMap = new Map();
					[...favs, ...others].forEach
					(
						contact =>
						{
							if (String(contact.Id) === String(currentUserId)) { return; }
							if (!contactMap.has(contact.Id)) { contactMap.set(contact.Id, contact); }
						}
					);

					const cleanedContacts = Array.from(contactMap.values());
					setContacts(cleanedContacts);

					const navId = location.state?.contactId;
					const storedId = sessionStorage.getItem("activeChatId");
					const targetId = navId || storedId;

					if (targetId)
					{
						const found = cleanedContacts.find(contact => String(contact.Id) === String(targetId));
						if (found) { setSelectedContact(found); markAsRead(found.Id); }
					}
				}
			};

			if(currentUserId) { loadContacts(); }

			return () => { isMounted = false; };
		},
		[getAllContacts, currentUserId, location.state, markAsRead]
	);

	const handleSelectContact = useCallback
	(
		(contact) =>
		{
			setSelectedContact(contact);

			if (contact) { sessionStorage.setItem("activeChatId", contact.Id); markAsRead(contact.Id); }
			else { sessionStorage.removeItem("activeChatId"); clearActiveChat(); }
		},
		[markAsRead, clearActiveChat]
	);

	const activeMessages = useMemo
	(
		() =>
		{
			if (!selectedContact || !currentUserId) { return []; }

			return messages.filter
			(
				message => 
				(String(message.receiverId) === String(selectedContact.Id) && String(message.senderId) === String(currentUserId))
				|| 
				(String(message.senderId) === String(selectedContact.Id) && String(message.receiverId) === String(currentUserId))
			);
		},
		[messages, selectedContact, currentUserId]
	);

	const handleSendMessage = (text) => { if (selectedContact) { sendMessage(text, selectedContact.Id); } };
	const handleBackToList = () => { handleSelectContact(null); };

	return (
		<div className="chat-container">
			<div className={`chat-sidebar-wrapper ${selectedContact ? "mobile-hidden" : ""}`}>
				<ChatSidebar contacts={contacts} selectedContact={selectedContact} onSelectContact={handleSelectContact}unreadSenders={unreadSenders}/>
			</div>

			<div className={`chat-window-wrapper ${!selectedContact ? "mobile-hidden" : ""}`}>
				<ChatWindow selectedContact={selectedContact} messages={activeMessages} onSendMessage={handleSendMessage} isConnected={isConnected} onBack={handleBackToList}/>
			</div>
		</div>
	);
}

export default Chat;