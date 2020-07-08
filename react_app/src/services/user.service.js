import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/candidates/";

const getPublicContent = () => {
  return axios.get(API_URL);
};

export default {
  getPublicContent
};