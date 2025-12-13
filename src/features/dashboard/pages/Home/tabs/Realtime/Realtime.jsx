import { useEffect, useState } from "react";
import { useReports } from "../../../../../../hooks/store/useReports";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import SidebarContent from "./components/SidebarContent";
import Counter from "./components/Counter";
import LocationsMap from "./components/LocationsMap";
import PageViewsChart from "./components/PageViewsChart";

import Sidebar from "../../../../components/common/Sidebar/Sidebar";

import "./assets/styles/Realtime.css";
import "../../../../assets/styles/CustomScrollbar.css";

function Realtime()
{
	const { getRealtimeData, isLoading } = useReports();
	const [data, setData] = useState(null);

	useEffect
	(
		() => 
		{
			let isMounted = true;
			
			const loadData = async () => 
			{
				try { const result = await getRealtimeData(); if (isMounted && result?.data) { setData(result.data); } }
				catch (error) { console.error(error); }
			};

			loadData();
			
			return () => { isMounted = false; };
		},
		[getRealtimeData]
	);

	if (!data) 
	{ 
		return (
			<div className="realtime-tab custom-scrollbar">
				<LoadingSpinner message="Loading Realtime Analytics..." />
			</div>
		);
	}

	return (
		<div className="realtime-tab custom-scrollbar">
			<section className="top-section">
				<Counter data={data.rightNow}/>
				<LocationsMap data={data.topLocations}/>
			</section>

			<section className="chart-section">
				<PageViewsChart data={data.pageViews}/>
			</section>

			<Sidebar>
				<SidebarContent data={data.sidebar}/>
			</Sidebar>
		</div>
	);
}

export default Realtime;