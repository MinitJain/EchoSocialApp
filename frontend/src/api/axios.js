import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url || url === "undefined" || url === "") {
    return "/api/v1";
  }
  return url;
};

const API = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export default API;
