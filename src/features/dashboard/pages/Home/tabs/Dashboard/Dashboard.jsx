import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import SidebarContent from "./components/SidebarContent";
import HiglightItem from "./components/HiglightItem";
import Chart from "./components/Chart";
import BottomCard from "./components/BottomCard";

import "./assets/styles/Dashboard.css";
import "../../../../assets/styles/CustomScrollbar.css";

const mockData = require("./assets/data/mockData.json");

function Dashboard()
{
	return (
		<div className="dashboard-tab custom-scrollbar">
			<section className="highlights-section">
				{
					mockData.highlights.slice(1).map
					(
						(item, index) =>
						(
							<>
								<HiglightItem
									key={index}
									bckgColor={item.bckgColor} iconSrc={require(`${mockData.highlights[0].defaultIconPath}${item.iconPath}`)}
									number={item.value} label={item.title}
									isIncrease={item.isIncrease} percentage={item.percentage}
								/>
							</>
						)
					)
				}
			</section>

			<section className="chart-section">
				<Chart data={mockData.chart}/>
			</section>

			<section className="bottom-cards-section">
				{
					mockData.bottomCards.map
					(
						(card) =>
						(
							<BottomCard key={card.id} id={card.id} title={card.title} value={card.value} colorHex={card.color} chartData={card.data}/>
						)
					)
				}
			</section>

			<Sidebar>
				<SidebarContent data={mockData.sidebar}/>
			</Sidebar>
		</div>
	);
}

export default Dashboard;