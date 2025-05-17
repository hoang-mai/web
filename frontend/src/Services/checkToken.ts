// src/api/auth.api.ts
import { post } from "./callApi"; 
import {checkTokenRoute} from './api'


export const checkToken = async (token: string) => {
  const response = await post(checkTokenRoute, { token })
  return response.data; 
}

