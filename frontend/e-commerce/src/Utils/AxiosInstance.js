import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:2024/',
    withCredentials: true
})

export default axiosInstance
