/*
 * @Author: Thousand generations
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-10 23:56:01
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
// 使用中间件解析 POST\PUT 请求的请求体 \\ 默认express不解析请求体数据 必须使用中间件获取请求体
app.use(express.json());

app.use((req, res, next) => {
  // 设置响应头，将来用作响应数据返回给客户端使用
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "content-type, token");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next(); //调用next，可以触发下一个路由
});

app.post("/admin/edu/subject/save", (req, res, next) => {
  // 默认express不解析请求体参数
  // 需要使用中间件
  const { title, parentId } = req.body; // 从请求体获取数据

  console.log(title, parentId);

  // 返回响应
  res.json({
    code: 20000, // 成功状态码
    success: true, // 成功
    data: {
      // 成功的具体数据
      _id: Date.now(),
      title,
      parentId,
    },
    message: "", // 失败原因
  });
});

// 二级菜单
/* 
  因为一级菜单`/admin/edu/subject/:page/:limit` 这个路径 二级菜单/get/xxx 会命中一级菜单 ,如果不把二级菜单路由放在前面,就会命中一级菜单导致二级菜单键进不来
*/
app.get("/admin/edu/subject/get/:parentId", (req, res, next) => {
  // 获取请求参数params
  const {
    parentId, // 获取父级分类id
  } = req.params;
  // 模拟数据,以0-2的范围取一个整数
  const total = Random.integer(0, 5);
  // 定义模拟数据
  const data = Mock.mock({
    total,
    [`items|${total}`]: [
      {
        "_id|+1": 100,
        title: "@ctitle(2,5)", //2 - 5个字的中文标题
        parentId,
      },
    ],
  });
  // 问题:当total长度为1的时候,返回值就不是数组了,因为只有一条数据,会自动变成对象,这种情况会引起报错,这个时候应该吧items数据强制变为数组,而不是对象
  if (total === 1) {
    // 当total总数为1的时候,修改data.items数据为数组
    data.items = [data.items];
  }

  // 返回响应
  res.json({
    code: 20000,
    success: true,
    data,
    message: "",
  });
});

// 一级菜单
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
