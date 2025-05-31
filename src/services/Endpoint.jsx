import axios from "axios";

// export const BASE_URL = "https://ayurguide-451219.uc.r.appspot.com";
export const BASE_URL = "https://dva-mybackend-deployment.onrender.com/";

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
instance.interceptors.request.use(
    (config) => {
        console.log('Request:', {
            url: config.url,
            method: config.method,
            data: config.data
        });
        return config;
    },
    (error) => Promise.reject(error)
);

export const post = (url, data) => instance.post(url, data);
export const get = (url, params) => instance.get(url, { params });
export const patch = (url, data) => instance.patch(url, data);
export const dele = (url) => instance.delete(url);
