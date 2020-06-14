/*
 * @Author: your name
 * @Date: 2020-06-12 19:31:54
 * @LastEditTime: 2020-06-12 21:25:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\edu\lesson.js
 */
import request from "@utils/request";
// 模块请求公共数据
const BASE_URL = "/admin/edu/lesson";
// 获取所有课程数据
export function reqGetLessonList(chapterId) {
  return request({
    url: `${BASE_URL}/get/${chapterId}`,
    method: "GET",
  });
}

// 添加课时数据
export function reqAddLesson({ chapterId, title, free, video }) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      chapterId,
      title,
      free,
      video,
    },
  });
}
