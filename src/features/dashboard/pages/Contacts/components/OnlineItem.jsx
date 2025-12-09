import DefaultAvatar from "../../../assets/images/default_avatar.jpg";

import "../assets/styles/OnlineItem.css";

function OnlineItem({ contact, onClick })
{
	return (
		<div className="online-item" onClick={() => onClick(contact.Id)}>
			<div className="left-side">
				<img className="avatar" src={contact?.AvatarUrl || DefaultAvatar} alt="User's avatar"/>
				<p className="name">{contact?.Name}</p>
			</div>
			<div className="online-indicator"></div>
		</div>
	);
}

export default OnlineItem;