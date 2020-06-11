/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-11 22:27:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\redux\reducer\index.js
 */

import { combineReducers } from "redux";

import loading from "./loading";
import token from "./login";

import { user } from "@comps/Authorized/redux";
import { userList } from "@pages/Acl/User/redux";
import { roleList } from "@pages/Acl/Role/redux";
import { menuList } from "@pages/Acl/Permission/redux";
// @qiandai Subject模块的状态数据
import { subjectList } from "@pages/Edu/Subject/redux";
import { chapter } from "@pages/Edu/Chapter/redux";
export default combineReducers({
  loading,
  user,
  token,
  userList,
  roleList,
  menuList,
  subjectList,
  chapter,
});
