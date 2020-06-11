/*
 * @Author: your name
 * @Date: 2020-06-10 09:44:08
 * @LastEditTime: 2020-06-11 21:01:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Subject\redux\reduce.js
 */
import {
  GET_SUBJECT_LIST,
  GET_SUB_SUBJECT_LIST,
  UPDATE_SUBJECT,
} from "./constants";

// 初始化数据
const initSubjectList = {
  total: 0, // 总数
  items: [], // 课程分类列表数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST: // 获取一级课程分类数据
      return {
        total: action.data.total,
        items: action.data.items.map((subject) => {
          return {
            ...subject,
            children: [], // 添加children属性，当前项就是可展开项，才会显示展开图标
          };
        }),
      };
    case GET_SUB_SUBJECT_LIST: // 获取二级课程分类数据
      // 将二级分类数据添加到某个一级分类数据children上~
      const { parentId, subSubjectList } = action.data;
      return {
        total: prevState.total,
        items: prevState.items.map((subject) => {
          if (subject._id === parentId) {
            subject.children = subSubjectList;
          }
          return subject;
        }),
      };
    case UPDATE_SUBJECT:
      // 将新数据返回
      return {
        total: prevState.total,
        items: prevState.items.map((subject) => {
          // 一级菜单
          // 如果当前id等于action请求之后的id,添加最新数据
          if (subject._id === action.data._id) {
            return {
              ...subject, // 原数据
              ...action.data, // 最新数据覆盖原数据
            };
          }
          // 二级菜单
          subject.children = subject.children.map((item) => {
            if (item._id === action.data.id) {
              return {
                ...item,
                ...action.data,
              };
            }
            return item;
          });
          return subject;
        }),
      };
    default:
      return prevState;
  }
}
