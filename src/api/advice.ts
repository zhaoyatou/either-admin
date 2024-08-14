import { http } from "@/utils/http";

// 建议列表
export const getAdviceList = (params?: any) =>
    http.request("get", `admin/v1/user/advice/list/page`, { params });

// 回复
export const upAdvice = (id?: string, data?: any) =>
    http.request("post", `admin/v1/user/advice/${id}/update`, { data });