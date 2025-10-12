import axios from 'axios'

const API_URI = import.meta.env.VITE_NODE_ENV === 'development' ? 'http://localhost:5000' : '/'

// Base URL automatically switches depending on environment
const api = axios.create({
    baseURL: API_URI,
    withCredentials: true, // optional if using cookies
})

// Optional: request/response interceptors
api.interceptors.request.use(
    (config) => {
        // console.log(`[${import.meta.env.VITE_NODE_ENV}] Request:`, config.url);
        return config
    },
    (error) => Promise.reject(error),
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error)
    },
)

export default api
