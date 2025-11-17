import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || "YOUR_MAPBOX_KEY";

export default function MapView({ reports = [], onMapReady }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [3.3792, 6.5244],
        zoom: 10,
      });
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.on("load", () => onMapReady && onMapReady(map));
      mapRef.current = map;
    }
  }, [onMapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Remove existing markers
    if (map._markers) map._markers.forEach((m) => m.remove());
    map._markers = [];

    reports.forEach((r) => {
      const el = document.createElement("div");
      const colour = r.type === "traffic_jam" ? "bg-red-500" : r.type === "accident" ? "bg-orange-500" : r.type === "flood" ? "bg-blue-600" : "bg-green-600";
      el.className = `w-3 h-3 rounded-full border-2 border-white ${colour}`;
      const marker = new mapboxgl.Marker(el)
        .setLngLat([r.location.lng, r.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<div class='text-sm'><div class='font-semibold capitalize'>${r.type.replace("_"," ")}</div><div>${r.description || "No description"}</div><div>${new Date(r.timestamp).toLocaleTimeString()}</div></div>`
          )
        )
        .addTo(map);
      map._markers.push(marker);
    });
  }, [reports]);

  return <div ref={containerRef} className="w-full h-full" aria-label="Interactive traffic map" />;
}
