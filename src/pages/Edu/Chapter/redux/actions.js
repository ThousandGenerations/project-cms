/*
 * @Author: your name
 * @Date: 2020-06-11 21:40:55
 * @LastEditTime: 2020-06-11 21:58:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Chapter\redux\actions.js
 */

import { reqGetAllCourseList } from "@api/edu/course";
import { GET_ALL_COURSE_LIST } from "./constants";

// 获取所有课程的数据
// 同步action
export const getAllCourseListSync = (courseList) => ({
  type: GET_ALL_COURSE_LIST,
  data: courseList,
});
export const getAllCourseList = () => {
  return (dispatch) => {
    return reqGetAllCourseList().then((response) => {
      dispatch(getAllCourseListSync(response));
      return response;
    });
  };
};
