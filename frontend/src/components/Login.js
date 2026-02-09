import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [formData, setFormData] = useState({
    name: "", // const [name, setName] = useState("");
    username: "", // const [username, setUsername] = useState("");
    email: "", // const [email, setEmail] = useState("");
    password: "", // const [password, setPassword] = useState("");
    confirmPassword: "", // const [confirmPassword, setConfirmPassword] = useState("");
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    }); // reset form when toggling
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { name, email, username, password, confirmPassword } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (isLogin) {
      //login
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // ✅ added this line for login too
          },
        );
        console.log("Full Login Response:", res);
        console.log("Login API Response:", res.data);

        if (res.data.success) {
          dispatch(setUser(res?.data?.user));
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate("/");

          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Login failed");
        console.log(error);
      }
    } else {
      // sign up
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          {
            name,
            email,
            username,
            password,
            confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        if (res.data.success) {
          // Automatically log in after signup
          dispatch(setUser(res?.data?.user));
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Registration failed");
        console.log(error);
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-gray-200 shadow-md  hover:shadow-xl active:shadow-2xl transition-shadow border border-gray-200/50 rounded-2xl p-12 flex flex-col items-center w-full max-w-md">
        <img
          src="/NodesLogoForEcho.png"
          alt="Logo"
          className="w-24 mb-2 drop-shadow-sm"
        />
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome to Echo
          </h1>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="name"
                required
                onChange={handleChange}
                value={formData.name}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="username"
                required
                onChange={handleChange}
                value={formData.username}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            required
            onChange={handleChange}
            value={formData.email}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            required
            onChange={handleChange}
            value={formData.password}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="new-password"
              required
              onChange={handleChange}
              value={formData.confirmPassword}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-200"
            />
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-xl
             bg-[#1D9BF0] text-white shadow-lg
             hover:bg-[#1A8CD8] hover:shadow-xl hover:shadow-[#1D9BF0]/40
             hover:scale-[1.02] hover:-translate-y-0.5
             active:scale-[0.98] active:translate-y-0
             transition-all duration-200 ease-out
             border border-[#1D9BF0]/40 hover:border-[#1A8CD8]"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-slate-900 font-semibold hover:underline cursor-pointer transition-colors duration-200 hover:text-slate-700"
            onClick={handleToggle}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
