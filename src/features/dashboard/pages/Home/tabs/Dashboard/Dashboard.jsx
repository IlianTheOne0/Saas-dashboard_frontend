const mockData =
{
	"highlights":
	[
		{
			"defaultIconPath": "./assets/images/"
		},
		{
			"title": "total sessions",
			"value": "36.1K",
			"bckgColor": "success",
			"iconPath": "sessions.svg"
		},
		{
			"title": "total visitors",
			"value": "2,642",
			"bckgColor": "primary",
			"iconPath": "visitors.svg",
			"isIncrease": true,
			"percentage": "10%"
		},
		{
			"title": "avg time spend",
			"value": "3.21",
			"bckgColor": "error",
			"iconPath": "time.svg",
			"isIncrease": false,
			"percentage": "3%"
		}
	],
	"chart":
	{
		"today":
		[
			{ time: "9:00", value: 15 },
			{ time: "10:00", value: 25 },
			{ time: "11:00", value: 38 },
			{ time: "12:00", value: 30 },
			{ time: "13:00", value: 18 },
			{ time: "14:00", value: 25 },
			{ time: "15:00", value: 32 },
			{ time: "16:00", value: 55 },
			{ time: "17:00", value: 45 },
			{ time: "18:00", value: 38 },
			{ time: "19:00", value: 50 },
			{ time: "20:00", value: 58 }
		],
		"7d":
		[
			{ time: "Mon", value: 45 },
			{ time: "Tue", value: 52 },
			{ time: "Wed", value: 38 },
			{ time: "Thu", value: 24 },
			{ time: "Fri", value: 33 },
			{ time: "Sat", value: 50 },
			{ time: "Sun", value: 65 }
		],
		"2w":
		[
			{ time: "W1-Mon", value: 30 },
			{ time: "W1-Thu", value: 45 },
			{ time: "W1-Sun", value: 60 },
			{ time: "W2-Mon", value: 40 },
			{ time: "W2-Thu", value: 35 },
			{ time: "W2-Sun", value: 55 }
		],
		"1m":
		[
			{ time: "Week 1", value: 150 },
			{ time: "Week 2", value: 180 },
			{ time: "Week 3", value: 160 },
			{ time: "Week 4", value: 210 }
		]
	}
}

import Sidebar from "../../../../components/common/Sidebar/Sidebar";
import HiglightItem from "./components/HiglightItem";
import Chart from "./components/Chart";

import "./assets/styles/Dashboard.css";
import "../../../../assets/styles/CustomScrollbar.css";

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

			<Sidebar/>
		</div>
	);
}

export default Dashboard;