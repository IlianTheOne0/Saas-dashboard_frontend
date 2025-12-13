import KAFKA_CONFIG from "../../../config/kafka.config";

import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useKafka } from "../../../hooks/services/useKafka";
import { useUser } from "../../../hooks/store/useUser";

import CommonInput from "../components/common/CommonInput";
import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import IconCorrectCircle from "../../../assets/images/icons/common/Correct-Circle.svg"
import IconIncorrectCircle from "../../../assets/images/icons/common/Incorrect-Circle.svg"
import IconEye from "../../../assets/images/icons/common/Eye.svg"

import "../assets/styles/pages/Login.css";

function Login()
{
	const { sendRequest, handleBackendError } = useKafka();
	const { saveAccessToken } = useUser();

	const location = useLocation();
	const navigate = useNavigate();
	
	const [email, setEmail] = useState(location.state?.email || "xeyinev887@badfist.com");
	const [password, setPassword] = useState("UserNumber:05");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(location.state?.error || null);
	const [errorDescription, setErrorDescription] = useState(location.state?.error_description || null);

	const emailValidator = useCallback
	(
		(value) =>
		{
			const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
			return regex.test(value);
		},
		[]
	);
	const passwordValidator = useCallback
	(
		(value) =>
		{
			const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
			return regex.test(value) && value.length >= 8;
		},
		[]
	);

	const passwordIconClickHandler = () => { setIsPasswordVisible(!isPasswordVisible); };

	const navigateFirstCheck = () => { if (emailValidator(email)) { return { state: { email } }; } }
	const navigateToRegister = useCallback(() => { navigate("/auth/register", navigateFirstCheck()); }, [email]);
	const navigateToRecovery = useCallback(() => { navigate("/auth/recovery", navigateFirstCheck()); }, [email]);

	const handleLogin = async () =>
	{
		if (!emailValidator(email)) { setError("Please enter a valid email address."); return; }
		if (!passwordValidator(password)) { setError("Password must be at least 8 characters long, contain at least one uppercase letter and one number."); return; }

		if (isLoading) { return; }

		setIsLoading(true);

		try
		{
			const response = await sendRequest("login", { email, password }, "login-answer", 15000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "auth")?.topic);
			
			if (response?.status.toLowerCase() === "success")
			{
				if (response.data) 
				{
					const token = response.data;
					saveAccessToken(token); 
				}
				else { saveAccessToken(null); }

				navigate("/dashboard");
			}
			else { setError("Login failed. Please check your credentials and try again."); }
		}
		catch (error) { setError(handleBackendError(error)); }
		finally { setIsLoading(false); }
	}

	useEffect
	(
		() =>
		{
			if (error) { alert(`${error}${errorDescription ? `: ${errorDescription}` : ""}`); setError(null); setErrorDescription(null); }
		},
		[error]
	);

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Welcome Back!</h2>
					<p className="subtitle">Sign in to continue</p>
				</div>
				<div className="inputs-container">
					<CommonInput inputValue={email} setInputValue={setEmail} labelText={`email`.toUpperCase()} inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
					<CommonInput inputValue={password} setInputValue={setPassword} className="password-input" labelText={`password`.toUpperCase()} inputType={isPasswordVisible ? "text" : "password"} inputPlaceholder={isPasswordVisible ? "StrongPassword123!" : "••••••••••••••••••"} inputIcon={IconEye} iconClickHandler={passwordIconClickHandler} validator={passwordValidator}/>
				</div>

				<p className="forgot-password" onClick={navigateToRecovery}>Forgot Password?</p>

				<div className="buttons-container">
					<CommonButton className="login-button" handler={handleLogin}>Login</CommonButton>
					<CommonButton className="create-account-button" handler={navigateToRegister}>Create an account</CommonButton>
				</div>
				
				{isLoading && <p className="loading-message">Logging in...</p>}		
			</div>

			<RightSide/>
		</>
	);
}

export default Login;