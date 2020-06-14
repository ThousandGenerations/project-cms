/*
 * @Author: your name
 * @Date: 2020-06-13 21:15:58
 * @LastEditTime: 2020-06-14 05:22:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Course\redux\reducer.js
 */
import { GET_COURSE_LIST, GET_TEACHER } from "./contants";

const initCourseList = {
  total: 0,
  items: [],
};

export default function courseList(prevState = initCourseList, action) {
  switch (action.type) {
    case GET_COURSE_LIST:
      return action.data;
    case GET_TEACHER:
      return {
        total: prevState.total,
        items: prevState.items.map((item) => {
          return {
            ...item,
            name: action.data,
          };
        }),
      };
    default:
      return prevState;
  }
}
