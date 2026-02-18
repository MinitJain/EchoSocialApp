import { useEffect } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch } from "react-redux";
import { getMyProfile } from "../redux/userSlice";

const useGetProfile = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!id) return;

        let res;

        if (id === "me") {
          res = await axios.get(`${USER_API_END_POINT}/me`, {
            withCredentials: true,
          });
        } else {
          res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
            withCredentials: true,
          });
        }

        dispatch(getMyProfile(res.data.user));
      } catch (error) {
        console.log("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [id, dispatch]);
};

export default useGetProfile;
