import { useState } from "react";

import ArrowIcon from "../../../assets/images/arrow_up.svg"; 

import "../assets/styles/FAQItem.css";

function FAQItem({ question, answer })
{
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={`faq-item ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
			<div className="faq-header">
				<span className="question">{question}</span>
				<img src={ArrowIcon} alt="Toggle" className="arrow" style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}/>
			</div>
			{isOpen && <div className="faq-body">{answer}</div>}
		</div>
	);
}

export default FAQItem;