import { useState } from "react";
import { useUser } from "../../../../../../../hooks/useUser";

import "../assets/styles/PasswordSection.css";

function PasswordSection()
{
	const { changePassword } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [isEditing, setIsEditing] = useState(false);

	const handleChangePassword = async () => { if(newPassword.length < 6) { alert("Password must be at least 6 characters"); return; }

	setIsLoading(true);
	try
	{
		const response = await changePassword(newPassword);

		if (response.status === "Success") { alert("Password changed successfully!"); setIsEditing(false); setNewPassword(""); }
		else { alert("Failed: " + response.message); } }
		catch (error) { alert("Error: " + error.message); }
		finally { setIsLoading(false); }
	};

	return (
		<div className="password-section">
			<div className="section-header-group">
				<h3 className="section-title">Password</h3>
				<p className="section-subtitle">Manage your password to keep your account secure.</p>
			</div>

			{
				!isEditing ?
				(
					<button className="btn btn-primary" onClick={() => setIsEditing(true)}>Change Password</button>
				)
				:
				(
				<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
					<input type="password" placeholder="New Password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid gray' }}/>
					<button className="btn btn-primary" onClick={handleChangePassword} disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</button>
					<button className="btn" onClick={() => setIsEditing(false)} style={{ border: '1px solid gray' }}>Cancel</button>
				</div>
				)
			}
		</div>
	);
}

export default PasswordSection;