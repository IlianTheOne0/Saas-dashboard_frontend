const mockData = require("./assets/data/mockData.json");

import SidebarContent from "./components/SidebarContent";
import Counter from "./components/Counter";
import LocationsMap from "./components/LocationsMap";
import PageViewsChart from "./components/PageViewsChart";

import Sidebar from "../../../../components/common/Sidebar/Sidebar";

import "./assets/styles/Realtime.css";
import "../../../../assets/styles/CustomScrollbar.css";

function Realtime()
{
	return (
		<div className="realtime-tab custom-scrollbar">
			<section className="top-section">
				<Counter data={mockData.rightNow} />
				<LocationsMap data={mockData.topLocations} />
			</section>

			<section className="chart-section">
				<PageViewsChart data={mockData.pageViews} />
			</section>

			<Sidebar>
				<SidebarContent data={mockData.sidebar}/>
			</Sidebar>
		</div>
	);
}

export default Realtime;