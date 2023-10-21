import axios from "axios";

export const axiosURL = axios.create({
  baseURL: "http://simple-react-app-api-production.up.railway.app",
  headers: {
    "Content-type": "application/json"
  }
});