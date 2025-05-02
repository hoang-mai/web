// src/api/auth.api.ts
import { get, post } from "./callApi"; // Đường dẫn tới file axios của bạn
import {loginRoute,registerRoute,checkTokenRoute} from './api'


export const login = async (email: string, password: string) => {
  const response = await post(loginRoute, { email, password });
  return response.data.data; // chứa access_token
};

export const checkToken = async () => {
  const response = await get(checkTokenRoute)
  return response.data.valid; 
}

export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}) => {
  const response = await post(registerRoute, data);
  return response.data;
};
