import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import "../assets/styles/pages/Confirmation.css";

function Confirmation()
{
	const navigate = useNavigate();

	const navigateToLogin = useCallback(() => { navigate("/auth/login"); }, []);
	
	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Email Confirmation</h2>
					<p className="subtitle success">Your email has been successfully confirmed! You can now log in to your account.</p>
				</div>

				<div className="buttons-container">
					<CommonButton className={"login-button"} handler={navigateToLogin}>To Login Page</CommonButton>
				</div>
			</div>

			<RightSide/>
		</>
	);
}

export default Confirmation;