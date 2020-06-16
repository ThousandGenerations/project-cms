/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-16 21:33:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\redux\actions\login.js
 */

import { reqLogin } from "@api/acl/login";

import { reqMobileLogin } from "@api/acl/oauth";

import { LOGIN, LOGOUT } from "../constants/login";

// 手机号验证码登录,使用同一个登录接口
export const mobileLogin = (mobile, code) => {
  return (dispatch) => {
    return reqMobileLogin(mobile, code).then(({ token }) => {
      dispatch(loginSync(token));
      return token;
    });
  };
};

// 账号密码登录
// 同步action
export const loginSync = (token) => ({
  type: LOGIN,
  data: token,
});
// 异步请求
export const login = (username, password) => {
  return (dispatch) => {
    // 执行异步代码
    return reqLogin(username, password).then(({ token }) => {
      dispatch(loginSync(token));
      return token;
    });
  };
};

// 注销登录

export const logout = () => ({
  type: LOGOUT,
});

// 移除 token
export const removeToken = () => {};
