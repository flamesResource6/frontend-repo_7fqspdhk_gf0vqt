import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Profile({ token, user }) {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (!user) return;
    api(`/api/users/${user.id}`).then(setStats).catch(console.error);
  }, [user]);
  if (!user) return <div className="p-4">Please log in to view your profile.</div>;
  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <div className="text-sm text-gray-600">{user.email}</div>
      {stats && (
        <div className="p-3 border rounded">Reports made: {stats.reports_made} • Points: {user.points}</div>
      )}
    </div>
  );
}
