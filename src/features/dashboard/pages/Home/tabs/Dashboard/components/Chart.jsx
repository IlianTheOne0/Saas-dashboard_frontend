import { useLayoutEffect, useRef, useState, useEffect } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/store/useTheme";

import "../assets/styles/Chart.css";

function Chart({ data })
{
	const { theme } = useTheme();
	
	const rangeKeys = Object.keys(data || {});
	const [activeRange, setActiveRange] = useState(rangeKeys[0] || "today");
	
	const seriesRef = useRef(null);
	const xAxisRef = useRef(null);
	const rootRef = useRef(null);

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new("chartdiv");
			rootRef.current = root;

			root.setThemes([ am5themes_Animated.new(root) ]);

			const colorGreen = am5.color("#62CA76");
			const colorText = theme === "light" ? am5.color("#1E1F20") : am5.color("#BEC2D0");

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
						pinchZoomX: true,
						paddingLeft: 0,
						paddingRight: 0
					}
				)
			);

			chart.zoomOutButton.set("forceHidden", true);

			let cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "none" }));
			cursor.lineY.set("visible", false);
			cursor.lineX.set("visible", true);
			cursor.lineX.set("stroke", colorText);
			cursor.lineX.set("strokeOpacity", 0.2);

			let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30, minorGridEnabled: true });
			
			xRenderer.grid.template.set("visible", false);
			xRenderer.labels.template.setAll
			(
				{
					rotation: 0,
					centerY: am5.p50,
					centerX: am5.p50,
					paddingTop: 10,
					fontFamily: "FC-Medium",
					fontSize: 12,
					fill: colorText
				}
			);

			let xAxis = chart.xAxes.push
			(
				am5xy.CategoryAxis.new
				(
					root,
					{
						maxDeviation: 0.3,
						categoryField: "time",
						renderer: xRenderer,
						tooltip: am5.Tooltip.new(root, {})
					}
				)
			);

			xAxisRef.current = xAxis;

			let yRenderer = am5xy.AxisRendererY.new(root, {});
			yRenderer.grid.template.set("visible", false);
			yRenderer.labels.template.set("visible", false);

			let yAxis = chart.yAxes.push
			(
				am5xy.ValueAxis.new
				(
					root,
					{
						maxDeviation: 0.3,
						renderer: yRenderer
					}
				)
			);

			let series = chart.series.push
			(
				am5xy.SmoothedXLineSeries.new
				(
					root,
					{
						name: "Sessions",
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: "value",
						categoryXField: "time",
						tension: 0.3,
						tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" }),
						stroke: colorGreen,
						fill: colorGreen
					}
				)
			);

			series.strokes.template.setAll({ strokeWidth: 3 });

			series.fills.template.setAll
			(
				{
					fillOpacity: 1,
					visible: true
				}
			);

			seriesRef.current = series;

			if (data && data[activeRange])
			{
				const currentData = data[activeRange];
				xAxis.data.setAll(currentData);
				series.data.setAll(currentData);
			}

			series.appear(1000);
			chart.appear(1000, 100);

			return () => { root.dispose(); };
		}, [theme]
	);

	useEffect
	(
		() =>
		{
			if (seriesRef.current && xAxisRef.current && data[activeRange])
			{
				const currentData = data[activeRange];
				xAxisRef.current.data.setAll(currentData);
				seriesRef.current.data.setAll(currentData);
			}
		},
		[activeRange, data]
	);

	return (
		<div className="chart-container">
			<div className="chart-header">
				<h3 className="chart-title">Sessions Overview</h3>
				
				<div className="chart-controls">
					<div className="time-ranges">
						{
							rangeKeys.map
							(
								(range) =>
								(
									<button key={range} className={`range-btn ${activeRange === range ? "active" : ""}`} onClick={() => setActiveRange(range)}>
										{range}
									</button>
								)
							)
						}
					</div>
				</div>
			</div>
			
			<div id="chartdiv"></div>
		</div>
	);
}

export default Chart;