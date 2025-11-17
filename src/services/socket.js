export function createSocket() {
  const url = (import.meta.env.VITE_BACKEND_URL || "").replace("http", "ws");
  const ws = new WebSocket(`${url}/ws`);
  return ws;
}
