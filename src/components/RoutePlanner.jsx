import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY || "YOUR_MAPBOX_KEY";

export default function RoutePlanner({ map, reports }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [info, setInfo] = useState(null);

  async function planRoute(e) {
    e.preventDefault();
    if (!map || !start || !end) return;
    const token = mapboxgl.accessToken;
    const geocode = async (q) => {
      const r = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}`);
      const j = await r.json();
      return j.features?.[0]?.center || null;
    };
    const s = await geocode(start);
    const e2 = await geocode(end);
    if (!s || !e2) return;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${s[0]},${s[1]};${e2[0]},${e2[1]}?geometries=geojson&overview=full&access_token=${token}`;
    const r = await fetch(url);
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) return;
    const geojson = { type: "Feature", properties: {}, geometry: route.geometry };

    if (map.getSource("route")) {
      map.getSource("route").setData(geojson);
    } else {
      map.addSource("route", { type: "geojson", data: geojson });
      map.addLayer({ id: "route", type: "line", source: "route", paint: { "line-color": "#2563eb", "line-width": 4 } });
    }

    // Check incidents along the path (simple proximity check)
    const coords = route.geometry.coordinates;
    const alerts = reports.filter((r) => coords.some(([lng, lat]) => Math.hypot(lat - r.location.lat, lng - r.location.lng) < 0.01));
    setInfo({ duration: Math.round(route.duration / 60), distance: (route.distance / 1000).toFixed(1), alerts });
    map.fitBounds([s, e2], { padding: 50 });
  }

  return (
    <div className="p-2 bg-white/80 backdrop-blur rounded shadow">
      <form onSubmit={planRoute} className="flex gap-2 items-center">
        <input value={start} onChange={(e)=>setStart(e.target.value)} className="border rounded px-2 py-1 w-40" placeholder="Start (e.g. Lekki)" />
        <input value={end} onChange={(e)=>setEnd(e.target.value)} className="border rounded px-2 py-1 w-40" placeholder="End (e.g. Ikeja)" />
        <button className="bg-emerald-600 text-white px-3 py-1 rounded">Route</button>
      </form>
      {info && (
        <div className="mt-2 text-sm">
          <div>ETA: {info.duration} min • {info.distance} km</div>
          {info.alerts.length > 0 && (
            <div className="text-orange-600">Alerts on path: {info.alerts.length}</div>
          )}
        </div>
      )}
    </div>
  );
}
