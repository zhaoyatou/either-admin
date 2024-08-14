import { http } from "@/utils/http";

// 支付列表
export const getPayList = (params?: any) =>
    http.request("get", `admin/v1/user/pay/list/page`, { params });

// 创建
export const createPay = (data?: any) =>
    http.request("post", `admin/v1/user/pay/create`, { data });