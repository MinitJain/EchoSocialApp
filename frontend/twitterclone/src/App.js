import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./redux/userSlice";
import API from "./api/axios";
import Body from "./components/Body";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

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
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/*" element={user ? <Body /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
      <Analytics />
    </>
  );
}

export default App;
