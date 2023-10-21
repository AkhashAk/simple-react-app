import axios from "axios";

export const axiosURL = axios.create({
  baseURL: "https://simple-react-app-api-production.up.railway.app",
  headers: {
    "Content-type": "application/json"
  }
});