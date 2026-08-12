import axios from "axios";
import type {
     AxiosInstance,
     AxiosError,
     InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
     baseURL: process.env.NEXT_PUBLIC_BACkEND_URL,
     timeout: 5000,
     withCredentials: true,
});

const refrshEndPointApi: AxiosInstance = axios.create({
     baseURL: process.env.NEXT_PUBLIC_BACkEND_URL,
     withCredentials: true,
});

interface FailedQueueResponse {
     resolve: () => void;
     reject: (error: unknown) => void;
}

interface RetryAbleAxiosConfig extends InternalAxiosRequestConfig {
     _retry: boolean;
}

let isRefreshing = false;
let failedQueue: FailedQueueResponse[] = [];

const processQueue = (err: unknown) => {
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
     async (err: AxiosError) => {
          const originalRequest = err.config as RetryAbleAxiosConfig;

          if (
               err.response?.status === 401 &&
               originalRequest &&
               !originalRequest._retry
          ) {
               if (isRefreshing) {
                    return new Promise<void>((resolve, reject) => {
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
                    if (
                         typeof window !== "undefined" &&
                         window.location.pathname !== "/"
                    ) {
                         window.location.replace("/");
                    }
                    return Promise.reject(error);
               } finally {
                    isRefreshing = false;
               }
          }

          return Promise.reject(err);
     },
);

export default api;
