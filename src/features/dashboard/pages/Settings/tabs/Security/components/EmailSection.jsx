import { useState } from "react";
import { useUser } from "../../../../../../../hooks/store/useUser";
import "../assets/styles/EmailSection.css";

function EmailSection({ currentEmail })
{
	const { updateEmail } = useUser();
	const [newEmail, setNewEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async () => { if (!newEmail || !newEmail.includes("@")) { alert("Please enter a valid email address."); return; }

	setIsLoading(true);
	try
	{
		const response = await updateEmail(newEmail);

		if(response.status === "Success") { alert("Confirmation email sent to both old and new addresses. Please confirm to finalize the change."); setNewEmail(""); }
		else { alert("Failed: " + response.message); } }
		catch(error) { alert("Error: " + error.message); }
		finally { setIsLoading(false); }
	};

	return (
		<div className="email-section">
			<h3 className="section-title">Email Address</h3>

			<div className="form-grid">
				<div className="form-group">
					<label>CURRENT EMAIL</label>
					<div className="input-read-only">{currentEmail || "Loading..."}</div>
				</div>

				<div className="form-group">
					<label>NEW EMAIL</label>
					<input type="email" placeholder="Enter new email address"value={newEmail}onChange={(event) => setNewEmail(event.target.value)}/>
				</div>
			</div>

			<div className="action-row">
				<button className="btn btn-success" onClick={handleSubmit} disabled={!newEmail || isLoading}>{isLoading ? "Updating..." : "Update Email"}</button>
			</div>
		</div>
	);
}

export default EmailSection;