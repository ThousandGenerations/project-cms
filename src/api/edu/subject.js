/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-09 00:04:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\edu\subject.js
 */ 
import request from "@utils/request";

// 模块请求公共前缀
const BASE_URL = "/admin/edu/subject"; // 线上访问地址，内部会通过服务器代理代理真实线上地址

// mock地址
const MOCK_BASE_URL = `http://localhost:9527${BASE_URL}`;

// 获取一级分类分页列表数据
export function reqGetSubjectList(page, limit) { //请求函数，接受当前页码和每页数量
  return request({  
    url: `${MOCK_BASE_URL}/${page}/${limit}`,  // 请求地址： 使用自己搭的服务器mock数据
    method: "GET", // 请求方式
  });
}
