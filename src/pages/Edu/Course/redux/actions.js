/*
 * @Author: your name
 * @Date: 2020-06-13 21:15:29
 * @LastEditTime: 2020-06-14 14:18:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Course\redux\actions.js
 */
import { reqGetCourseList } from "@api/edu/course";
import { GET_COURSE_LIST, GET_TEACHER } from "./contants";
import { reqGetTeacher } from "@api/edu/teacher";
// 获取课程分页列表数据

// 同步action
const getCourseListSync = (courseList) => ({
  type: GET_COURSE_LIST,
  data: courseList,
});

// 异步actions
export const getCourseList = ({
  page,
  limit,
  teacherId,
  subjectId,
  subjectParentId,
  title,
}) => {
  return (dispatch) => {
    return reqGetCourseList({
      page,
      limit,
      teacherId,
      subjectId,
      subjectParentId,
      title,
    }).then((response) => {
      dispatch(getCourseListSync(response));
      return response;
    });
  };
};

const getTeacherSync = (data) => ({
  type: GET_TEACHER,
  data,
});

export const getTeacher = (teacherId) => {
  return (dispatch) => {
    return reqGetTeacher(teacherId).then((response) => {
      dispatch(getTeacherSync(response.name));
      console.log(response.name);
      return response.name;
    });
  };
};
