/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-10 23:58:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\config\asyncComps.js
 */

/*
  将所有组件引入模块
*/
import { lazy } from "react";

const Admin = () => lazy(() => import("@pages/Admin"));
const User = () => lazy(() => import("@pages/Acl/User"));
const AddOrUpdateUser = () =>
  lazy(() => import("@pages/Acl/User/components/AddOrUpdateUser"));
const AssignUser = () =>
  lazy(() => import("@pages/Acl/User/components/AssignUser"));
const Role = () => lazy(() => import("@pages/Acl/Role"));
const Permission = () => lazy(() => import("@pages/Acl/Permission"));
const AssignRole = () =>
  lazy(() => import("@pages/Acl/Role/components/AssignRole"));
const AddOrUpdateRole = () =>
  lazy(() => import("@pages/Acl/Role/components/AddOrUpdateRole"));
const Chapter = () => lazy(() => import("@pages/Edu/Chapter"));
const Comment = () => lazy(() => import("@pages/Edu/Comment"));
const Course = () => lazy(() => import("@pages/Edu/Course"));
const Subject = () => lazy(() => import("@pages/Edu/Subject"));
const Teacher = () => lazy(() => import("@pages/Edu/Teacher"));
const Settings = () => lazy(() => import("@pages/User/Settings"));
const Center = () => lazy(() => import("@pages/User/Center"));
const AddSubject = () =>
  lazy(() => import("../pages/Edu/Subject/components/AddSubject"));

export default {
  Admin,
  User,
  AddOrUpdateUser,
  AssignUser,
  Role,
  Permission,
  AssignRole,
  AddOrUpdateRole,
  Chapter,
  Comment,
  Course,
  Subject,
  Teacher,
  Settings,
  Center,
  AddSubject,
};
