import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
	const navigate = useNavigate();
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

	const passwordIconClickHandler = () => { console.log("asdasd"); setIsPasswordVisible(!isPasswordVisible); };

	const navigateToRegister = useCallback(() => { navigate("/auth/register", {email: email }); }, [email]);
	const navigateToRecovery = useCallback(() => { navigate("/auth/recovery", {email: email }); }, [email]);

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Welcome Back!</h2>
					<p className="subtitle">Sign in to continue</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={email} setInputValue={setEmail} labelText="EMAIL" inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
					<CommonInput inputValue={password} setInputValue={setPassword} className="password-input" labelText="PASSWORD" inputType={isPasswordVisible ? "text" : "password"} inputPlaceholder={isPasswordVisible ? "StrongPassword123!" : "••••••••••••••••••"} inputIcon={IconEye} iconClickHandler={passwordIconClickHandler} validator={passwordValidator}/>
				</div>

				<p className="forgot-password" onClick={navigateToRecovery}>Forgot Password?</p>

				<div className="buttons-container">
					<CommonButton className="login-button">Login</CommonButton>
					<CommonButton className="create-account-button" handler={navigateToRegister}>Create an account</CommonButton>
				</div>
			</div>

			<RightSide/>
		</>
	);
}

export default Login;