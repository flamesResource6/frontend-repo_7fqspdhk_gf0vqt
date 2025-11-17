import { useEffect, useRef, useState } from "react";
import MapView from "../components/MapView";
import ReportForm from "../components/ReportForm";
import RoutePlanner from "../components/RoutePlanner";
import { Reports } from "../services/api";
import { createSocket } from "../services/socket";

export default function Home({ token }) {
  const [reports, setReports] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    Reports.list("Lagos").then(setReports).catch(console.error);
    const ws = createSocket();
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "new_report") {
          setReports((r) => [data.payload, ...r]);
        }
      } catch {}
    };
    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex items-center gap-2 border-b bg-white">
        <div className="font-semibold">NaijaTraffic</div>
        <div className="ml-auto">
          <RoutePlanner map={map} reports={reports} />
        </div>
      </div>
      <div className="flex-1 relative">
        <MapView reports={reports} onMapReady={setMap} />
        <button onClick={()=>setShowForm(true)} className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg text-2xl">+</button>
        {showForm && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center" role="dialog" aria-modal>
            <div className="bg-white rounded w-96 max-w-full">
              <div className="p-3 border-b flex items-center">
                <div className="font-semibold">Report Incident</div>
                <button onClick={()=>setShowForm(false)} className="ml-auto">✕</button>
              </div>
              <ReportForm token={token} onClose={()=>setShowForm(false)} onCreated={(r)=>setReports((prev)=>[r, ...prev])} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
