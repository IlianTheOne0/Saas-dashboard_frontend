import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../../../../../hooks/useUser";

import PasswordSection from "./components/PasswordSection";
import EmailSection from "./components/EmailSection";

import "./assets/styles/Security.css";

function Security()
{
	const { getPersonalData } = useUser();
	const [email, setEmail] = useState("");

	useEffect
	(
		() =>
		{
			const loadData = async () =>
			{
				const data = await getPersonalData();
				if (data && data.data && data.data.Email) { setEmail(data.data.Email); }
				else { setEmail("davin.wong@mail.com"); }
			};
			loadData();
		},
		[getPersonalData]
	);

	const handleUpdateEmail = useCallback((newEmail) => { setEmail(newEmail); alert(`Email successfully changed to ${newEmail}`); }, []);

	return (
		<div className="security-tab">
			<h2 className="page-title">Security & Privacy</h2>

			<div className="security-content">
				<PasswordSection/>
				<EmailSection currentEmail={email} onUpdateEmail={handleUpdateEmail}/>
			</div>
		</div>
	);
}

export default Security;