import { useEffect, useState } from "react";
import { useReports } from "../../../../../../hooks/store/useReports";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import TrafficChannelCard from "./components/TrafficChannelCard";
import SmallLineChartCard from "./components/SmallLineChartCard";

import "./assets/styles/TrafficSource.css";
import "../../../../assets/styles/CustomScrollbar.css";

function TrafficSource()
{
	const { getTrafficSourceData, isLoading } = useReports();
	const [data, setData] = useState(null);

	useEffect
	(
		() => 
		{
			let isMounted = true;
			
			const loadData = async () => 
			{
				try { const result = await getTrafficSourceData(); if (isMounted && result?.data) { setData(result.data); } }
				catch (error) { console.error(error); }
			};

			loadData();
			
			return () => { isMounted = false; };
		},
		[getTrafficSourceData]
	);

	if (!data) 
	{ 
		return (
			<div className="traffic-source-tab custom-scrollbar">
				<LoadingSpinner message="Loading Traffic Source Analytics..." />
			</div>
		);
	}

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