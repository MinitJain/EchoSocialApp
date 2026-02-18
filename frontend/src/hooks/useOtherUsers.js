import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux"; // 1. Added useSelector here
import { getOtherUsers } from "../redux/userSlice";
import { useCallback, useEffect } from "react";

const useOtherUsers = () => {
  const dispatch = useDispatch();

  const { otherUsers } = useSelector((store) => store.user);

  const fetchOtherUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/otherusers`, {
        withCredentials: true,
      });

      console.log("Full Other Users Response:", res.data);
      dispatch(getOtherUsers(res.data.otherUsers));
    } catch (error) {
      console.log("Failed to fetch other users Error: ", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!otherUsers || otherUsers?.length === 0) {
      fetchOtherUsers();
    }
  }, [fetchOtherUsers, otherUsers]);
};

export default useOtherUsers;
