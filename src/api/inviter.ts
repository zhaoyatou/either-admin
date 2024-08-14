import { http } from "@/utils/http";

// 推广列表
export const getInviterList = (params?: any) =>
    http.request("get", `admin/v1/user/inviter/list/page`, { params });

// 创建
export const createInviter = (data?: any) =>
    http.request("post", `admin/v1/user/inviter/create`, { data });

// 更新
export const upInviter = (id?: any, data?: any) =>
    http.request("post", `admin/v1/user/inviter/${id}/update`, { data });
