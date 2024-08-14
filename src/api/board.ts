import { http } from "@/utils/http";

// 获取列表
export const getBoardDate = (data?: any) =>
    http.request("post", `admin/v1/platform/data`, { data });