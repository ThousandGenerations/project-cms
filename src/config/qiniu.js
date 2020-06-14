/*
 * @Author: your name
 * @Date: 2020-06-12 21:37:22
 * @LastEditTime: 2020-06-12 22:41:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\config\qiniu.js
 */
import * as qiniu from "qiniu-js";

export default {
  // qiniu.region.z0: 代表华东区域
  region: qiniu.region.z1,
  // qiniu.region.z2: 代表华南区域
  // qiniu.region.na0: 代表北美区域
  // qiniu.region.as0: 代表东南亚区域
  //   region: qiniu.region.z2,
  // 视频访问前缀地址
  prefix_url: "http://qbsmotwo5.bkt.clouddn.com/",
};
