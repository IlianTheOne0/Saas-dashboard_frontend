import { useLayoutEffect, useRef, useState, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import ArrowDown from "../../../assets/images/arrow_up-down.svg";
import "../assets/styles/BottomCard.css";

const FILTER_OPTIONS = ["Today", "Last 7 Days", "Last 2 Weeks", "Last Month"];

const FILTER_MAP =
{
	"Today": "today",
	"Last 7 Days": "7d",
	"Last 2 Weeks": "2w",
	"Last Month": "1m"
};

function BottomCard({ id, title, value, filterText = "Today", chartData, colorHex })
{
	const chartRef = useRef(null);
	const dropdownRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState(filterText);

	const currentDataKey = FILTER_MAP[selectedFilter] || "today";
	const currentChartData = chartData[currentDataKey] || [];

	useEffect
	(
		() =>
		{
			const handleClickOutside = (event) =>
			{
				if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); }
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		},
		[]
	);

	const handleOptionClick = (option, event) =>
	{
		event.stopPropagation();
		setSelectedFilter(option);
		setIsOpen(false);
	};

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new(`bottom-card-chart-${id}`);

			root.setThemes([am5themes_Animated.new(root)]);

			const primaryColor = am5.color(colorHex);

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
						paddingLeft: 0,
						paddingRight: 0,
						paddingBottom: 0,
						paddingTop: 0
					}
				)
			);

			chart.zoomOutButton.set("forceHidden", true);

			let xAxis = chart.xAxes.push
			(
				am5xy.CategoryAxis.new
				(
					root,
					{
						categoryField: "index",
						renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 10 })
					}
				)
			);
			xAxis.get("renderer").grid.template.set("visible", false);
			xAxis.get("renderer").labels.template.set("visible", false);

			let yAxis = chart.yAxes.push
			(
				am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
			);
			yAxis.get("renderer").grid.template.set("visible", false);
			yAxis.get("renderer").labels.template.set("visible", false);

			let series = chart.series.push
			(
				am5xy.SmoothedXLineSeries.new
				(
					root,
					{
						name: "Series",
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: "value",
						categoryXField: "index",
						tension: 0.5,
						stroke: primaryColor,
						fill: primaryColor
					}
				)
			);

			series.strokes.template.setAll({ strokeWidth: 3 });

			series.fills.template.setAll({ visible: true, fillOpacity: 1 });

			xAxis.data.setAll(currentChartData);
			series.data.setAll(currentChartData);

			series.appear(1000);
			chart.appear(1000, 100);

			chartRef.current = root;

			return () => { root.dispose(); };
		},
		[id, currentChartData, colorHex]
	);

	return (
		<div className="bottom-card">
			<div className="header">
				<h3 className="title">{title}</h3>
				
				<div className="dropdown-container" ref={dropdownRef}>
					<div className={`dropdown ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
						<span>{selectedFilter}</span>
						<img className="arrow" src={ArrowDown} alt="select" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}/>
					</div>

					{
						isOpen &&
						(
							<div className="dropdown-menu">
								{
									FILTER_OPTIONS.map
									(
										(option) =>
										(
											<div key={option} className={`dropdown-item ${selectedFilter === option ? 'selected' : ''}`} onClick={(event) => handleOptionClick(option, event)}>
												{option}
											</div>
										)
									)
								}
							</div>
						)
					}
				</div>
			</div>

			<div className="item-content">
				<span className="value">{value}</span>
				<div id={`bottom-card-chart-${id}`} className="mini-chart"></div>
			</div>
		</div>
	);
}

export default BottomCard;