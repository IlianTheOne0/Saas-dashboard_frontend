import { useState } from "react";

import LoadingSpinner from "../../../../../components/LoadingSpinner";
import DefaultAvatar from "../assets/images/default_avatar.jpg";

import "../assets/styles/LeftSide.css"

function ChatSidebar({ contacts, selectedContact, onSelectContact, unreadSenders = [], isLoading })
{
	const [searchTerm, setSearchTerm] = useState("");

	const filteredContacts = contacts.filter(contact => contact.Name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<aside className="chat-sidebar-component">
			<h3 className="sidebar-title">Messages</h3>

			<input type="text" className="search-input" placeholder="Search..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}/>

			<div className="contacts-scroller custom-scrollbar">
				{
					isLoading ?
					(
						<div style={{ marginTop: "20px" }}>
							<LoadingSpinner message="Syncing..." size="small" />
						</div>
					)
					:
					(
						filteredContacts.map
						(
							contact =>
							{
								const hasUnread = unreadSenders.includes(String(contact.Id));

								return (
									<div key={contact.Id} className={`contact-list-item ${selectedContact?.Id === contact.Id ? 'active' : ''}`} onClick={() => onSelectContact(contact)}>
										<img src={contact.AvatarUrl || DefaultAvatar} alt={contact.Name} className="contact-avatar"/>
										<span className="contact-name" style={{ fontWeight: hasUnread ? 'bold' : 'normal' }}>{contact.Name}</span>

										{hasUnread && <div className="dot"></div>}
									</div>
								);
							}
						)
					)
					}
			</div>
		</aside>
	);
}

export default ChatSidebar;