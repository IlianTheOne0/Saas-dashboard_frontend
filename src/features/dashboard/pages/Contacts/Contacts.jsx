import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../../hooks/store/useUser";
import useDebounce from "../../../../hooks/useDebounce";

import Sidebar from "../../components/common/Sidebar/Sidebar";
import Item from "./components/Item";
import OnlineItem from "./components/OnlineItem";

import "./assets/styles/Contacts.css";
import "../../assets/styles/CustomScrollbar.css";

function Contacts()
{
	const navigate = useNavigate();
	
	const { isLoading, getAllContacts, getPersonalData, starContact } = useUser();

	const [ownerData, setOwnerData] = useState(null);
	const [contacts, setContacts] = useState({ FavouriteContacts: [], NonFavouriteContacts: [] });
	const [fetchError, setFetchError] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	const [highlightedId, setHighlightedId] = useState(null);
	const [isSidebarClosed, setIsSidebarClosed] = useState(false);

	const fetchContacts = useCallback
	(
		async () =>
		{
			setFetchError(false);
			try
			{
				const result = await getAllContacts();
				if (result.data) { setContacts(result.data); }
			}
			catch (error) { console.error("Failed to fetch contacts:", error); setFetchError(true); }
		},
		[getAllContacts]
	);

	useEffect(() => { fetchContacts(); }, [fetchContacts]);
	useEffect
	(
		() =>
		{
			const fetchOwnerData = async () =>
			{
				try
				{
					const result = await getPersonalData();
					if (result.data) { setOwnerData(result.data); }
				}
				catch (error) { console.error("Failed to fetch owner data:", error); }
			}
			fetchOwnerData();
		},
		[getPersonalData]
	);

	const displayedContacts = useMemo
	(
		() =>
		{
			const lowerQuery = debouncedSearchTerm.toLowerCase();

			const favourites = (contacts.FavouriteContacts || []).filter((contact) => contact.Name.toLowerCase().includes(lowerQuery));

			const nonFavourites = (contacts.NonFavouriteContacts || []).filter
			(
				(contact) =>
				{
					const matchesName = contact.Name.toLowerCase().includes(lowerQuery);
					const contactId = contact.Id;

					const isNotOwner = contactId !== ownerData?.Id;
					
					const isAlreadyFavourite = contacts.FavouriteContacts?.some(fav => fav.Id === contactId);

					return matchesName && isNotOwner && !isAlreadyFavourite;
				}
			);

			return { FavouriteContacts: favourites, NonFavouriteContacts: nonFavourites };
		},
		[contacts, debouncedSearchTerm, ownerData]
	);

	const handleSearchInput = (event) => setSearchTerm(event.target.value);
	const handleStarClick = useCallback
	(
		async (contactId) =>
		{
			setContacts
			(
				(previousContacts) =>
				{
					const targetId = String(contactId);

					const isFav = previousContacts.FavouriteContacts.find(contact => String(contact.Id) === targetId);
					const isNonFav = previousContacts.NonFavouriteContacts.find(contact => String(contact.Id) === targetId);

					const newContacts =
					{
						FavouriteContacts: [...previousContacts.FavouriteContacts],
						NonFavouriteContacts: [...previousContacts.NonFavouriteContacts]
					};

					if (isFav)
					{
						newContacts.FavouriteContacts = newContacts.FavouriteContacts.filter(contact => String(contact.Id) !== targetId);
						
						if (!newContacts.NonFavouriteContacts.some(contact => String(contact.Id) === targetId)) { newContacts.NonFavouriteContacts.push(isFav); }
					} 
					else if (isNonFav)
					{
						newContacts.NonFavouriteContacts = newContacts.NonFavouriteContacts.filter(contact => String(contact.Id) !== targetId);
						
						if (!newContacts.FavouriteContacts.some(contact => String(contact.Id) === targetId)) { newContacts.FavouriteContacts.push(isNonFav); }
					}

					return newContacts;
				}
			);

			try { await starContact(contactId); }
			catch (error) { console.error("Failed to star/unstar contact:", error); fetchContacts(); }
		},
		[starContact, fetchContacts]
	);
	const handleOnlineItemClick = useCallback
	(
		(contactId) =>
		{
			setIsSidebarClosed(true);
			setTimeout(() => setIsSidebarClosed(false), 500);

			const element = document.getElementById(`contact-item-${contactId}`);
			if (element)
			{
				element.scrollIntoView({ behavior: 'smooth', block: 'center' });
				setHighlightedId(contactId);
				setTimeout(() => { setHighlightedId(null); }, 1000);
			}
		},
		[]
	);

	const handleMessageClick = useCallback((contactId) => { navigate("/dashboard/chat", { state: { contactId } }); }, [navigate]);

	const hasContacts = (displayedContacts.FavouriteContacts?.length > 0) || (displayedContacts.NonFavouriteContacts?.length > 0);
	const onlineContacts = useMemo
	(
		() =>
		{
			const all = [...(displayedContacts.FavouriteContacts || []), ...(displayedContacts.NonFavouriteContacts || [])];
			return all.filter(contact => contact.IsOnline);
		},
		[displayedContacts]
	);

	return (
		<section className="contacts">
			<div className="top">
				<h2 className="title">Contacts</h2>

				<div className="search-bar">
					<input value={searchTerm} onChange={handleSearchInput} type="text" placeholder="Search contacts..."/>
				</div>
			</div>

			{
				isLoading && <p className="loading-message">Loading contacts...</p>
			}
			{
				!isLoading && fetchError && 
				(
					<div className="error-message">
						<p>Unable to load contacts.</p>
						<button onClick={fetchContacts}>Retry</button>
					</div>
				)
			}
			{
				!isLoading && !fetchError && !hasContacts ?
				<>
					<div className="error-message">
						<p>No contacts found.</p>
						<button onClick={fetchContacts}>Refresh</button>
					</div>
				</>
				:
				<div className="contacts-list custom-scrollbar">
					{
						displayedContacts.FavouriteContacts?.map
						(
							(contact, index) =>
							(
								<Item key={`contact-item-${contact.Id || index}`} id={contact.Id || index} className={highlightedId === contact.Id ? "highlighted" : ""} contact={contact} isFavourite={true} onStarClick={handleStarClick} onMessageClick={handleMessageClick}/>
							)
						)
					}

					{
						displayedContacts.NonFavouriteContacts?.map
						(
							(contact, index) =>
							(
								<Item key={`contact-item-${contact.Id || index}`} id={contact.Id || index} className={highlightedId === contact.Id ? "highlighted" : ""} contact={contact} isFavourite={false} onStarClick={handleStarClick} onMessageClick={handleMessageClick}/>
							)
						)
					}
				</div>
			}

			<Sidebar className={isSidebarClosed ? "force-close" : ""}>
				<div className="sidebar-header">
					<h3>Online Now</h3>
					{isLoading && <p className="loading-message">Loading statuses...</p>}
					{!isLoading && onlineContacts.length === 0 && <p className="error-message">No contacts are online.</p>}
				</div>
				
				{
					!isLoading &&
					(
						onlineContacts.length > 0 &&
						(
							<div className="online-list custom-scrollbar">
								{
									onlineContacts.map
									(
										(contact, index) =>
										(
											<OnlineItem key={`online-${contact.id || index}`} contact={contact} onClick={handleOnlineItemClick}/>
										)
									)
								}
							</div>
						)
					)
				}
			</Sidebar>
		</section>
	);
}

export default Contacts;