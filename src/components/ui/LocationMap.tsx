"use client";

import { useEffect, useMemo, useState } from "react";
import {
     MapContainer,
     GeoJSON,
     Marker,
     Tooltip,
     ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Grid3x3, ChevronDown, Download, MoreHorizontal } from "lucide-react";
import type { Feature, Geometry, FeatureCollection } from "geojson";

// This is all you store in the DB — no lat/lng needed.
export interface EngagementPoint {
     country: string; // country name OR iso code, see `matchKey` below
     value: number;
}

interface EngagementMapProps {
     title?: string;
     subtitle?: string;
     data?: EngagementPoint[];
     height?: number;
     /** "name" if `country` holds full names like "United States of America",
      *  "iso" if it holds ISO-3166-1 alpha-3 codes like "USA" */
     matchKey?: "name" | "iso";
}

const defaultData: EngagementPoint[] = [
     { country: "Canada", value: 80 },
     { country: "United States of America", value: 205 },
     { country: "Russia", value: 205 },
     { country: "Indonesia", value: 120 },
];

const LOW_COLOR = "#dff7ec";
const HIGH_COLOR = "#0f8a7e";
const NO_DATA_COLOR = "#eafaf3";
const WATER_COLOR = "#cfe7f7";

function lerpColor(a: string, b: string, t: number) {
     const ah = parseInt(a.slice(1), 16);
     const bh = parseInt(b.slice(1), 16);
     const ar = (ah >> 16) & 0xff,
          ag = (ah >> 8) & 0xff,
          ab = ah & 0xff;
     const br = (bh >> 16) & 0xff,
          bg = (bh >> 8) & 0xff,
          bb = bh & 0xff;
     const r = Math.round(ar + (br - ar) * t);
     const g = Math.round(ag + (bg - ag) * t);
     const b_ = Math.round(ab + (bb - ab) * t);
     return `#${((1 << 24) + (r << 16) + (g << 8) + b_).toString(16).slice(1)}`;
}

function makeBadgeIcon(value: number, color: string) {
     return L.divIcon({
          className: "",
          html: `
               <div style="
                    width: 44px;
                    height: 44px;
                    border-radius: 9999px;
                    background: #ffffff;
                    border: 3px solid ${color};
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 700;
                    color: #1f2937;
                    font-family: inherit;
               ">${value}</div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
     });
}

const GEOJSON_URL =
     "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

// Derives a marker position from a country's geometry using the midpoint
// of its bounding box — no separate lat/lng storage needed.
function boundsCenterOf(
     feature: Feature<Geometry, any>,
): [number, number] | null {
     try {
          const layer = L.geoJSON(feature as any);
          const bounds = layer.getBounds();
          if (!bounds.isValid()) return null;
          const center = bounds.getCenter();
          return [center.lat, center.lng];
     } catch {
          return null;
     }
}

function EngagementMap({
     title = "Engagements",
     subtitle = "by location",
     data = defaultData,
     height = 440,
     matchKey = "name",
}: EngagementMapProps) {
     const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
     const [loadError, setLoadError] = useState(false);

     useEffect(() => {
          let cancelled = false;
          fetch(GEOJSON_URL)
               .then((res) => {
                    if (!res.ok) throw new Error("failed to load boundaries");
                    return res.json();
               })
               .then((json) => {
                    if (!cancelled) setGeoData(json);
               })
               .catch(() => {
                    if (!cancelled) setLoadError(true);
               });
          return () => {
               cancelled = true;
          };
     }, []);

     const valueByCountry = useMemo(() => {
          const map = new Map<string, number>();
          data.forEach((d) => map.set(d.country.toLowerCase(), d.value));
          return map;
     }, [data]);

     const maxValue = useMemo(
          () => Math.max(...data.map((d) => d.value), 1),
          [data],
     );

     const keyOf = (feature?: Feature<Geometry, any>) => {
          if (!feature) return "";
          if (matchKey === "iso") {
               return (feature.properties?.id ?? feature.id ?? "").toString();
          }
          return (feature.properties?.name ?? "").toString();
     };

     const styleFeature = (feature?: Feature<Geometry, any>) => {
          const key = keyOf(feature).toLowerCase();
          if (key === "antarctica") {
               return {
                    fillColor: "#c9c9c9",
                    fillOpacity: 1,
                    color: "#ffffff",
                    weight: 0.5,
               };
          }
          const value = valueByCountry.get(key);
          const fillColor =
               value !== undefined
                    ? lerpColor(LOW_COLOR, HIGH_COLOR, value / maxValue)
                    : NO_DATA_COLOR;
          return {
               fillColor,
               fillOpacity: 1,
               color: "#ffffff",
               weight: 0.6,
          };
     };

     // Match each data point to a boundary feature and derive its marker
     // position once geoData has loaded.
     const markers = useMemo(() => {
          if (!geoData) return [];
          const matched: {
               country: string;
               value: number;
               position: [number, number];
          }[] = [];

          for (const point of data) {
               const wantedKey = point.country.toLowerCase();
               const feature = geoData.features.find(
                    (f) => keyOf(f as any).toLowerCase() === wantedKey,
               );
               if (!feature) continue; // no match in boundary data — skip silently
               const center = boundsCenterOf(feature as any);
               if (!center) continue;
               matched.push({
                    country: point.country,
                    value: point.value,
                    position: center,
               });
          }
          return matched;
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [geoData, data, matchKey]);

     return (
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-5">
              

               {/* Map */}
               <div
                    className="w-full overflow-hidden rounded-xl relative"
                    style={{ height, background: WATER_COLOR }}
               >
                    {loadError ? (
                         <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                              Couldn&apos;t load map boundaries
                         </div>
                    ) : (
                         <MapContainer
                              center={[20, 10]}
                              zoom={2}
                              minZoom={2}
                              maxZoom={8}
                              maxBounds={[
                                   [-85, -180],
                                   [85, 180],
                              ]}
                              maxBoundsViscosity={1}
                              scrollWheelZoom={true}
                              zoomControl={false}
                              attributionControl={false}
                              className="h-full w-full"
                              style={{ background: WATER_COLOR }}
                         >
                              {geoData && (
                                   <GeoJSON
                                        data={geoData}
                                        style={styleFeature}
                                   />
                              )}

                              {markers.map((m) => {
                                   const t = m.value / maxValue;
                                   const color = lerpColor(
                                        LOW_COLOR,
                                        HIGH_COLOR,
                                        t,
                                   );
                                   return (
                                        <Marker
                                             key={m.country}
                                             position={m.position}
                                             icon={makeBadgeIcon(
                                                  m.value,
                                                  color,
                                             )}
                                        >
                                             <Tooltip
                                                  direction="top"
                                                  offset={[0, -20]}
                                             >
                                                  {m.country}:{" "}
                                                  {m.value.toLocaleString()}
                                             </Tooltip>
                                        </Marker>
                                   );
                              })}

                              {/* Explicit zoom in / zoom out control */}
                              <ZoomControl position="bottomleft" />
                         </MapContainer>
                    )}
               </div>

               {/* Legend */}
               <div className="flex items-center gap-3 mt-4 px-1 text-xs text-gray-400">
                    <span>0</span>
                    <div
                         className="h-1.5 flex-1 rounded-full"
                         style={{
                              background: `linear-gradient(to right, ${LOW_COLOR}, ${HIGH_COLOR})`,
                         }}
                    />
                    <span>{maxValue}</span>
               </div>

               {/* Zoom control + tooltip restyle */}
               <style jsx global>{`
                    .leaflet-control-zoom {
                         border: none !important;
                         box-shadow: none !important;
                    }
                    .leaflet-control-zoom a {
                         width: 32px !important;
                         height: 32px !important;
                         line-height: 32px !important;
                         background: #f3f4f6 !important;
                         color: #374151 !important;
                         border-radius: 10px !important;
                         margin-bottom: 6px !important;
                         border: none !important;
                         font-size: 16px !important;
                    }
                    .leaflet-control-zoom a:hover {
                         background: #e5e7eb !important;
                    }
                    .leaflet-container {
                         background: ${WATER_COLOR} !important;
                    }
                    .leaflet-tooltip {
                         background: #1a1a2e;
                         color: #f5f5f5;
                         border: none;
                         font-size: 11px;
                         border-radius: 6px;
                    }
                    .leaflet-tooltip::before {
                         border-top-color: #1a1a2e;
                    }
               `}</style>
          </div>
     );
}

export default EngagementMap;
