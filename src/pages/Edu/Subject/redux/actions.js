/*
 * @Author: your name
 * @Date: 2020-06-10 09:43:45
 * @LastEditTime: 2020-06-11 01:40:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\pages\Edu\Subject\redux\actions.js
 */

// 引入请求api
import { reqGetSubjectList, reqGetSubSubjectList } from "@api/edu/subject";
// 引入常量模块
import { GET_SUBJECT_LIST, GET_SUB_SUBJECT_LIST } from "./constants";

/*
  获取一级课程分类数据
*/
const getSubjectListSync = (subjectList) => ({
  type: GET_SUBJECT_LIST,
  data: subjectList,
});

export const getSubjectList = (page, limit) => {
  // 外面使用异步action时，异步action返回值是最里面函数的返回值
  return (dispatch) => {
    // 发送请求获取课程分类管理数据
    // return有什么作用
    // return为了让外面能有返回值，从而根据返回值判断请求成功或者失败
    return reqGetSubjectList(page, limit).then((response) => {
      // 更新redux状态
      dispatch(getSubjectListSync(response));
      // 请求成功返回一个请求成功的数据
      return response.items;
    });
  };
};

/*
  获取二级课程分类数据
*/
const getSubSubjectListSync = (data) => ({
  type: GET_SUB_SUBJECT_LIST,
  data,
});

export const getSubSubjectList = (parentId) => {
  return (dispatch) => {
    return reqGetSubSubjectList(parentId).then((response) => {
      dispatch(
        getSubSubjectListSync({ parentId, subSubjectList: response.items })
      );
      return response;
    });
  };
};
