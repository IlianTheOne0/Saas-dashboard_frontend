import { useState, useEffect } from "react";

import useDebounce from "../../../../hooks/useDebounce";

import "../../assets/styles/common/CommonInput.css"

function CommonInput({ inputValue, setInputValue, className, labelText, inputType = "text", inputPlaceholder, validator, inputIcon, iconClickHandler })
{
	const [image, setImage] = useState
	(
		() =>
		{
			if (!inputIcon) { return null; }
			if (Array.isArray(inputIcon)) { return inputIcon[1]; }
			return inputIcon;
		}
	);

	const debouncedValue = useDebounce(inputValue, 300);

	useEffect
	(
		() =>
		{
			if (!validator) { return; }

			const isValid = validator(debouncedValue);
			if (Array.isArray(inputIcon)) { setImage(isValid ? inputIcon[0] : inputIcon[1]); }
		},
		[debouncedValue, validator, inputIcon]
	);

	const handleChange = (event) => { setInputValue(event.target.value); };

	return (
		<div className={`common-input${className ? ` ${className}` : ""}`}>
			{labelText && <label className="label">{labelText}</label>}
			<input value={inputValue} className="input" onChange={handleChange} type={inputType} placeholder={inputPlaceholder}/>
			{image && <img className="input-icon" src={image} alt="icon" onClick={iconClickHandler}/>}
		</div>
	);
}

export default CommonInput;