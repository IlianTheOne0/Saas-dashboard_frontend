import { useEffect, useState } from "react";
import { useReports } from "../../../../../../hooks/store/useReports";

import LoadingSpinner from "../../../../../../components/LoadingSpinner";
import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import HiglightItem from "./components/HiglightItem";
import Chart from "./components/Chart";
import BottomCard from "./components/BottomCard";

import "./assets/styles/Dashboard.css";
import "../../../../assets/styles/CustomScrollbar.css";

function Dashboard()
{
	const { getDashboardData, isLoading } = useReports();
	const [data, setData] = useState(null);

	useEffect
	(
		() => 
		{
			let isMounted = true;
			
			const loadData = async () => 
			{
				try { const result = await getDashboardData(); if (isMounted && result?.data) { setData(result.data); } }
				catch (error) { console.error(error); }
			};

			loadData();
			
			return () => { isMounted = false; };
		},
		[getDashboardData]
	);

	if (!data) 
	{ 
		return (
			<div className="dashboard-tab custom-scrollbar">
				<LoadingSpinner message="Loading Dashboard Analytics..." />
			</div>
		);
	}

	return (
		<div className="dashboard-tab custom-scrollbar">
			<section className="highlights-section">
				{
					data.highlights.slice(1).map
					(
						(item, index) =>
						(
							<>
								<HiglightItem
									key={index}
									bckgColor={item.bckgColor} iconSrc={require(`${data.highlights[0].defaultIconPath}${item.iconPath}`)}
									number={item.value} label={item.title}
									isIncrease={item.isIncrease} percentage={item.percentage}
								/>
							</>
						)
					)
				}
			</section>

			<section className="chart-section">
				<Chart data={data.chart}/>
			</section>

			<section className="bottom-cards-section">
				{
					data.bottomCards.map
					(
						(card) =>
						(
							<BottomCard key={card.id} id={card.id} title={card.title} value={card.value} colorHex={card.color} chartData={card.data}/>
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

export default Dashboard;