import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import DonutStatCard from "./components/DonutStatCard";
import LocationsSection from "./components/LocationsSection";
import SystemInfoCard from "./components/SystemInfoCard";

import "./assets/styles/Audience.css";
import "../../../../assets/styles/CustomScrollbar.css";

const mockData = require("./assets/data/mockData.json");

function Audience()
{
	return (
		<div className="audience-tab custom-scrollbar">
			<section className="stats-row">
				{
					mockData.stats.map
					(
						(stat) =>
						(
							<DonutStatCard key={stat.id} id={stat.id} title={stat.title} data={stat.data} color={stat.color}/>
						)
					)
				}
			</section>

			<section className="locations-section">
				<LocationsSection mapData={mockData.locations.mapData} listData={mockData.locations.list} />
			</section>

			<section className="systems-row">
				{
					mockData.systems.map
					(
						(sys, index) =>
						(
							<SystemInfoCard key={index} title={sys.title} items={sys.items} />
						)
					)
				}
			</section>

			<Sidebar>
				<SidebarContent data={mockData.sidebar} />
			</Sidebar>
		</div>
	);
}

export default Audience;