import { useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/useTheme";
import "../assets/styles/TrafficChannelCard.css";

const RANGE_MAP =
{
	"Today": "today",
	"7d": "7d",
	"2w": "2w",
"1m": "1m"
};

function TrafficChannelCard({ stats, chartData })
{
	const { theme } = useTheme();
	const [timeRange, setTimeRange] = useState("Today");

	useLayoutEffect
	(
		() =>
		{
			if (!chartData) { return; }

			const isMobile = window.innerWidth <= 429;

			const currentData = chartData[RANGE_MAP[timeRange]] || [];

			let root = am5.Root.new("traffic-main-chart");
			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5xy.XYChart.new
				(
					root,
					{
						panX: true,
						panY: true,
						wheelX: "panX",
						wheelY: "zoomX",
						layout: root.verticalLayout,
						paddingLeft: 0,
						paddingRight: 0
					}
				)
			);

			chart.zoomOutButton.set("forceHidden", true);

			let cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
			cursor.lineY.set("visible", false);

			let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: isMobile ? 30 : 50 });
			xRenderer.grid.template.set("visible", false);
			xRenderer.labels.template.setAll
			(
				{
					rotation: 0,
					centerY: am5.p50,
					centerX: am5.p50,
					paddingTop: 10,
					fill: am5.color(0x9CA3AF),
					fontFamily: "FC-Medium",
					fontSize: isMobile ? 10 : 12
				}
			);

			let xAxis = chart.xAxes.push
			(
				am5xy.CategoryAxis.new
				(
					root,
					{
						categoryField: "time",
						renderer: xRenderer,
						tooltip: am5.Tooltip.new(root, {})
					}
				)
			);
			xAxis.data.setAll(currentData);

			let yRenderer = am5xy.AxisRendererY.new(root, {});
			yRenderer.grid.template.setAll({ strokeDasharray: [2, 2], strokeOpacity: 0.1 });
			yRenderer.labels.template.set("visible", false);

			let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, { renderer: yRenderer, min: 0 }));

			function createSeries(name, field, color)
			{
				let series = chart.series.push
				(
					am5xy.SmoothedXLineSeries.new
					(
						root,
						{
							name: name,
							xAxis: xAxis,
							yAxis: yAxis,
							valueYField: field,
							categoryXField: "time",
							stroke: am5.color(color),
							strokeWidth: 3,
							tooltip: am5.Tooltip.new(root, { labelText: "{name}: {valueY}" })
						}
					)
				);

				series.fills.template.setAll
				(
					{
						visible: true,
						fillOpacity: 1,
						fillGradient: am5.LinearGradient.new
						(
							root, {stops: [{ color: am5.color(color), opacity: 0.5 }, { color: am5.color(color), opacity: 0.01 }], rotation: 90 }
						)
					}
				);

				series.data.setAll(currentData);
				series.appear(1000);
			}

			createSeries("Direct", "direct", "#62CA76"); 
			createSeries("Organic Search", "organic", "#E45851"); 

			chart.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[chartData, theme, timeRange]
	);

	return (
		<div className="traffic-channel-card">
			<div className="header">
				<h3 className="title">Traffic Channel</h3>
				<div className="time-toggles">
				{
					["Today", "7d", "2w", "1m"].map
					(
						range => (<button key={range} className={timeRange === range ? "active" : ""} onClick={() => setTimeRange(range)}>{range}</button>)
					)
				}
				</div>
			</div>

		<div className="stats-row">
			{
				stats.map
				(
					stat =>
					(
						<div className="stat-item" key={stat.id}>
							<span className="label">{stat.label}</span>
							<span className="value">{stat.values[RANGE_MAP[timeRange]]}</span>
							<span className={`change ${stat.isIncrease ? 'increase' : 'decrease'}`}>{stat.isIncrease ? "▲" : "▼"} {stat.change}</span>
						</div>
					)
				)
			}
		</div>

		<div className="main-chart-container">
			<div id="traffic-main-chart"></div>
		</div>

		<div className="chart-footer">
			<div className="legend-item">
				<div className="legend-dot" style={{backgroundColor: "#62CA76"}}></div>
				<span>Direct</span>
			</div>
			<div className="legend-item">
				<div className="legend-dot" style={{backgroundColor: "#E45851"}}></div>
				<span>Organic Search</span>
			</div>
		</div>
		</div>
	);
}

export default TrafficChannelCard;