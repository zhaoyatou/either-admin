import { http } from "@/utils/http";

export type LoginResult = {
  data: {
    /** token */
    toekn: string;
  };
};

export type UserResult = {
  data: {
    // 名字
    name: string
    // 手机号
    phone: string
    // 头像
    photo_url: string
    // 权限
    roles: Array<{ id: string, name: string }>
  }
}

/** 密码登录 */
export const getLogin = (data?: object) =>
  http.request<LoginResult>("post", "admin/v1/sys-user/login", { data });

// 获取个人信息 后续权限相关
export const getUserInfo = (data?: object) =>
  http.request<UserResult>("get", "v1/my/info", { data });

// 获取验证码 后续
export const getCode = (data) =>
  http.request("post", "code", { data })

// 获取用户列表
export const getUserList = (params?: any) =>
  http.request("get", "admin/v1/user/list/page", { params });

// 认证审核通过
export const userIdentityPass = (id: string) =>
  http.request("post", `admin/v1/user/${id}/identity/audit/pass`);

// 认证审核拒绝
export const userIdentityReject = (id: string) =>
  http.request("post", `admin/v1/user/${id}/identity/audit/reject`);

