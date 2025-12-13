import { createContext, useState, useCallback, useEffect } from "react";

import { useUser } from "../hooks/store/useUser";
import { useChatSocket } from "../features/dashboard/pages/Chat/hooks/useChatSocket";

const ChatContext = createContext(null);

function ChatProvider({ children })
{
	const { getPersonalData } = useUser();

	const [currentUserId, setCurrentUserId] = useState(null);
	const [unreadSenders, setUnreadSenders] = useState([]); 
	const [activeChatId, setActiveChatId] = useState(null);

	useEffect
	(
		() =>
		{
			let isMounted = true;
			const fetchMe = async () =>
			{
				const me = await getPersonalData();
				if (isMounted && me?.data?.Id) { setCurrentUserId(me.data.Id); }
			};
			fetchMe();

			return () => { isMounted = false; };
		},
		[getPersonalData]
	);

	const handleSocketEvent = useCallback
	(
		(event) =>
		{
			if (event.type === "chat_message")
			{
				const senderId = String(event.senderId);
				const myId = String(currentUserId);

				if (senderId === myId) { return; }

				if (senderId !== String(activeChatId)) { setUnreadSenders(previous => { if (!previous.includes(senderId)) { return [...previous, senderId]; } return previous; } ); }
			}
		},
		[activeChatId, currentUserId]
	);

	const { messages, sendMessage, isConnected } = useChatSocket(handleSocketEvent, currentUserId);

	const markAsRead = useCallback
	(
		(contactId) =>
		{
			const idStr = String(contactId);
			setActiveChatId(idStr);
			setUnreadSenders(previous => previous.filter(id => id !== idStr));
		},
		[]
	);

	const clearActiveChat = useCallback(() => { setActiveChatId(null); }, []);

	const value = { messages, sendMessage, isConnected, currentUserId, unreadSenders, markAsRead, clearActiveChat };

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export { ChatContext, ChatProvider };