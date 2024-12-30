import axios from "axios";

const serverUrl = "https://api.freeapi.app";
const APIVersion = "v1";

const axiosService = axios.create({
  baseURL: `${serverUrl}/api/${APIVersion}`,
});

export default axiosService;