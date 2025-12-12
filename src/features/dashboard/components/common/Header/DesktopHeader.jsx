import { memo } from "react";
import { useNavigate } from "react-router-dom";

import DefaultAvatar from "../../../assets/images/default_avatar.jpg";

import "../../../assets/styles/common/Header/DesktopHeader.css";

const DesktopHeader = memo
(
	({ isLoading, userData }) =>
	{
		const navigate = useNavigate();
		
		const handleNavigationToProfile = () => { navigate("/dashboard/settings"); };
		
		return (
			<header className="header desktop-header">
				<div className="user-info" onClick={handleNavigationToProfile}>
					<p className="name">{isLoading && !userData?.Name ? "Loading..." : userData?.Name.length > 0 ? userData?.Name : "Failed to fetch"}</p>
					<img className="avatar" src={userData?.AvatarUrl || DefaultAvatar} alt="User's logo"/>
				</div>
			</header>
		);
	}
);

export default DesktopHeader;