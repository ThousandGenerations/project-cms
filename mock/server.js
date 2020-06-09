/*
 * @Author: Thousand generations
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-09 21:36:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\mock\server.js
 */

// 搭建服务器,使用express框架
const express = require("express");
// 引入mockjs
const Mock = require("mockjs");
// 调用express创建app应用对象
const app = express();
// 创建工具类 用于生成随机数据
const Random = Mock.Random;
// 生成随机中文标题
Random.ctitle();

app.use((req, res, next) => {
  // 设置响应头，将来用作响应数据返回给客户端使用
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type, token");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next(); //调用next，可以触发下一个路由
});

// 模拟请求，返回数据
// http://47.103.203.152/admin/edu/subject/:page/:limit get
// 后台路由只能接受特定的请求方式和请求的地址
app.get("/admin/edu/subject/:page/:limit", (req, res, next) => {
  // 获取params参数
  const {
    page, //当前页
    limit,
  } = req.params;

  // 使用Mock模拟数据
  const data = Mock.mock({
    total: Random.integer(+limit + 1, limit * 2), // 以某个的范围取一个随机整数
    [`items|${limit}`]: [
      {
        // 有个属性 _id 初始化值是 1
        // 遍历 会++
        "_id|+1": 1,
        // @ctitle 会使用上面 Random.ctitle() 来生成随机标题
        // @ctitle(2,5) 控制长度为2-5
        title: "@ctitle(2,5)",
        parentId: 0,
      },
    ],
  });

  res.json({
    code: 20000,
    success: true,
    data,
    message: "", //失败原因，无
  }); // 将数据转换成json返回
});

app.listen(9527, "localhost", (err) => {
  if (err) {
    console.log("err", err);
    return;
  }
  console.log("ok");
});
