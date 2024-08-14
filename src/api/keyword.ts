import { http } from "@/utils/http";

// 搜索词列表
export const getKeywordList = (params?: any) =>
    http.request("get", `admin/v1/search/keyword/list/page`, { params });

// 创建
export const upKeyword = (data?: any) =>
    http.request("post", `admin/v1/search/keyword/create`, { data });

// 设置热词
export const setKeyword = (id?: string, data?: any) =>
    http.request("post", `admin/v1/search/keyword/${id}/update/is-hot`, { data });

// 设置排序
export const setKeywordSort = (id?: string, data?: any) =>
    http.request("post", `admin/v1/search/keyword/${id}/update/sort`, { data });