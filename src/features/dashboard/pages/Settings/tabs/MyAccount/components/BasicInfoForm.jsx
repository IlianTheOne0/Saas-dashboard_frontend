import "../assets/styles/BasicInfoForm.css";

function BasicInfoForm({ formData, onChange })
{
	return (
		<div className="basic-info-form">
			<h3 className="section-header">Basic Information</h3>

			<div className="form-grid">
				<div className="form-group">
					<label>FISRT NAME</label>
					<input type="text" name="firstName" value={formData.firstName} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>LAST NAME</label>
					<input type="text" name="lastName" value={formData.lastName} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>EMAIL</label>
					<input type="email" name="email" value={formData.email} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>ROLE</label>
					<input type="text" name="role" value={formData.role} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>LOCATION</label>
					<input type="text" name="location" value={formData.location} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>TIMEZONE</label>
					<input type="text" name="timezone" value={formData.timezone} onChange={onChange}/>
				</div>

				<div className="form-group">
					<label>PHONE NUMBER</label>
					<input type="tel" name="phone" value={formData.phone} onChange={onChange}/>
				</div>
			</div>
		</div>
	);
}

export default BasicInfoForm;