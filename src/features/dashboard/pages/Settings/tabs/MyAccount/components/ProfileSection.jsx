import { useRef, useState } from "react";

import DefaultAvatar from "../../../../../assets/images/default_avatar.jpg";
import BinImage from "../assets/images/bin.svg";

import "../assets/styles/ProfileSection.css";

function ProfileSection({ avatarUrl, onUpload, onDelete })
{
	const fileInputRef = useRef(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleReplaceClick = () => { fileInputRef.current.click(); };

	const handleFileChange = async (event) =>
	{
		const file = event.target.files[0];
		if (!file) { return; }

		const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!validTypes.includes(file.type)) { alert("Please select a valid image (JPEG, PNG, WEBP)."); return; }

		if (file.size > 500 * 1024) { alert("File is too large. Please select an image under 500KB."); return; }

		setIsUploading(true);

		try { await onUpload(file); }
		catch (error) { console.error(error); alert("Upload failed."); }
		finally { setIsUploading(false); event.target.value = null; } 
	};

	return (
		<div className="profile-section">
			<input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileChange}/>

			<div className="avatar-wrapper">
				<img src={avatarUrl || DefaultAvatar} alt="Profile" className="profile-avatar" style={{ opacity: isUploading ? 0.5 : 1 }}/>
			</div>

			<div className="profile-actions">
				<h3 className="section-label">Profile Picture</h3>

				<div className="button-group">
					<button className="btn btn-primary" onClick={handleReplaceClick} disabled={isUploading}>{isUploading ? "Uploading..." : "Replace"}</button>
					<button className="btn btn-outline" onClick={onDelete} disabled={isUploading || !avatarUrl}>
						<img src={BinImage} alt="Delete" className="btn-icon"/>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProfileSection;