/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-16 20:18:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\redux\reducer\login.js
 */

import { LOGIN, LOGOUT } from "../constants/login";

const initToken = localStorage.getItem("user_token") || "";

export default function token(prevState = initToken, action) {
  switch (action.type) {
    case LOGIN:
      return action.data;
    case LOGOUT:
      return "";
    default:
      return prevState;
  }
}
