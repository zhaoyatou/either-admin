import { http } from "@/utils/http";

// vip列表
export const getVipList = (params?: any) =>
    http.request("get", `admin/v1/user/vip/list/page`, { params });

// 创建
export const createVip = (data?: any) =>
    http.request("post", `admin/v1/user/vip/create`, { data });

// 更新
export const upVip = (id?: any, data?: any) =>
    http.request("post", `admin/v1/user/vip/${id}/update`, { data });
