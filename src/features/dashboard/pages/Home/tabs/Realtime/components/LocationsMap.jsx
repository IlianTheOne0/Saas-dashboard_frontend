import { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useTheme } from "../../../../../../../hooks/useTheme";

import "../assets/styles/LocationsMap.css";

function LocationsMap({ data })
{
	const { theme } = useTheme();

	useLayoutEffect
	(
		() =>
		{
			let root = am5.Root.new("realtime-map-div");

			root.setThemes([am5themes_Animated.new(root)]);

			let chart = root.container.children.push
			(
				am5map.MapChart.new
				(
					root,
					{
						panX: "rotateX",
						panY: "translateY",
						projection: am5map.geoMercator(),
						layout: root.horizontalLayout
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

			const landColor = theme === "light" ? am5.color(0xECECEC) : am5.color(0x2B2C2F);

			polygonSeries.mapPolygons.template.setAll
			(
				{
					tooltipText: "{name}",
					fill: landColor,
					stroke: theme === "light" ? am5.color(0xFFFFFF) : am5.color(0x35363A),
					strokeWidth: 1
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
							radius: 10,
							tooltipText: "{name}: {value}",
							fillOpacity: 0.9,
							stroke: theme === "dark" ? am5.color(0x000000) : am5.color(0xFFFFFF),
							strokeWidth: 2
						}
					);

					circle.adapters.add
					(
						"fill",
						function(fill, target)
						{
							if (target.dataItem.dataContext && target.dataItem.dataContext.color) { return am5.color(target.dataItem.dataContext.color); }
							return fill;
						}
					);

					return am5.Bullet.new(root, { sprite: circle });
				}
			);

			if (data)
			{
				pointSeries.data.setAll
				(
					data.map
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
		[data, theme]
	);

	return (
		<div className="map-card">
			<h3 className="card-title">Top Locations</h3>
			<div id="realtime-map-div" className="map-container"></div>
		</div>
	);
}

export default LocationsMap;