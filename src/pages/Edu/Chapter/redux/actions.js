/*
 * @Author: your name
 * @Date: 2020-06-11 21:40:55
 * @LastEditTime: 2020-06-13 13:00:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Chapter\redux\actions.js
 */
// 引入请求
import { reqGetAllCourseList } from "@api/edu/course";
import { reqGetChapterList } from "@api/edu/chapter";
import { reqGetLessonList } from "@api/edu/lesson";

// 常量封装获取
import {
  GET_ALL_COURSE_LIST,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
} from "./constants";
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

// 获取课程对应章节数据
// 同步action
export const getChapterListSync = (data) => ({
  type: GET_CHAPTER_LIST,
  data,
});
// 异步actions 需要页码 每页条数以及课程id
export const getChapterList = ({ page, limit, courseId }) => {
  return (dispatch) => {
    // 返回dispatch
    // 返回请求,传递参数,返回成功promise,分发异步action传递给同步action
    return reqGetChapterList({ page, limit, courseId }).then((response) => {
      dispatch(getChapterListSync({ chapters: response, courseId }));
      // console.log(courseId);
      // 将相应数据返回供外部使用
      return { response, courseId };
    });
  };
};

// 请求章节对应课时数据
const getLessonListSync = (data) => ({
  type: GET_LESSON_LIST,
  data,
});

export const getLessonList = (chapterId) => {
  return (dispatch) => {
    return reqGetLessonList(chapterId).then((response) => {
      dispatch(getLessonListSync({ chapterId, lessons: response }));
      console.log(response);
      return response;
    });
  };
};
