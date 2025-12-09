import KAFKA_CONFIG from "../../../config/kafka.config";

import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useKafka } from "../../../hooks/services/useKafka";

import CommonInput from "../components/common/CommonInput";
import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import IconCorrectCircle from "../../../assets/images/icons/common/Correct-Circle.svg"
import IconIncorrectCircle from "../../../assets/images/icons/common/Incorrect-Circle.svg"
import IconEye from "../../../assets/images/icons/common/Eye.svg"

import "../assets/styles/pages/Register.css";

function Register()
{
	const { sendRequest, handleBackendError } = useKafka();

	const location = useLocation();
	const navigate = useNavigate();
	
	const [name, setName] = useState("User Number 0");
	const [email, setEmail] = useState(location.state?.email || "wocabe4632@besenica.com");
	const [password, setPassword] = useState("UserNumber:0");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const nameValidator = useCallback((value) => { return value.trim().length >= 2; }, []);
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

	const navigateToLogin = useCallback
	(
		() =>
		{
			const state = {};
			if (emailValidator(email)) { state.email = email; }
			navigate("/auth/login", { state });
		},
		[email]
	);
	const handleRegister = async () =>
	{
		if (!nameValidator(name)) { alert("Please enter a valid name."); return; }
		if (!emailValidator(email)) { alert("Please enter a valid email address."); return; }
		if (!passwordValidator(password)) { alert("Password must be at least 8 characters long, contain at least one uppercase letter and one number."); return; }

		if (isLoading) { return; }

		setIsLoading(true);

		try
		{
			const response = await sendRequest("register", { name, email, password }, "register-answer", 15000, KAFKA_CONFIG.TOPICS_PRODUCER_NAMES.find(topic => topic.name === "auth")?.topic);
			if (response?.status.toLowerCase() === "success") { alert("Registration successful! Please check your email to confirm your account."); navigate("/auth/login", { state: { email } }); }
			else { alert("Registration failed. Please try again."); }
		}
		catch (error) { alert(handleBackendError(error)); }
		finally { setIsLoading(false); }
	}

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Create an account</h2>
					<p className="subtitle">Sign up to continue</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={name} setInputValue={setName} labelText={`name`.toUpperCase()} inputPlaceholder="Davin Wong" validator={nameValidator}/>
					<CommonInput inputValue={email} setInputValue={setEmail} labelText={`email`.toUpperCase()} inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
					<CommonInput inputValue={password} setInputValue={setPassword} className="password-input" labelText={`password`.toUpperCase()} inputType={isPasswordVisible ? "text" : "password"} inputPlaceholder={isPasswordVisible ? "StrongPassword123!" : "••••••••••••••••••"} inputIcon={IconEye} iconClickHandler={passwordIconClickHandler} validator={passwordValidator}/>
				</div>

				<div className="buttons-container">
					<CommonButton className="create-button" handler={handleRegister} disabled={isLoading}>Create an account</CommonButton>
					<CommonButton className="create-account-button" handler={navigateToLogin}>Already have an account? Login</CommonButton>
				</div>

				{isLoading && <p className="loading-message">Registering...</p>}
			</div>

			<RightSide/>
		</>
	);
}

export default Register;