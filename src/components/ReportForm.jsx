import { useEffect, useState } from "react";
import { Reports } from "../services/api";

const types = [
  { value: "traffic_jam", label: "Traffic Jam" },
  { value: "accident", label: "Accident" },
  { value: "pothole", label: "Pothole" },
  { value: "police_checkpoint", label: "Police Checkpoint" },
  { value: "roadwork", label: "Roadwork" },
  { value: "flood", label: "Flood" },
];

export default function ReportForm({ token, onCreated, onClose, defaultCity = "Lagos" }) {
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState(types[0].value);
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null);
  const [anon, setAnon] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords({ lat: 6.5244, lng: 3.3792 })
    );
  }, []);

  function onPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  async function submit(e) {
    e.preventDefault();
    if (!coords) return;
    try {
      setLoading(true);
      const res = await Reports.create(
        { location: coords, type, description: desc, photo, anonymous: anon, city: defaultCity },
        token
      );
      onCreated?.(res);
      onClose?.();
    } catch (err) {
      alert("Failed to create report: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="p-4 space-y-3">
      <div>
        <label className="block text-sm mb-1">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded p-2">
          {types.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border rounded p-2" rows={3} placeholder="Add any helpful details" />
      </div>
      <div>
        <label className="block text-sm mb-1">Photo (optional)</label>
        <input type="file" accept="image/*" onChange={onPhoto} />
      </div>
      <div className="flex items-center gap-2">
        <input id="anon" type="checkbox" checked={anon} onChange={(e)=>setAnon(e.target.checked)} />
        <label htmlFor="anon">Report anonymously</label>
      </div>
      <button disabled={!coords || loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
