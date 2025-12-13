import { useEffect, useState } from "react";
import { useReports } from "../../../../../../hooks/store/useReports";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import FAQItem from "./components/FAQItem";

import "./assets/styles/Help.css";

function Help()
{
	const { getFaqsData, isLoading } = useReports();
	const [faqs, setFaqs] = useState(null);

	useEffect
	(
		() => 
		{
			let isMounted = true;
			
			const loadData = async () => 
			{
				try { const result = await getFaqsData(); if (isMounted && result?.data) { setFaqs(result.data); } }
				catch (error) { console.error(error); }
			};

			loadData();
			
			return () => { isMounted = false; };
		},
		[getFaqsData]
	);

	if (!faqs) 
	{ 
		return (
			<div className="help-tab custom-scrollbar">
				<LoadingSpinner message="Loading FAQs..." />
			</div>
		);
	}

	return (
		<div className="help-tab">
			<h2 className="page-title">Help & Support</h2>

			<div className="help-section">
				<h3 className="section-title">Frequently Asked Questions</h3>

				{
					isLoading ?
					(
						<div className="loading-container">
							<LoadingSpinner message="Loading FAQs..." />
						</div>
					)
					:
					(
						<div className="faq-list">
							{
								faqs.length > 0 ?
								(
									faqs.map((item, index) => (<FAQItem key={index} question={item.question} answer={item.answer}/>))
								)
								:
								(
									<p className="empty-state">No FAQs available at the moment.</p>
								)
							}
						</div>
					)
				}
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