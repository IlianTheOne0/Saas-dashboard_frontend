import StarOutlined from "../assets/images/star-outlined.svg";
import Star from "../assets/images/star.svg";
import DefaultAvatar from "../../../assets/images/default_avatar.jpg";
import Envelope from "../assets/images/envelope.svg";

import "../assets/styles/Item.css";

function Item({ contact, isFavourite, onStarClick, className, id, onMessageClick })
{
	return (
		<div className={`item ${className || ""}`} id={`contact-item-${id || ""}`}>
			{isFavourite ? <img className="star favourite" src={Star} alt="Star" onClick={() => onStarClick(contact.Id)}/> : <img className="star" src={StarOutlined} alt="Star" onClick={() => onStarClick(contact.Id)}/>}
			
			<img className="avatar" src={contact?.AvatarUrl || DefaultAvatar} alt="User's avatar"/>

			<div className="info">
				<p className="name">{contact?.Name}</p>
				<p className="role">{!contact?.Role || !contact.Role?.trim() ? "No role specified" : contact.Role}</p>
			</div>

			<button className="message-button" onClick={() => onMessageClick(contact.Id)}>
				<img src={Envelope} alt="Envelope"/>
				Message
			</button>
		</div>
	);
}

export default Item;