import { useState, useEffect } from "react";
import { useUser } from "../../../../../../hooks/useUser";

import ProfileSection from "./components/ProfileSection";
import BasicInfoForm from "./components/BasicInfoForm";

import "./assets/styles/MyAccount.css";

function MyAccount()
{
	const { getPersonalData, updateProfile, uploadAvatar, deleteAvatar } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState
	(
		{
			firstName: "",
			lastName: "",
			email: "",
			role: "",
			location: "",
			timezone: "",
			phone: "",
			avatarUrl: null
		}
	);

	useEffect
	(
		() =>
		{
			const loadData = async () =>
			{
				const data = await getPersonalData();
				
				if (data && data.data)
				{
					const names = data.data.Name ? data.data.Name.split(" ") : ["", ""];

					setFormData
					(
						previous =>
						(
							{
								...previous,
								firstName: names[0],
								lastName: names.slice(1).join(" ") || "",
								email: data.data.Email || "",
								role: data.data.Role || "",
								location: data.data.Location || "",
								timezone: data.data.Timezone || "",
								phone: data.data.Phone || "",
								avatarUrl: data.data.AvatarUrl
							}
						)
					);
				}
			};

			loadData();
		},
		[getPersonalData]
	);

	const handleInputChange = (event) => { const { name, value } = event.target; setFormData(previous => ({ ...previous, [name]: value })); };

	const handleSave = async () =>
	{
		setIsLoading(true);
		
		try
		{
			const payload =
			{
				Name: `${formData.firstName} ${formData.lastName}`.trim(),
				Role: formData.role,
				Location: formData.location,
				Timezone: formData.timezone,
				Phone: formData.phone
			};

			const response = await updateProfile(payload);

			if(response.status === "Success") { alert("Profile updated successfully!"); }
			else { alert("Failed to update profile: " + response.message); } }
			catch(error) { alert("Error: " + error.message); }
			finally { setIsLoading(false); }
		};

		const handleAvatarUpload = async (file) =>
		{
			try
			{
				const response = await uploadAvatar(file);
				if(response.status === "Success") { setFormData(prev => ({ ...prev, avatarUrl: response.data })); alert("Avatar updated!"); }
				else { alert("Upload failed: " + response.message); }
			}
			catch (error) { alert("Error uploading: " + error.message); }
		};

		const handleAvatarDelete = async () => { if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

		try
		{
			const response = await deleteAvatar();

			if(response.status === "Success") { setFormData(prev => ({ ...prev, avatarUrl: null })); alert("Avatar removed."); }
			else { alert("Delete failed: " + response.message); } }
			catch (error) { alert("Error deleting: " + error.message); }
		};

	return (
		<div className="my-account-tab">
			<h2 className="page-title">Account Informations</h2>

			<ProfileSection avatarUrl={formData.avatarUrl} onUpload={handleAvatarUpload} onDelete={handleAvatarDelete}/>
			<BasicInfoForm formData={formData} onChange={handleInputChange}/>

			<div className="form-footer">
				<button className="btn-success" onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</button>
			</div>
		</div>
	);
}

export default MyAccount;