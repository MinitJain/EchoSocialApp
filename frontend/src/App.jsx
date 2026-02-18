import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/userSlice";
import API from "./api/axios";
import Body from "./components/Body";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const theme = stored || (prefersDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const res = await API.get("/api/v1/user/me");

        dispatch(setUser(res.data.user));
      } catch (err) {
        console.log("No active session");
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/*" element={user ? <Body /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster
        toastOptions={{
          className:
            "rounded-lg bg-zinc-900 text-zinc-50 border border-zinc-800 shadow-sm",
        }}
      />
    </div>
  );
}

export default App;
