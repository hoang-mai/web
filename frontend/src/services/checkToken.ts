// src/api/auth.api.ts
import { post } from "./callApi.ts";
import {checkTokenRoute} from './api.ts'


export const checkToken = async (token: string) => {
  const response = await post(checkTokenRoute, { token })
  return response.data; 
}

