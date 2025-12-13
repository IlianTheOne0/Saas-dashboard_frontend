import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "../../../../hooks/store/useUser";
import { useKafka } from "../../../../hooks/services/useKafka";
import KAFKA_CONFIG from "../../../../config/kafka.config";

import AddEventModal from "./components/AddEventModal";
import DefaultAvatar from "./assets/images/default_avatar.jpg";
import BinIcon from "./assets/images/bin.svg"; 

import "./assets/styles/Calendar.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Calendar()
{
	const { accessToken } = useUser();
	const { sendRequest } = useKafka();

	const [currentDate, setCurrentDate] = useState(new Date()); 
	const [selectedDate, setSelectedDate] = useState(new Date()); 

	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null); 
	const [isLoading, setIsLoading] = useState(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const fetchEvents = useCallback
	(
		async () => 
		{
			if (!accessToken) { return; }
			setIsLoading(true);
			try 
			{
				const response = await sendRequest("fetch_calendar_events", { AccessToken: accessToken }, "fetch_calendar_events-answer", 8000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(t => t.name === "user")?.topic);
			
				if (response?.status === "Success" && response.data) 
				{
					const parsedEvents = response.data.map
					(
						Event => 
						(
							{
								...Event,
								StartTime: new Date(Event.StartTime),
								EndTime: new Date(Event.EndTime),
								Attendees: typeof Event.Attendees === 'string' ? JSON.parse(Event.Attendees) : (Event.Attendees || [])
							}
						)
					);
				
					parsedEvents.sort((a, b) => a.StartTime - b.StartTime);
					setEvents(parsedEvents);
				}
			} 
			catch (error) { console.error("Calendar fetch error:", error); } 
			finally { setIsLoading(false); }
		}, 
		[accessToken, sendRequest]
	); 

	useEffect(() => { fetchEvents(); }, [fetchEvents]);

	const handleSaveEvent = async (eventData) => 
	{
		setIsLoading(true);
		try 
		{
			const response = await sendRequest("add_calendar_event", { ...eventData, AccessToken: accessToken }, "add_calendar_event-answer", 8000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(t => t.name === "user")?.topic);

			if (response?.status === "Success") 
			{
				setIsAddModalOpen(false);
				await fetchEvents(); 
                
				if(eventData.StartTime) 
				{
					const newDate = new Date(eventData.StartTime);
					setCurrentDate(newDate);
					setSelectedDate(newDate);
					setSelectedEvent(null);
				}
			} 
			else { alert("Failed to add event: " + (response?.message || "Unknown error")); }
		} 
		catch (error)  { console.error("Error adding event:", error); alert("Error adding event."); } 
		finally  { setIsLoading(false); }
	};

	const handleDeleteEvent = async () => 
	{
		if (!selectedEvent || !selectedEvent.Id) { return; }
		if (!window.confirm("Are you sure you want to delete this event?")) { return; }

		setIsLoading(true);
		try 
		{
			const response = await sendRequest("delete_calendar_event", { Id: selectedEvent.Id, AccessToken: accessToken }, "delete_calendar_event-answer", 8000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(t => t.name === "user")?.topic);

			if (response?.status === "Success") 
			{
				setEvents(previous => previous.filter(Event => Event.Id !== selectedEvent.Id));
				setSelectedEvent(null); 
			} 
			else  { alert("Failed to delete event: " + (response?.message || "Unknown error")); }
		} 
		catch (error)  { console.error("Error deleting event:", error); alert("Error deleting event."); } 
		finally  { setIsLoading(false); }
	};

	const calendarDays = useMemo
	(
		() => 
		{
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth();
			const firstDayOfMonth = new Date(year, month, 1).getDay();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const prevMonthDays = new Date(year, month, 0).getDate();
			const days = [];
			
			for (let i = firstDayOfMonth - 1; i >= 0; i--) { days.push({ day: prevMonthDays - i, type: "prev", fullDate: new Date(year, month - 1, prevMonthDays - i) }); }
			for (let i = 1; i <= daysInMonth; i++) { days.push({ day: i, type: "current", fullDate: new Date(year, month, i) }); }
			const remainingCells = 42 - days.length;
			for (let i = 1; i <= remainingCells; i++) { days.push({ day: i, type: "next", fullDate: new Date(year, month + 1, i) }); }
			return days;
		}, 
		[currentDate]
	);

	const changeMonth = (offset) =>  { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)); };

	const getEventsForDate = (dateObj) => 
	{
		return events.filter
		(
			Event => 
			Event.StartTime.getDate() === dateObj.getDate() && 
			Event.StartTime.getMonth() === dateObj.getMonth() &&
			Event.StartTime.getFullYear() === dateObj.getFullYear()
		);
	};

	const handleDateClick = (fullDate) => 
	{
		setSelectedDate(fullDate);
		setSelectedEvent(null);
		if(fullDate.getMonth() !== currentDate.getMonth())  { setCurrentDate(fullDate); }
	};

	const selectedDayEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate, events]);

	return (
		<div className="calendar-page custom-scrollbar">
			<div className="calendar-container">
				<div className="calendar-header">
					<div className="text-group">
						<h2 className="current-month-title">{MONTHS[currentDate.getMonth()]}</h2>
						<span className="current-year-subtitle">{currentDate.getFullYear()}</span>
					</div>
					<div className="controls">
						<button className="nav-btn" onClick={() => changeMonth(-1)}>{"<"}</button>
						<button className="nav-btn" onClick={() => setCurrentDate(new Date())}>Today</button>
						<button className="nav-btn" onClick={() => changeMonth(1)}>{">"}</button>
					</div>
				</div>

				<div className="calendar-grid">
					{DAYS.map(date => <div key={date} className="calendar-day-header">{date}</div>)}
					
					{
						calendarDays.map
						(
							(dateObj, index) => 
							{
								const dayEvents = getEventsForDate(dateObj.fullDate);
								const isToday = dateObj.fullDate.toDateString() === new Date().toDateString();
								const isSelected = dateObj.fullDate.toDateString() === selectedDate.toDateString();

								return (
									<div key={index} className={`calendar-cell ${dateObj.type} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`} onClick={() => handleDateClick(dateObj.fullDate)}>
										<span className="day-number">{dateObj.day}</span>
										<div className="events-dots">
											{
												dayEvents.slice(0, 4).map
												(
													Event => 
													(
														<div key={Event.Id} className="event-dot" style={{ backgroundColor: Event.Color }}></div>
													)
												)
											}
											{dayEvents.length > 4 && <div className="event-dot overflow">+</div>}
										</div>
									</div>
								);
							}
						)
					}
				</div>
			</div>

			<div className="task-overview custom-scrollbar">
				<div className="overview-header">
					{
						!selectedEvent ? 
						(
							<div>
								<h3 className="sidebar-date-title">
									{selectedDate.getDate()} {MONTHS[selectedDate.getMonth()].substring(0,3)}
								</h3>
								<span className="sidebar-day-name">{DAYS[selectedDate.getDay()]}</span>
							</div>
						) 
						: 
						(<button className="back-btn" onClick={() => setSelectedEvent(null)}>← Back to list</button>)
					}
					
					{
						!selectedEvent && (<button className="add-event-fab" onClick={() => setIsAddModalOpen(true)}>+</button>)
					}
					
					{
						selectedEvent && 
						(
							 <button className="delete-btn" onClick={handleDeleteEvent} disabled={isLoading}>
								<img src={BinIcon} alt="Delete" className="delete-btn-img" />
							 </button>
						)
					}
				</div>

				<div className="divider-line"></div>

				{
					!selectedEvent ? 
					(
						<div className="appointments-list-view">
							{
								selectedDayEvents.length === 0 ? 
								(
									<div className="empty-placeholder">
										<p>No events for this day.</p>
										<button className="text-btn" onClick={() => setIsAddModalOpen(true)}>Add one now</button>
									</div>
								) 
								: 
								(
									selectedDayEvents.map
									(
										(Event) => 
										(
											<div key={Event.Id} className="appointment-card" onClick={() => setSelectedEvent(Event)}>
												<div className="time-col">
													<span className="start">{Event.StartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
													<span className="end">{Event.EndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
												</div>
												<div className="info-col" style={{borderLeft: `4px solid ${Event.Color}`}}>
													<span className="app-title">{Event.Title}</span>
													<span className="app-priority">{Event.Priority}</span>
												</div>
											</div>
										)
									)
								)
							}
						</div>
					) 
					: 
					(
						<div className="task-detail">
							<span className="detail-category" style={{color: selectedEvent.Color, borderColor: selectedEvent.Color}}>
								{selectedEvent.Priority} Priority
							</span>
							<h2 className="detail-title">{selectedEvent.Title}</h2>
							
							<div className="detail-section">
								<label>Time</label>
								<p>
									{selectedEvent.StartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
									{selectedEvent.EndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
								</p>
							</div>

							<div className="detail-section">
								<label>Description</label>
								<p className="description-text">{selectedEvent.Description || "No description provided."}</p>
							</div>

							<div className="detail-section">
								<label>Attendees</label>
								<div className="attendees-list">
									{
										(selectedEvent.Attendees && selectedEvent.Attendees.length > 0) ? 
										(
											selectedEvent.Attendees.map
											(
												(attendees, index) => 
												(
													<div key={index} className="attendee">
														<img src={attendees.avatar || DefaultAvatar} alt="user" />
														<span>{attendees.name || "User"}</span>
													</div>
												)
											)
										) 
										: 
										(
											<span className="no-attendees-text">No attendees added</span>
										)
									}
								</div>
							</div>
						</div>
					)
				}
			</div>

			<AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleSaveEvent} isLoading={isLoading}/>
		</div>
	);
}

export default Calendar;