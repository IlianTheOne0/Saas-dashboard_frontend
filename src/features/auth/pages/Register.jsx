import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
	const location = useLocation();
	const navigate = useNavigate();
	
	const [name, setName] = useState("");
	const [email, setEmail] = useState(location.state?.email || "");
	const [password, setPassword] = useState("");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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

	const passwordIconClickHandler = () => { console.log("asdasd"); setIsPasswordVisible(!isPasswordVisible); };

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

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Create an account</h2>
					<p className="subtitle">Sign up to continue</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={name} setInputValue={setName} labelText="NAME" inputPlaceholder="Davin Wong" validator={nameValidator}/>
					<CommonInput inputValue={email} setInputValue={setEmail} labelText="EMAIL" inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
					<CommonInput inputValue={password} setInputValue={setPassword} className="password-input" labelText="PASSWORD" inputType={isPasswordVisible ? "text" : "password"} inputPlaceholder={isPasswordVisible ? "StrongPassword123!" : "••••••••••••••••••"} inputIcon={IconEye} iconClickHandler={passwordIconClickHandler} validator={passwordValidator}/>
				</div>

				<div className="buttons-container">
					<CommonButton className="create-button">Create an account</CommonButton>
					<CommonButton className="create-account-button" handler={navigateToLogin}>Already have an account? Login</CommonButton>
				</div>
			</div>

			<RightSide/>
		</>
	);
}

export default Register;