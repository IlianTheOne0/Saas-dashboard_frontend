import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useKafka } from "../../../hooks/services/useKafka";

import CommonInput from "../components/common/CommonInput";
import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import IconCorrectCircle from "../../../assets/images/icons/common/Correct-Circle.svg"
import IconIncorrectCircle from "../../../assets/images/icons/common/Incorrect-Circle.svg"

import "../assets/styles/pages/Recovery.css";

function Recovery()
{
	const { sendRequest, handleBackendError } = useKafka();
	
	const navigate = useNavigate();

	const [email, setEmail] = useState(location.state?.email || "");

	const [isLoading, setIsLoading] = useState(false);

	const emailValidator = useCallback
	(
		(value) =>
		{
			const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
			return regex.test(value);
		},
		[]
	);

	const handleRecovery = async () =>
	{
		if (!emailValidator(email)) { alert("Please enter a valid email address."); return; }
		if (isLoading) { return; }

		setIsLoading(true);

		try
		{
			const response = await sendRequest("recovery_password", { email }, "recovery_password-answer", 15000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "auth")?.topic);
			if (response?.status.toLowerCase() === "success") { alert("A recovery email has been sent to your email address."); navigate("/auth/login"); }
			else { alert("Failed to send recovery email. Please try again later."); }
		}
		catch (error) { alert(handleBackendError(error)); }
		finally { setIsLoading(false); }
	}

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Password Recovery!</h2>
					<p className="subtitle">Enter your email to recover your password</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={email} setInputValue={setEmail} labelText={`email`.toUpperCase()} inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
				</div>

				<div className="buttons-container">
					<CommonButton className="send-email-button" handler={handleRecovery}>Send Email</CommonButton>
				</div>

				{isLoading && <p className="loading-message">Sending recovery email...</p>}
			</div>

			<RightSide/>
		</>
	);
}

export default Recovery;