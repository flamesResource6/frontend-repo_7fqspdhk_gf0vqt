const BASE = import.meta.env.VITE_BACKEND_URL || "";

export async function api(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const Auth = {
  signup: (data) => api("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => api("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: (token) => api("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
};

export const Reports = {
  list: (city) => api(`/api/reports${city ? `?city=${encodeURIComponent(city)}` : ""}`),
  create: (data, token) => api("/api/reports", { method: "POST", body: JSON.stringify(data), token }),
  vote: (id, value, token) => api(`/api/reports/${id}/vote`, { method: "PUT", body: JSON.stringify({ value }), token }),
};

export const Admin = {
  stats: (token) => api("/api/admin/stats", { token }),
};

export const Weather = {
  get: (lat, lng) => api(`/api/weather?lat=${lat}&lng=${lng}`),
};
