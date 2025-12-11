import { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/useTheme";

import "../assets/styles/LocationsSection.css";

function LocationsSection({ mapData, listData })
{
	const { theme } = useTheme();

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new("audience-map-div");
			
			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5map.MapChart.new
				(
					root,
					{
						panX: "rotateX",
						panY: "translateY",
						projection: am5map.geoMercator()
					}
				)
			);

			chart.chartContainer.set
			(
				"background", am5.Rectangle.new
				(
					root,
					{
						fill: am5.color(0xffffff),
						fillOpacity: 0
					}
				)
			);

			let polygonSeries = chart.series.push
			(
				am5map.MapPolygonSeries.new
				(
					root, 
					{
						geoJSON: am5geodata_worldLow,
						exclude: ["AQ"]
					}
				)
			);

			const mapColor = theme === "light" ? am5.color(0xECECEC) : am5.color(0x3C3D3E);
			const strokeColor = theme === "light" ? am5.color(0xFFFFFF) : am5.color(0x2B2C2F);

			polygonSeries.mapPolygons.template.setAll
			(
				{
					tooltipText: "{name}",
					fill: mapColor,
					stroke: strokeColor,
					strokeWidth: 1,
					interactive: true
				}
			);

			let pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

			pointSeries.bullets.push
			(
				function() 
				{
					let circle = am5.Circle.new
					(
						root, 
						{
							radius: 6,
							tooltipText: "{name}: {value}%",
							fillOpacity: 1
						}
					);

					circle.adapters.add
					(
						"fill",
						(fill, target) =>
						{
							if (target.dataItem.dataContext && target.dataItem.dataContext.color) { return am5.color(target.dataItem.dataContext.color); }
							return fill;
						}
					);

					return am5.Bullet.new(root, { sprite: circle });
				}
			);

			if (mapData)
			{
				pointSeries.data.setAll
				(
					mapData.map
					(
						item => 
						(
							{
								geometry: { type: "Point", coordinates: [item.longitude, item.latitude] },
								name: item.name,
								value: item.value,
								color: item.color
							}
						)
					)
				);
			}

			chart.appear(1000, 100);

			return () => { root.dispose(); };
		},
		[mapData, theme]
	);

	return (
		<div className="locations-section-card">
			<h3 className="section-title">Top Locations</h3>
			
			<div className="locations-content">
				<div className="map-wrapper">
					<div id="audience-map-div" className="map-chart"></div>
				</div>
				
				<div className="list-wrapper">
					{
						listData.map
						(
							(item, index) =>
							(
								<div className="location-row" key={index}>
									<div className="row-info">
										<span className="location-name">{item.name}</span>
										<span className="location-value">{item.value}%</span>
									</div>
									<div className="progress-track">
										<div className="progress-bar" style={{ width: `${item.value}%`, backgroundColor: item.color }}
										></div>
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

export default LocationsSection;