/*
 * @Author: your name
 * @Date: 2020-06-11 21:50:31
 * @LastEditTime: 2020-06-13 22:44:57
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
// 获取所有课程分页列表数据
// 获取课程分页列表数据
export function reqGetCourseList({
  page,
  limit,
  teacherId,
  subjectId,
  subjectParentId,
  title,
}) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
    params: {
      teacherId,
      subjectId,
      subjectParentId,
      title,
    },
  });
}
