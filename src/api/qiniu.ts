import { http } from "@/utils/http";

// 获取七牛token
export const getQiniuToken = () =>
    http.request("post", `admin/v1/upload/qiniu/token`);

