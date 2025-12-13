import { useLayoutEffect, useRef, useEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import "../assets/styles/SidebarContent.css";

function SidebarContent({ data })
{
	const chartRef = useRef(null);
	const platformScrollRef = useRef(null);
	const browserScrollRef = useRef(null);

	const attachHorizontalScroll = (ref) =>
	{
		const elment = ref.current;
		if (!elment) { return; }

		const onWheel = (event) =>
		{
			if (event.deltaY === 0) { return; }
			event.preventDefault();
			elment.scrollTo({ left: elment.scrollLeft + event.deltaY, behavior: "auto" });
		};

		elment.addEventListener("wheel", onWheel, { passive: false });
		return () => elment.removeEventListener("wheel", onWheel);
	};

	useEffect
	(
		() =>
		{
			const cleanupPlatform = attachHorizontalScroll(platformScrollRef);
			const cleanupBrowser = attachHorizontalScroll(browserScrollRef);

			return () =>
			{
				if (cleanupPlatform) cleanupPlatform();
				if (cleanupBrowser) cleanupBrowser();
			};
		},
		[]
	);

	useLayoutEffect
	(
		() =>
		{
			if (!data || !data.realtime) { return; }

			let root = am5.Root.new("sidebar-realtime-chart");
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
						name: "Users",
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: "value",
						categoryXField: "index",
						stroke: am5.color(0xFFFFFF),
						strokeOpacity: 0.5,
						tension: 0.5
					}
				)
			);

			series.strokes.template.setAll({ strokeWidth: 2 });
			
			xAxis.data.setAll(data.realtime.chartData);
			series.data.setAll(data.realtime.chartData);

			series.appear(1000);
			chart.appear(1000, 100);

			chartRef.current = root;

			return () => { root.dispose(); };
		},
		[data]
	);

	const getIcon = (name) =>
	{
		if (!name) { return null; }
		return `https://raw.githubusercontent.com/IlianTheOne0/Saas-dashboard_frontend/refs/heads/developer/src/features/dashboard/pages/Home/tabs/TrafficSource/assets/images/${name}`;
	};

	if (!data) { return null; }

	return (
		<div className="content-wrapper">
			<section className="section realtime">
				<h3 className="section-title">Realtime</h3>
				<div className="realtime-display">
					<div className="number-block">
						<span className="big-number">{data.realtime.activeUsers}</span>
						<span className="sub">Active Users</span>
					</div>
					<div id="sidebar-realtime-chart" className="sparkline"></div>
				</div>
			</section>

			<div className="divider"/>

			<section className="section audience">
				<h3 className="section-title">Audience</h3>
				
				<div className="cards-container">
					<div>
						<h4 className="subsection-title">Platforms</h4>
						<div className="cards-row" ref={platformScrollRef}>
							{
								data.audience.platforms.map
								(
									(platform, index) =>
									(
										<div className="mini-card" key={`platform-${index}`}>
											<div className="card-header">
												<div className={`icon-box ${platform.name.toLowerCase().split(" ")[0]}`}>
													<img src={getIcon(platform.icon)} alt="" onError={(event) => event.target.style.display='none'}/>
												</div>
												<div className="meta">
													<span className="label">Platform</span>
													<span className="name">{platform.name}</span>
												</div>
											</div>
											<div className="card-stats">
												<span className="value">{platform.value}</span>
												<span className="sub">Sessions</span>
											</div>
										</div>
									)
								)
							}
						</div>
					</div>

					<div>
						<h4 className="subsection-title">Browsers</h4>
						<div className="cards-row" ref={browserScrollRef}>
							{
								data.audience.browsers.map
								(
									(browser, index) =>
									(
										<div className="mini-card" key={`browser-${index}`}>
											<div className="card-header">
												<div className={`icon-box ${browser.name.toLowerCase()}`}>
													<img src={getIcon(browser.icon)} alt="" onError={(event) => event.target.style.display='none'}/>
												</div>
												<div className="meta">
													<span className="label">Browser</span>
													<span className="name">{browser.name}</span>
												</div>
											</div>
											<div className="card-stats">
												<span className="value">{browser.value}</span>
												<span className="sub">Sessions</span>
											</div>
										</div>
									)
								)
							}
						</div>
					</div>
				</div>
			</section>

			<div className="divider"/>

			<section className="section language">
				<h3 className="section-title">Language</h3>
				<div className="language-list">
					{
						data.languages.map
						(
							(lang, index) =>
							(
								<div key={index} className="lang-item">
									<div className="lang-info">
										<span className="lang-name">{lang.name}</span>
										<span className="lang-val">{lang.value}%</span>
									</div>
									<div className="progress-bg">
										<div className="progress-fill" style={{ width: `${lang.value}%`, backgroundColor: lang.color }}></div>
									</div>
								</div>
							)
						)
					}
				</div>
			</section>
		</div>
	);
}

export default SidebarContent;