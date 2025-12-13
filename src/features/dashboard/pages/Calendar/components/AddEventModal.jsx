import { useState, useEffect } from "react";

import { useUser } from "../../../../../hooks/store/useUser";

import CommonButton from "../../../../../features/auth/components/common/CommonButton";
import DefaultAvatar from "../assets/images/default_avatar.jpg";

import "../assets/styles/AddEventModal.css";

function AddEventModal({ isOpen, onClose, onSave, isLoading })
{
	const { getAllContacts } = useUser();

	const [contacts, setContacts] = useState([]);
	const [selectedAttendeeIds, setSelectedAttendeeIds] = useState([]);

	const [formData, setFormData] = useState
	(
		{
			Title: "",
			Description: "",
			StartTime: "",
			EndTime: "",
			Priority: "Low",
			Color: "#3E6BEC"
		}
	);

	useEffect
	(
		() =>
		{
			if (isOpen)
			{
				setFormData
				(
					{
						Title: "",
						Description: "",
						StartTime: "",
						EndTime: "",
						Priority: "Low",
						Color: "#3E6BEC"
					}
				);
				setSelectedAttendeeIds([]);
				
				const fetchContacts = async () =>
				{
					const result = await getAllContacts();

					if (result?.data)
					{
						const allContacts =
						[
							...(result.data.FavouriteContacts || []),
							...(result.data.NonFavouriteContacts || [])
						];
						
						const uniqueContacts = Array.from(new Map(allContacts.map(item => [item.Id, item])).values());
						setContacts(uniqueContacts);
					}
				};
				fetchContacts();
			}
		},
		[isOpen, getAllContacts]
	);

	if (!isOpen) { return null; }

	const handleChange = (event) => { const { name, value } = event.target; setFormData(prev => ({ ...prev, [name]: value })); };

	const toggleAttendee = (id) =>
	{
		setSelectedAttendeeIds
		(
			previous =>
			{
				if (previous.includes(id)) { return previous.filter(x => x !== id); }
				else { return [...previous, id]; }
			}
		);
	};

	const handleSubmit = () =>
	{
		if (!formData.Title || !formData.StartTime || !formData.EndTime) { alert("Please fill in Title, Start Time and End Time"); return; }

		const attendeesForDisplay = contacts
			.filter(contact => selectedAttendeeIds.includes(contact.Id))
			.map(contact => ({ name: contact.Name, avatar: contact.AvatarUrl }));

		const payload =
		{
			...formData,
			Attendees: attendeesForDisplay,
			AttendeeIds: selectedAttendeeIds
		};

		onSave(payload);
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={event => event.stopPropagation()}>
				<h3 className="modal-title">New Appointment</h3>
				
				<div className="form-group">
					<label>Title</label>
					<input name="Title" value={formData.Title} onChange={handleChange} placeholder="Meeting with Team" />
				</div>

				<div className="form-row">
					<div className="form-group">
						<label>Start</label>
						<input type="datetime-local" name="StartTime" value={formData.StartTime} onChange={handleChange} />
					</div>
					<div className="form-group">
						<label>End</label>
						<input type="datetime-local" name="EndTime" value={formData.EndTime} onChange={handleChange} />
					</div>
				</div>

				<div className="form-group attendees-section">
					<label>Add Guests</label>

					<div className="attendees-list-select custom-scrollbar">
						{
							contacts.length === 0 ?
							(<p className="no-contacts-message">No contacts found</p>)
							:
							(
								contacts.map
								(
									contact =>
									{
										const isSelected = selectedAttendeeIds.includes(contact.Id);
										
										return (
											<div key={contact.Id} className={`attendee-item ${isSelected ? 'selected' : ''}`} onClick={() => toggleAttendee(contact.Id)}>
												<img src={contact.AvatarUrl || DefaultAvatar} alt={contact.Name} />
												<span>{contact.Name}</span>
												{isSelected && <span className="check-icon">✓</span>}
											</div>
										);
									}
								)
							)
						}
					</div>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label>Priority</label>
						<select name="Priority" value={formData.Priority} onChange={handleChange}>
							<option value="Low">Low</option>
							<option value="Medium">Medium</option>
							<option value="High">High</option>
						</select>
					</div>
					<div className="form-group">
						<label>Color Tag</label>
						<div className="color-options">
							{
								['#3E6BEC', '#62CA76', '#FDDE69', '#E45851'].map
								(
									color =>
									(
										<div key={color} className={`color-circle ${formData.Color === color ? 'selected' : ''}`} style={{ backgroundColor: color }} onClick={() => setFormData(previous => ({...previous, Color: color}))}/>
									)
								)
							}
						</div>
					</div>
				</div>

				<div className="form-group">
					<label>Description</label>
					<textarea name="Description" value={formData.Description} onChange={handleChange} rows="3" placeholder="Add details..."></textarea>
				</div>

				<div className="modal-actions">
					<CommonButton className="cancel-btn" handler={onClose}>Cancel</CommonButton>
					<CommonButton className="save-btn" handler={handleSubmit} disabled={isLoading}>
						{isLoading ? "Saving..." : "Create Event"}
					</CommonButton>
				</div>
			</div>
		</div>
	);
}

export default AddEventModal;