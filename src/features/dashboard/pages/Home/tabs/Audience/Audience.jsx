import { useEffect, useState } from "react";
import { useReports } from "../../../../../../hooks/store/useReports";

import LoadingSpinner from "../../../../../../components/LoadingSpinner"
import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import DonutStatCard from "./components/DonutStatCard";
import LocationsSection from "./components/LocationsSection";
import SystemInfoCard from "./components/SystemInfoCard";

import "./assets/styles/Audience.css";
import "../../../../assets/styles/CustomScrollbar.css";

function Audience()
{
	const { getAudienceData, isLoading } = useReports();
	const [data, setData] = useState(null);

	useEffect
	(
		() => 
		{
			let isMounted = true;
			
			const loadData = async () => 
			{
				try { const result = await getAudienceData(); if (isMounted && result?.data) { setData(result.data); } }
				catch (error) { console.error(error); }
			};

			loadData();
			
			return () => { isMounted = false; };
		},
		[getAudienceData]
	);

	if (!data) 
	{ 
		return (
			<div className="audience-tab custom-scrollbar">
				<LoadingSpinner message="Loading Audience Analytics..." />
			</div>
		);
	}
	
	return (
		<div className="audience-tab custom-scrollbar">
			<section className="stats-row">
				{
					data.stats.map
					(
						(stat) =>
						(
							<DonutStatCard key={stat.id} id={stat.id} title={stat.title} data={stat.data} color={stat.color}/>
						)
					)
				}
			</section>

			<section className="locations-section">
				<LocationsSection mapData={data.locations.mapData} listData={data.locations.list}/>
			</section>

			<section className="systems-row">
				{
					data.systems.map
					(
						(sys, index) =>
						(
							<SystemInfoCard key={index} title={sys.title} items={sys.items}/>
						)
					)
				}
			</section>

			<Sidebar>
				<SidebarContent data={data.sidebar}/>
			</Sidebar>
		</div>
	);
}

export default Audience;