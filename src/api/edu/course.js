/*
 * @Author: your name
 * @Date: 2020-06-11 21:50:31
 * @LastEditTime: 2020-06-11 21:52:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\edu\course.js
 */
import request from "@utils/request";

// 模块请求的公共前缀

const BASE_URL = "/admin/edu/course";

// 获取所有课程数据
export function reqGetAllCourseList() {
  return request({ url: `${BASE_URL}`, method: "GET" });
}
