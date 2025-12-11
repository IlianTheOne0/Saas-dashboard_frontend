import { useLayoutEffect, useState } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/useTheme";

import "../assets/styles/PageViewsChart.css";

function PageViewsChart({ data })
{
	const { theme } = useTheme();

	const [viewMode, setViewMode] = useState("perMinute");

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new("realtime-pageviews-div");

			root.setThemes([am5themes_Animated.new(root)]);

			const textColor = theme === "light" ? am5.color(0x7F85A2) : am5.color(0x9CA3AF);

			let chart = root.container.children.push
			(
				am5xy.XYChart.new
				(
					root,
					{
						panX: false,
						panY: false,
						wheelX: "none",
						wheelY: "none",
						layout: root.verticalLayout
					}
				)
			);

			let xRenderer = am5xy.AxisRendererX.new
			(
				root,
				{ 
					minGridDistance: 30,
					cellStartLocation: 0.2, 
					cellEndLocation: 0.8 
				}
			);

			xRenderer.labels.template.setAll
			(
				{
					rotation: 0,
					centerY: am5.p50,
					centerX: am5.p50,
					fill: textColor,
					fontSize: 12,
					fontFamily: "FC-Medium",
					paddingTop: 10
				}
			);

			xRenderer.grid.template.set("visible", false);

			let xAxis = chart.xAxes.push
			(
				am5xy.CategoryAxis.new
				(
					root,
					{
						categoryField: "category",
						renderer: xRenderer,
						tooltip: am5.Tooltip.new(root, {})
					}
				)
			);

			const currentData = data[viewMode] || [];
			xAxis.data.setAll(currentData);

			let yRenderer = am5xy.AxisRendererY.new(root, {});
			yRenderer.labels.template.set("visible", false);
			yRenderer.grid.template.set("visible", false);

			let yAxis = chart.yAxes.push
			(
				am5xy.ValueAxis.new
				(
					root,
					{
						renderer: yRenderer,
						min: 0,
						max: 100,
						strictMinMax: true,
						calculateTotals: true 
					}
				)
			);

			function makeSeries(name, fieldName, colorHex, roundedTop = false, roundedBottom = false)
			{
				let series = chart.series.push
				(
					am5xy.ColumnSeries.new
					(
						root,
						{
							name: name,
							stacked: true,
							xAxis: xAxis,
							yAxis: yAxis,
							valueYField: fieldName,
							valueYShow: "valueYTotalPercent",
							categoryXField: "category"
						}
					)
				);

				let corners = {};

				if (roundedTop) { corners.cornerRadiusTL = 100; corners.cornerRadiusTR = 100; }
				if (roundedBottom) { corners.cornerRadiusBL = 100; corners.cornerRadiusBR = 100; }

				series.columns.template.setAll
				(
					{
						tooltipText: "{name}: {valueYTotalPercent.formatNumber('#.#')}%",
						width: am5.percent(20),
						fill: am5.color(colorHex),
						strokeOpacity: 0,
						...corners
					}
				);

				series.data.setAll(currentData);
				series.appear();
			}

			makeSeries("Referral", "referral", "#62CA76", false, true); 
			makeSeries("Direct", "direct", "#3E6BEC", false, false);    
			makeSeries("Organic Search", "organic", "#E45851", true, false); 

			chart.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[data, theme, viewMode]
	);

	return (
		<div className="chart-card">
			<div className="chart-top-row">
				<h3 className="card-title">Page Views</h3>
				<div className="toggles">
					<button className={viewMode === "perMinute" ? "active" : ""} onClick={() => setViewMode("perMinute")}>Per Minute</button>
					<button className={viewMode === "perSecond" ? "active" : ""} onClick={() => setViewMode("perSecond")}>Per Second</button>
				</div>
			</div>

			<div className="chart-legend-row">
				<div className="legend-item">
					<span className="dot" style={{ backgroundColor: "#3E6BEC" }}></span>
					DIRECT
				</div>
				<div className="legend-item">
					<span className="dot" style={{ backgroundColor: "#62CA76" }}></span>
					REFERRAL
				</div>
				<div className="legend-item">
					<span className="dot" style={{ backgroundColor: "#E45851" }}></span>
					ORGANIC SEARCH
				</div>
			</div>

			<div id="realtime-pageviews-div" className="pageview-chart"></div>
		</div>
	);
}

export default PageViewsChart;