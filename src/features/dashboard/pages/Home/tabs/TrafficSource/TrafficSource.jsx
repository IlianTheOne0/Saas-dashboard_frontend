import { useEffect, useState } from "react";

import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import TrafficChannelCard from "./components/TrafficChannelCard";
import SmallLineChartCard from "./components/SmallLineChartCard";

import "./assets/styles/TrafficSource.css";
import "../../../../assets/styles/CustomScrollbar.css";

const mockData = require("./assets/data/mockData.json");

function TrafficSource()
{
	const [data, setData] = useState(null);

	useEffect(() => { setData(mockData); }, []);

	if (!data) { return null; }

	return (
		<div className="traffic-source-tab custom-scrollbar">
			<TrafficChannelCard stats={data.stats} chartData={data.trafficChart}/>

			<div className="bottom-row">
			{
				data.bottomCards.map
				(
					card =>
					(
						<SmallLineChartCard key={card.id} id={card.id} title={card.title} values={card.values} color={card.color} data={card.chartData}/>
					)
				)
			}
			</div>

			<Sidebar>
				<SidebarContent data={data.sidebar}/>
			</Sidebar>
		</div>
	);
}

export default TrafficSource;