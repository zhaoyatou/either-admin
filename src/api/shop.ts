import { http } from "@/utils/http";

// 商品列表
export const getShopList = (params?: any) =>
    http.request("get", `admin/v1/market/machine/list/page`, { params });

// 商品详情
export const getShop = (id?: string) =>
    http.request("get", `admin/v1/market/machine/${id}`);

// 审核通过
export const shopPass = (id?: string) =>
    http.request("post", `admin/v1/market/machine/${id}/audit/pass`);

// 审核拒绝
export const shopReject = (id?: string, data?: any) =>
    http.request("post", `admin/v1/market/machine/${id}/audit/reject`, { data });

// 下架
export const shopOffSale = (id?: string) =>
    http.request("post", `admin/v1/market/machine/${id}/off-sale`);

// 上架
export const shopOnSale = (id?: string) =>
    http.request("post", `admin/v1/market/machine/${id}/on-sale`);

// 设置评分
export const shopSetScore = (id?: string, data?: any) =>
    http.request("post", `admin/v1/market/machine/${id}/set/score`, { data });
// 设置评分
export const shopSetSort = (id?: string, data?: any) =>
    http.request("post", `admin/v1/market/machine/${id}/sort`, { data });

