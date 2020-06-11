/*
 * @Author: your name
 * @Date: 2020-06-11 21:41:04
 * @LastEditTime: 2020-06-11 22:00:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Chapter\redux\reducers.js
 */
import { GET_ALL_COURSE_LIST } from "./constants";

// 初始化数据
const initChapter = {
  allCourseList: [],
};
export default function chapter(prevState = initChapter, action) {
  switch (action.type) {
    case GET_ALL_COURSE_LIST:
      return {
        ...initChapter,
        allCourseList: action.data,
      };

    default:
      return prevState;
  }
}
