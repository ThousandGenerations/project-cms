/*
 * @Author: your name
 * @Date: 2020-06-12 21:49:17
 * @LastEditTime: 2020-06-12 21:49:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\api\edu\upload.js
 */
import request from "@utils/request";

// 获取七牛上传凭证
export function reqGetUploadToken() {
  return request({
    url: `/uploadtoken`,
    method: "GET",
  });
}
