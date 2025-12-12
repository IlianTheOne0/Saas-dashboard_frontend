const faqs = require("./assets/data/faqs.json");

import FAQItem from "./components/FAQItem";

import "./assets/styles/Help.css";

function Help()
{
	return (
		<div className="help-tab">
			<h2 className="page-title">Help & Support</h2>

			<div className="help-section">
				<h3 className="section-title">Frequently Asked Questions</h3>
				<div className="faq-list">
					{
						faqs.map
						(
							(item, index) => (<FAQItem key={index} question={item.question} answer={item.answer}/>)
						)
					}
				</div>
			</div>

			<div className="contact-support-card">
				<div className="text-content">
					<h4>Still need help?</h4>
					<p>Our support team is available 24/7 to assist you with any issues. (Currently unavailable)</p>
				</div>
				<button className="btn btn-primary" disabled>Contact Support</button>
			</div>
		</div>
	);
}

export default Help;