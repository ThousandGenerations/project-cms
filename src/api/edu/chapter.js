/*
 * @Author: your name
 * @Date: 2020-06-12 14:49:08
 * @LastEditTime: 2020-06-12 14:52:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\edu\chapter.js
 */
import request from "@utils/request";

// 模块请求公共数据
const BASE_URL = "/admin/edu/chapter";

// 获取所有课程数据方法
export function reqGetChapterList({ page, limit, courseId }) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
    params: {
      // query参数
      courseId,
    },
  });
}
