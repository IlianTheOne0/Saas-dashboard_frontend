import { useLayoutEffect, useState, useRef, useEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/store/useTheme";
import ArrowDown from "../../../assets/images/arrow_up-down.svg";

import "../assets/styles/DonutStatCard.css";

function DonutStatCard({ id, title, data, color })
{
	const { theme } = useTheme();
	
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState("1 month");
	const dropdownRef = useRef(null);

	const seriesRef = useRef(null);
	const labelRef = useRef(null);

	const currentValue = data && data[selectedOption] ? data[selectedOption] : 0;

	const toggleDropdown = (event) => { event.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); };
	const handleOptionSelect = (option, event) => { event.stopPropagation(); setSelectedOption(option); setIsDropdownOpen(false); };

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

	useEffect
	(
		() =>
		{
			if (seriesRef.current) 
			{
				seriesRef.current.data.setAll
				(
					[
						{ category: "Active", value: currentValue },
						{ category: "Remainder", value: 100 - currentValue }
					]
				);
			}
			if (labelRef.current) { labelRef.current.set("text", `${currentValue}%`); }
		},
		[currentValue]
	);

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new(`audience-donut-${id}`);
			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5percent.PieChart.new(root, { layout: root.verticalLayout, innerRadius: am5.percent(85) })
			);

			let series = chart.series.push
			(
				am5percent.PieSeries.new(root, { valueField: "value", categoryField: "category", alignLabels: false })
			);

			series.labels.template.set("visible", false);
			series.ticks.template.set("visible", false);

			series.set("tooltip", am5.Tooltip.new(root, {}));

			series.slices.template.setAll({ strokeOpacity: 0, tooltipText: "{category}: {value}%", cursorOverStyle: "pointer" });

			series.slices.template.adapters.add
			(
				"fill",
				function(fill, target)
				{
					if (target.dataItem.dataContext.category === "Active") { return am5.color(color); }
					return theme === "light" ? am5.color(0xF7F7F7) : am5.color(0x3C3D3E);
				}
			);

			series.data.setAll
			(
				[
					{ category: "Active", value: currentValue },
					{ category: "Remainder", value: 100 - currentValue }
				]
			);

			let label = chart.seriesContainer.children.push
			(
				am5.Label.new
				(
					root,
					{
						textAlign: "center", centerY: am5.p50, centerX: am5.p50,
						text: `${currentValue}%`, fontSize: 24, fontFamily: "FC-Bold",
						fill: theme === "light" ? am5.color(0x1E1F20) : am5.color(0xFFFFFF)
					}
				)
			);

			seriesRef.current = series;
			labelRef.current = label;

			series.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[id, color, theme]
	);

	return (
		<div className="card donut-stat-card">
			<div className="left-content">
				<h3 className="card-title">{title.split(" ").map((word, index) => <span key={index}>{word}<br/></span>)}</h3>
				
				<div className="dropdown-wrapper" ref={dropdownRef}>
					<div className={`dropdown ${isDropdownOpen ? 'active' : ''}`} onClick={toggleDropdown}>
						<span>{selectedOption}</span>
						<img src={ArrowDown} alt="select" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}/>
					</div>
					{
						isDropdownOpen && 
						<div className="dropdown-menu">
							{
								["1 month", "3 months", "6 months"].map
								(
									option =>
									(
										<div key={option} className="dropdown-item" onClick={(event) => handleOptionSelect(option, event)}>{option}</div>
									)
								)
							}
						</div>
					}
				</div>
			</div>
			
			<div className="chart-wrapper">
				<div id={`audience-donut-${id}`} className="mini-donut-chart"></div>
			</div>
		</div>
	);
}

export default DonutStatCard;