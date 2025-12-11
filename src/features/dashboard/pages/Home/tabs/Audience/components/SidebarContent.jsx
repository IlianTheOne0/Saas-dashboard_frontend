import { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import UserIcon from "../assets/images/user.svg";

import "../assets/styles/SidebarContent.css";

function SidebarContent({ data })
{
	useLayoutEffect
	(
		() =>
		{
			if (!data) { return; }

			let root = am5.Root.new("audience-sidebar-chart");
			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5percent.PieChart.new
				(
					root, 
					{ 
						layout: root.verticalLayout,
						innerRadius: am5.percent(70) 
					}
				)
			);

			let series = chart.series.push
			(
				am5percent.PieSeries.new
				(
					root, 
					{ 
						valueField: "value", 
						categoryField: "category",
						alignLabels: false
					}
				)
			);

			series.labels.template.set("visible", false);
			series.ticks.template.set("visible", false);
			series.slices.template.setAll({ strokeOpacity: 0, tooltipText: "{category}: {value}%" });

			series.slices.template.adapters.add
			(
				"fill", 
				function(fill, target) 
				{
					if (target.dataItem.dataContext.color) { return am5.color(target.dataItem.dataContext.color); }
					return fill;
				}
			);

			series.data.setAll(data.age.chartData);
			series.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[data]
	);

	if (!data) { return null; }

	return (
		<div className="audience-sidebar custom-scrollbar">
			
			<div className="sidebar-section">
				<h3 className="section-title">Screen Resolution</h3>
				<div className="resolution-list">
					{
						data.resolutions.map
						(
							(res, index) =>
							(
								<div className="res-item" key={index}>
									<div className="res-info">
										<span className="res-name">{res.name}</span>
										<span className="val">{res.value}%</span>
									</div>
									<div className="progress-bg">
										<div className="progress-fill" style={{ width: `${res.value}%` }}></div>
									</div>
								</div>
							)
						)
					}
				</div>
			</div>

			<div className="divider"></div>

			<div className="sidebar-section">
				<h3 className="section-title">User Age</h3>
				<div className="chart-container">
					<div id="audience-sidebar-chart"></div>
				</div>

				<div className="age-legend">
					{
						data.age.legend.map
						(
							(item, index) =>
							(
								<div className="legend-item" key={index}>
									<div className="icon-box">
										<img src={UserIcon} alt="User Icon"/>
									</div>
									<div className="legend-info">
										<span className="label">{item.label}</span>
										<span className="val">{item.value}</span>
									</div>
									<div className={`change ${item.isIncrease ? "increase" : "decrease"}`}>
										{item.isIncrease ? "▲" : "▼"} 10%
									</div>
								</div>
							)
						)
					}
				</div>
			</div>

		</div>
	);
}

export default SidebarContent;