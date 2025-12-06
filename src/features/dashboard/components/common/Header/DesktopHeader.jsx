import { useNavigate } from "react-router-dom";

import DefaultAvatar from "../../../assets/images/Header/default_avatar.jpg";

import "../../../assets/styles/common/Header/DesktopHeader.css";

function DesktopHeader({ isLoading, userData })
{
	const navigate = useNavigate();
	
	const handleNavigationToProfile = () => { navigate("/dashboard/profile"); };
	
	return (
		<header className="header desktop-header" onClick={handleNavigationToProfile}>
			<p className="name">{isLoading ? "Loading..." : userData?.Name}</p>
			<img className="avatar" src={userData?.AvatarUrl || DefaultAvatar} alt="User's logo"/>
		</header>
	);
}

export default DesktopHeader;