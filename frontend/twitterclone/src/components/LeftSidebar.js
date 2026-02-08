import {
  RiHome5Line,
  RiHashtag,
  RiNotification3Line,
  RiUser3Line,
  RiBookmarkLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMyProfile, getOtherUsers, setUser } from "../redux/userSlice";

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      // First clear the local storage
      localStorage.clear();

      // Then clear Redux state
      dispatch(setUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));

      // Then make the logout request
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      // Show success message
      toast.success(res.data.message || "Logged out successfully");

      // Finally navigate (use replace to prevent going back)
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.log(error);
    }
  };

  return (
    <div className="hidden md:flex w-[260px] flex-col min-h-screen border-r border-gray-200 dark:border-gray-800">
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Logo Section */}
        <div className="mb-10">
          <img
            width="60px"
            height="60px"
            src="/ZoomedLogo.png"
            alt="Logo"
            className="object-contain transition-transform duration-200 hover:scale-105"
          />
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className="group flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-gray-100"
          >
            <RiHome5Line
              size={22}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
              Home
            </span>
          </Link>

          <div className="group flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-gray-100 cursor-pointer">
            <RiHashtag
              size={22}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
              Explore
            </span>
          </div>

          <div className="group flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-gray-100 cursor-pointer">
            <RiNotification3Line
              size={22}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
              Notifications
            </span>
          </div>

          {user && (
            <Link
              to={`/profile/${user._id}`}
              className="group flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-gray-100"
            >
              <RiUser3Line
                size={22}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
                Profile
              </span>
            </Link>
          )}

          <Link
            to="/bookmarks"
            className="group flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-gray-100"
          >
            <RiBookmarkLine
              size={22}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
              Bookmarks
            </span>
          </Link>

          <div
            onClick={logoutHandler}
            className="group flex items-center px-4 py-3.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 ease-in-out active:scale-[0.98] active:bg-red-100 cursor-pointer"
          >
            <RiLogoutBoxRLine
              size={22}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            <span className="ml-4 font-medium text-[15px] tracking-[-0.01em]">
              Logout
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
