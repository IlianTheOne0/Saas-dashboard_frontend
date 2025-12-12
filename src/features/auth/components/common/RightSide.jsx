import UserIcon from "../../assets/images/user-icon.svg";

import "../../assets/styles/common/RightSide.css";

function RightSide()
{
	return (
 		<div className="right-side">
			<img className="user-icon" src={UserIcon} alt="User Icon"/>

			<h1 className="title">Experience matters for good applications.</h1>
			<p className="subtitle">The first is a non technical method which requires the use of adware removal software.</p>
		</div>
	);
}

export default RightSide;