import { http } from "@/utils/http";

// 用户列表列表
export const getUserList = (params?: any) =>
    http.request("get", `admin/v1/user/list/page`, { params });

// 用户详情
export const getUserDetail = (id?: string) =>
    http.request("get", `admin/v1/user/${id}/identity`);

// 审核通过
export const userPass = (id?: string) =>
    http.request("post", `admin/v1/user/${id}/identity/audit/pass`);

// 审核拒绝
export const userReject = (id?: string, data?: any) =>
    http.request("post", `admin/v1/user/${id}/identity/audit/reject`, { data });


