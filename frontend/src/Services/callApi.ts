import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
    },
})
export const get = (path: string, params?: Record<string, any>): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.get(path, { params });
};

export const post = (path: string, body: object, params?: Record<string, any>): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.post(path, body, { params });
};
export const put = (path: string, body: object, params?: Record<string, any>): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.put(path, body, { params });
};

export const del = (path: string, params?: Record<string, any>): Promise<AxiosResponse<any, any>> => {
    return axiosInstance.delete(path, { params });
};