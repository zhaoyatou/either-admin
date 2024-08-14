import { http } from "@/utils/http";

// banner列表
export const getBannerList = (params?: any) =>
    http.request("get", `admin/v1/banner/list/page`, { params });

// 删除
export const delBanner = (id?: string) =>
    http.request("delete", `admin/v1/banner/${id}`);

// 创建
export const createBanner = (data?: any) =>
    http.request("post", `admin/v1/banner/create`, { data });

// 修改
export const upBanner = (id?: any, data?: any) =>
    http.request("post", `admin/v1/banner/${id}/update`, { data });

// 详情
export const getBanner = (id?: any) =>
    http.request("get", `admin/v1/banner/${id}`);