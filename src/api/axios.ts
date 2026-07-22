import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
     baseURL: process.env.NEXT_PUBLIC_BACkEND_URL,
     timeout: 5000,
     withCredentials: true,
});

const refrshEndPointApi: AxiosInstance = axios.create({
     baseURL: process.env.NEXT_PUBLIC_BACkEND_URL,
     withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err) => {
     failedQueue.forEach((prom) => {
          if (err) {
               prom.reject(err);
          } else {
               prom.resolve();
          }
     });
     failedQueue = [];
};

api.interceptors.response.use(
     (response) => response,
     async (err) => {
          const originalRequest = err.config;

          if (err.response?.status === 401 && !originalRequest._retry) {
               if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                         failedQueue.push({ resolve, reject });
                    })
                         .then(() => {
                              return api(originalRequest);
                         })
                         .catch((err) => Promise.reject(err));
               }

               originalRequest._retry = true;
               isRefreshing = true;

               try {
                    await refrshEndPointApi.post("/auth/refresh-token");
                    processQueue(null);
                    return api(originalRequest);
               } catch (error) {
                    processQueue(error);
                 
                    return Promise.reject(error);
               } finally {
                    isRefreshing = false;
               }
          }

          return Promise.reject(err);
     },
);

export default api;
