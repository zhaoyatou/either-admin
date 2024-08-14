import { http } from "@/utils/http";

// 登陆
export const goLogin = (data: any) => http.request("post", "login", { data })

export const getStatus = () => http.request("get", "status")