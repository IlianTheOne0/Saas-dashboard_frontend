import { useState, useCallback } from "react";

import CommonInput from "../components/common/CommonInput";
import CommonButton from "../components/common/CommonButton";

import Logo from "../components/Logo";
import RightSide from "../components/common/RightSide";

import IconCorrectCircle from "../../../assets/images/icons/common/Correct-Circle.svg"
import IconIncorrectCircle from "../../../assets/images/icons/common/Incorrect-Circle.svg"

import "../assets/styles/pages/Recovery.css";

function Recovery()
{	
	const [email, setEmail] = useState("");

	const emailValidator = useCallback
	(
		(value) =>
		{
			const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
			return regex.test(value);
		},
		[]
	);

	return (
		<>
			<div className="left-side">
				<Logo/>

				<div>
					<h2 className="title">Password Recovery!</h2>
					<p className="subtitle">Enter your email to recover your password</p>
				</div>
				
				<div className="inputs-container">
					<CommonInput inputValue={email} setInputValue={setEmail} labelText="EMAIL" inputPlaceholder="davin.wong@mail.com" inputIcon={[IconCorrectCircle, IconIncorrectCircle]} validator={emailValidator}/>
				</div>

				<div className="buttons-container">
					<CommonButton className="send-email-button">Send Email</CommonButton>
				</div> 
			</div>

			<RightSide/>
		</>
	);
}

export default Recovery;