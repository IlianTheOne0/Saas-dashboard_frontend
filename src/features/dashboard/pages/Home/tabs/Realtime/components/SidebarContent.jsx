import { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import IconDesktop from "../assets/images/desktop.svg"; 
import IconMobile from "../assets/images/mobile.svg"; 

import "../assets/styles/SidebarContent.css";

function SidebarContent({ data })
{
	useLayoutEffect
	(
		() =>
		{
			if (!data || !data.deviceChart) { return; }

			let root = am5.Root.new("device-chart-div");

			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5percent.PieChart.new
				(
					root,
					{
						layout: root.verticalLayout,
						innerRadius: am5.percent(75) 
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

			series.slices.template.setAll
			(
				{
					strokeOpacity: 0, 
					toggleKey: "none",
					tooltipText: "{category}: {value}%" 
				}
			);

			series.slices.template.adapters.add
			(
				"fill",
				function(fill, target)
				{
					if (target.dataItem.dataContext && target.dataItem.dataContext.color) { return am5.color(target.dataItem.dataContext.color); }
					return fill;
				}
			);

			series.slices.template.adapters.add
			(
				"fillOpacity",
				function(fillOpacity, target)
				{
					if (target.dataItem.dataContext && target.dataItem.dataContext.opacity !== undefined) { return target.dataItem.dataContext.opacity; }
					return 1;
				}
			);

			series.data.setAll(data.deviceChart);
			series.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[data]
	);

	if (!data) { return null; }

	return (
		<div className="realtime-sidebar custom-scrollbar dark">
			<div className="sidebar-section">
				<h3 className="section-title">Sessions by Device</h3>

				<div className="chart-container">
					<div id="device-chart-div"></div>
				</div>

				<div className="device-stats-list">
					{
						data.deviceStats.map
						(
							(stat, index) =>
							(
								<div className="device-stat-item" key={index}>
									<div className="stat-left">
										<div className="device-icon-box">
											<img src={stat.name === "Desktop" ? IconDesktop : IconMobile} alt={stat.name} />
										</div>
										<div className="stat-info">
											<span className="stat-name">{stat.name}</span>
											<span className="stat-value">{stat.value}</span>
										</div>
									</div>
									<div className={`stat-change ${stat.isIncrease ? "increase" : "decrease"}`}>
										{stat.isIncrease ? "▲" : "▼"} {stat.change}
									</div>
								</div>
							)
						)
					}
				</div>
			</div>

			<div className="divider"></div>

			<div className="sidebar-section">
				<h3 className="section-title">Referrals</h3>

				<div className="referrals-list">
					{
						data.referrals.map
						(
							(item, index) =>
							(
								<div className="referral-item" key={index}>
									<div className="referral-header">
										<span className="ref-name">{item.name}</span>
										<span className="ref-val">{item.value}%</span>
									</div>
									<div className="referral-progress-bg">
										<div className="referral-progress-fill"  style={{ width: `${item.value}%` }}></div>
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