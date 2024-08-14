import { http } from "@/utils/http";

// 一级分类列表
export const getCategoryTopList = (params?: any) =>
    http.request("get", `admin/v1/machine/category/top/list`, { params });

// 创建
export const createCategory = (data?: any) =>
    http.request("post", `admin/v1/machine/category/create`, { data });

// 修改
export const upCategory = (id?: any, data?: any) =>
    http.request("post", `admin/v1/machine/category/${id}/update`, { data });

// 详情
export const getCategory = (id?: any) =>
    http.request("get", `admin/v1/machine/category/${id}`);

// 删除
export const delCategory = (id?: string) =>
    http.request("delete", `admin/v1/machine/category/${id}`);

// 二级分类列表
export const getCategoryChildList = (id?: string, params?: any) =>
    http.request("get", `admin/v1/machine/category/${id}/child/list`, { params });