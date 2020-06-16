/*
 * @Author: your name
 * @Date: 2020-06-16 20:19:51
 * @LastEditTime: 2020-06-16 20:22:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\acl\oauth.js
 */
// 发送验证码
import request from "@utils/request";

const BASE_URL = "/oauth";

// 发送验证码
export function reqSendCode(mobile) {
  return request({
    url: `${BASE_URL}/sign_in/digits`,
    method: "POST",
    data: {
      // 参数
      mobile,
    },
  });
}

// 使用手机号登陆
export function reqMobileLogin(mobile, code) {
  return request({
    url: `${BASE_URL}/mobile`,
    method: "POST",
    data: {
      // 参数
      mobile,
      code,
    },
  });
}
