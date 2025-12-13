import { useLayoutEffect, useState, useRef, useEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import ArrowDown from "../../../assets/images/arrow_up-down.svg";
import { useTheme } from "../../../../../../../hooks/store/useTheme";
import "../assets/styles/SmallLineChartCard.css";

const FILTER_OPTIONS = ["Today", "Last 7 Days", "Last 2 Weeks", "Last Month"];
const RANGE_MAP =
{
	"Today": "today",
	"Last 7 Days": "7d",
	"Last 2 Weeks": "2w",
	"Last Month": "1m"
};

function SmallLineChartCard({ id, title, values, color, data })
{
	const { theme } = useTheme();

	const [selectedFilter, setSelectedFilter] = useState("Today");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect
	(
		() =>
		{
			const handleClickOutside = (event) =>
			{
				if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsDropdownOpen(false); }
			};
			
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		},
		[]
	);

	const handleFilterSelect = (option) => { setSelectedFilter(option); setIsDropdownOpen(false); };

	useLayoutEffect
	(
		() =>
		{
			if (!data) { return; }

			const currentData = data[RANGE_MAP[selectedFilter]] || [];

			let root = am5.Root.new(`small-chart-${id}`);
			root.setThemes([am5themes_Animated.new(root)]);

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
						paddingTop: 10
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
						categoryField: "category",
						renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 10 })
					}
				)
			);
			xAxis.get("renderer").grid.template.set("visible", false);
			xAxis.get("renderer").labels.template.set("visible", false);
			xAxis.data.setAll(currentData);

			let yAxis = chart.yAxes.push
			(
				am5xy.ValueAxis.new
				(
					root,
					{
						renderer: am5xy.AxisRendererY.new(root, {})
					}
				)
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
						categoryXField: "category",
						stroke: am5.color(color),
						strokeWidth: 3,
						tension: 0.5
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
						root,
						{
							stops: [{ color: am5.color(color), opacity: 0.5 }, { color: am5.color(color), opacity: 0.01 }],
							rotation: 90
						}
					)
				}
			);

			series.data.setAll(currentData);
			series.appear(1000);
			chart.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[id, data, color, theme, selectedFilter]
	);

	return (
		<div className="small-line-chart-card">
			<div className="header">
				<h4 className="title">{title}</h4>

				<div className="dropdown-container" ref={dropdownRef}>
					<div className="dropdown-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
						{selectedFilter}
						<img src={ArrowDown} alt="select" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}/>
					</div>
					{
						isDropdownOpen &&
						(
							<div className="dropdown-menu">
							{
								FILTER_OPTIONS.map
								(
									option =>
									(
										<div key={option} className="dropdown-item" onClick={() => handleFilterSelect(option)}>{option}</div>
									)
								)
							}
							</div>
						)
					}
				</div>
			</div>

			<div className="card-value">{values[RANGE_MAP[selectedFilter]]}</div>

			<div className="chart-container">
				<div id={`small-chart-${id}`} className="mini-chart"></div>
			</div>
		</div>
	);
}

export default SmallLineChartCard;