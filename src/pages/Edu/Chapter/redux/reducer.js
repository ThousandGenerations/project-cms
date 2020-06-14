/*
 * @Author: your name
 * @Date: 2020-06-11 21:41:04
 * @LastEditTime: 2020-06-13 13:12:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Chapter\redux\reducers.js
 */
import {
  GET_ALL_COURSE_LIST,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
} from "./constants";

// 初始化数据
const initChapter = {
  allCourseList: [],
  chapters: {
    total: 0,
    items: [],
    id: "",
  },
};
export default function chapter(prevState = initChapter, action) {
  switch (action.type) {
    case GET_ALL_COURSE_LIST:
      return {
        ...prevState,
        allCourseList: action.data,
      };
    case GET_CHAPTER_LIST:
      return {
        ...prevState,
        chapters: {
          total: action.data.chapters.total,
          items: action.data.chapters.items.map((chapter) => {
            return {
              ...chapter,
              children: [], //加上children属性才能展开
            };
          }),
          id: action.data.courseId,
        },
      };
    case GET_LESSON_LIST:
      return {
        ...prevState,
        chapters: {
          total: prevState.chapters.total,
          items: prevState.chapters.items.map((chapter) => {
            // 找到要更新章节数据并更新
            if (chapter._id === action.data.chapterId) {
              return {
                ...chapter,
                children: action.data.lessons,
              };
            }
            return chapter;
          }),
        },
      };
    default:
      return prevState;
  }
}
