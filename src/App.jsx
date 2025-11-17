import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import { Auth } from "./services/api";

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!token) return setUser(null);
    Auth.me(token)
      .then((r) => setUser(r.user))
      .catch(() => setUser(null));
  }, [token]);
  function login(newToken) {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  }
  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  }
  return { token, user, login, logout };
}

export default function App() {
  const { token, user, login, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const nav = useNavigate();

  async function handleLogin() {
    const email = prompt("Email");
    const password = prompt("Password");
    if (!email || !password) return;
    try {
      const res = await Auth.login({ email, password });
      login(res.token);
      alert("Logged in");
      nav("/profile");
    } catch (e) {
      alert("Login failed");
    }
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
        <header className="border-b bg-white/80 dark:bg-slate-800/60 backdrop-blur px-4 py-2 flex items-center gap-4">
          <Link to="/" className="font-semibold">NaijaTraffic</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setDark(!dark)} className="px-2 py-1 border rounded text-sm">{dark?"Light":"Dark"}</button>
            {user ? (
              <>
                <span className="text-sm">Hi, {user.name}</span>
                <button onClick={logout} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Logout</button>
              </>
            ) : (
              <button onClick={handleLogin} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Login</button>
            )}
          </div>
        </header>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home token={token} />} />
            <Route path="/profile" element={<Profile token={token} user={user} />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <footer className="text-center text-xs text-slate-500 py-2">Built for Nigeria • Lagos • Abuja</footer>
      </div>
    </div>
  );
}
