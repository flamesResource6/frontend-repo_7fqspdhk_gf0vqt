import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Leaderboard() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api("/api/leaderboard").then(setItems).catch(console.error);
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Top Contributors</h2>
      <ul className="space-y-2">
        {items.map((u) => (
          <li key={u.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-500">{u.city || "Nigeria"}</div>
            </div>
            <div className="font-semibold">{u.points} pts</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
