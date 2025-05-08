import axios, { AxiosResponse } from "axios";
import { refreshTokenRoute } from "./api";
import { useSessionExpired } from "@/store/useSessionExpired";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "vi",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processSuccessQueue = (token: string) => {
  failedQueue.forEach((prom) => {
    prom.resolve(token);
  });
  failedQueue = [];
};

const processFailureQueue = () => {
  failedQueue.forEach((prom) => {
    prom.reject();
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/login")) {
      return config;
    }
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      originalRequest._retry = true;

      if (isRefreshing) {
        // Nếu đã đang refresh, chờ đợi kết quả
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject:()=> {
              reject(error.response.data);
            }
          });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem("refresh_token");
      axios.post(import.meta.env.VITE_API_HOST+refreshTokenRoute, {refreshToken}).then((res) => {
        localStorage.setItem("access_token", res.data.data.access_token);
        processSuccessQueue(res.data.data.access_token);
        originalRequest.headers["Authorization"] = "Bearer " + res.data.data.access_token;
        return axiosInstance(originalRequest);
      }).catch((err) => {
        processFailureQueue();
        useSessionExpired.getState().showSessionExpiredModal();
        return Promise.reject(err);
      }).finally(() => {
        isRefreshing = false;
      });
    }
    return Promise.reject(error.response.data);
  }
);

export const get = (
  path: string,
  params?: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.get(path, { params });
};

export const post = (
  path: string,
  body: object,
  params?: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.post(path, body, { params });
};
export const put = (
  path: string,
  body: object,
  params?: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.put(path, body, { params });
};

export const del = (
  path: string,
  params?: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.delete(path, { params });
};

export const patch = (
  path: string,
  body: object,
  params?: Record<string, any>
): Promise<AxiosResponse<any, any>> => {
  return axiosInstance.patch(path, body, { params });
};
