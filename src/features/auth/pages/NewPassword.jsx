import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useKafka } from "../../../hooks/services/useKafka";

import CommonInput from "../components/common/CommonInput";
import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import IconEye from "../../../assets/images/icons/common/Eye.svg"

import "../assets/styles/pages/NewPassword.css";

function NewPassword()
{
	const { sendRequest, handleBackendError } = useKafka();

	const location = useLocation();
	const navigate = useNavigate();

	const [accessToken, _] = useState(location.state?.access_token || "");
	const [refreshToken, __] = useState(location.state?.refresh_token || "");

	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	
	const [isLoading, setIsLoading] = useState(false);
	
	const passwordIconClickHandler = () => { setIsPasswordVisible(!isPasswordVisible); };
	
	const passwordValidator = useCallback
	(
		(value) =>
		{
			const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
			return regex.test(value) && value.length >= 8;
		},
		[]
	);

	useEffect
	(
		() =>
		{
			if (!accessToken || !refreshToken) { navigate("/auth/login", { state: { error: "Missing tokens", error_description: "Access token or refresh token is missing." } }); }
		},
		[accessToken, refreshToken]
	);

	const handleNewPassword = async () =>
	{
		if (!passwordValidator(password)) { alert("Password must be at least 8 characters long, contain at least one uppercase letter and one number."); return; }
		if (isLoading) { return; }

		setIsLoading(true);

		try
		{
			const response = await sendRequest("new_password", { password, accessToken, refreshToken }, "new_password-answer", 15000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "auth")?.topic);
			console.log(response);
			if (response?.status.toLowerCase() === "success") { alert("Your password has been successfully updated."); navigate("/auth/login"); }
			else { alert("Failed to update password. Please try again later."); }
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
					<p className="subtitle">Enter your new password</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={password} setInputValue={setPassword} className="password-input" labelText={`password`.toUpperCase()} inputType={isPasswordVisible ? "text" : "password"} inputPlaceholder={isPasswordVisible ? "StrongPassword123!" : "••••••••••••••••••"} inputIcon={IconEye} iconClickHandler={passwordIconClickHandler} validator={passwordValidator}/>
				</div>

				<div className="buttons-container">
					<CommonButton className="send-password-button" handler={handleNewPassword}>Send Password</CommonButton>
				</div>

				{isLoading && <p className="loading-message">Sending recovery email...</p>}
			</div>

			<RightSide/>
		</>
	);
}

export default NewPassword;