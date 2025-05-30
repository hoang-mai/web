import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("access_token");
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.sub || null;
  } catch {
    return null;
  }
};
