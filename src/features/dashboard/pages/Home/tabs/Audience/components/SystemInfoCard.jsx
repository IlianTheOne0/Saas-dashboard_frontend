import { useTheme } from "../../../../../../../hooks/store/useTheme";

import "../assets/styles/SystemInfoCard.css";

function SystemInfoCard({ title, items })
{
	const { theme } = useTheme();

	const getIcon = (name) => 
	{
		if(!name) return null;
		return `https://raw.githubusercontent.com/IlianTheOne0/Saas-dashboard_frontend/refs/heads/developer/src/features/dashboard/pages/Home/tabs/Audience/assets/images/${name}`;
	}

	return (
		<div className="card system-info-card">
			<h3 className="card-title">{title}</h3>
			
			<div className="items-list">
				{
					items.map
					(
						(item, index) =>
						(
							<div key={index} className="system-row-container">
								<div className="sys-item">
									<div className="info-row">
										<div className="left">
											<img src={getIcon(item.icon)} alt={item.name} className="icon"/>
											<span className="name">{item.name}</span>
										</div>
										<div className="right">
											<div className="progress-bg">
												<div className="progress-fill" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
											</div>
											<span className="percentage">{item.value}%</span>
										</div>
									</div>
								</div>
								
								{index < items.length - 1 && <div className="splitter"></div>}
							</div>
						)
					)
				}
			</div>
		</div>
	);
}

export default SystemInfoCard;