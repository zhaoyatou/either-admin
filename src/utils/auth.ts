import Cookies from "js-cookie";
import { storageSession } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo {
  /** 用户名 */
  name: string;
  /** 当前登陆用户的角色 */
  roles: Array<{ id: string, name: string }>;
  // 手机号
  phone: string
  // ID
  id: string
  // 头像
  photo_url: string,
  token: string
}

export interface Token {
  [x: string]: string | number;
  token: string
}

export const sessionKey = "user-info";
export const TokenKey = "x-token";

/** 获取`token` */
export function getToken(): Token {
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey);
}

/**
 * 设置`token`以及一些必要信息并采用无感刷新`token`方案
 */
export function setToken(data: Token) {
  const { token } = data;
  const cookieString = JSON.stringify({ token });
  Cookies.set(TokenKey, cookieString);
}

// 设置用户信息缓存
export function setUserInfo(data: DataInfo) {
  function setSessionKey(name: string, roles: Array<{ id: string, name: string }>, phone: string, id: string, photo_url: string, token: string) {
    useUserStoreHook().SET_USERNAME(name);
    useUserStoreHook().SET_PHONE(phone);
    useUserStoreHook().SET_ID(id);
    useUserStoreHook().SET_ROLES(roles);
    useUserStoreHook().SET_ROLES(roles);
    storageSession().setItem(sessionKey, {
      name,
      phone,
      id,
      photo_url,
      roles,
      token
    });
  }

  if (data) {
    const { name, roles, id, phone, photo_url, token } = data;
    setSessionKey(name, roles, phone, id, photo_url, token);
  } else {
    const name =
      storageSession().getItem<DataInfo>(sessionKey)?.name ?? "";
    const roles =
      storageSession().getItem<DataInfo>(sessionKey)?.roles ?? [];
    const phone =
      storageSession().getItem<DataInfo>(sessionKey)?.phone ?? "";
    const id =
      storageSession().getItem<DataInfo>(sessionKey)?.id ?? "";
    const photo_url =
      storageSession().getItem<DataInfo>(sessionKey)?.photo_url ?? "";
    const token =
      storageSession().getItem<DataInfo>(sessionKey)?.token ?? "";
    setSessionKey(name, roles, phone, id, photo_url, token);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  sessionStorage.clear();
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return token;
};
