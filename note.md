<!--
 * @Author: your name
 * @Date: 2020-06-08 20:57:46
 * @LastEditTime: 2020-06-10 22:40:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\note.md
--> 
## React-cms-project

### Mock.js
* Mock 是什么?
  * 生成随机数据,拦截 AJax 请求
* 安装 mockjs
  * npm install mockjs
* 使用Mock
  ```js
  // 使用 Mock
  var Mock = require('mockjs')
  var data = Mock.mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      'list|1-10': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1
      }]
  })
  // 输出结果
  console.log(JSON.stringify(data, null, 4))
  ```
* API
  * `const Random = Mock.random` 创建一个工具类,用于生成各种随机数据
  * `Random.ctitle()` 调用类的方法 ctitle 用于生成随机中文标题
  * `Mock.mock()` 模拟数据,生成的一系列模拟数据应该在这个方法里面做
  * `Random.integer()` 以某个范围取一个随机整数,实例:`Random.integer(+limit + 1, limit * 2)`
  * `items|${limit}` 生成数组,数组长度为limit
    * 数组中对象的属性
      * `"_id|+1:1"` 初始化 _id 为 1 遍历 ++
      * `@ctitle(x,y)` 调用 ctitle 方法,传递参数,控制长度( x 到 y )
      * 
### 使用 experss 框架搭建服务器返回mock数据
* API
  * `experss()` 调用函数创建应用对象,将来设置的后台路由方法都在上面
  * `use()` 实例对象的方法,用于创建中间件,接收三个参数`req` `res` `next` 
  * `res.set()` 设置请求头
  * `next()` 调用方法继续触发下一个中间件或者路由
  * `app.get()` 后台路由,接收两个参数,第一个参数是地址,第二个参数接收一个回调函数
  * `res.json()` 传递配置对象,返回响应
  * `listen` 实例对象方法,用于开启服务,启动监听,接收 3 个参数,端口号,主机名,回调函数
  
### 配置 api 发送请求
* 定义函数,将函数暴露,当外面调用这个函数的时候,返回一个请求信息
  ```js
  // 获取一级分类分页列表数据
  export function reqGetSubjectList(page, limit) {
    return request({
      url: `${MOCK_BASE_URL}/${page}/${limit}`, // 请求路径,开头是定义好的变量,保存的是每个请求都一样的公共前缀
      method: "GET", // 请求方式
    });
  }
  ```
### antd 库
* 按需引入: 可以直接解构要用到的组件使用

### 课程管理组件
* 引入需要的组件
  ```js
  import React, { Component } from "react";
  // 引入antd组件
  import { Button, Table } from "antd";
  // 引入antd字体图标
  import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
  // 引入请求函数
  import { reqGetSubjectList } from "@api/edu/subject";
  // 引入样式文件
  import "./index.less";
  ```
* 创建 ES6 类组件并暴露
  ```js
  export default class Subject extends Component {}
  ```
* 定义初始化状态
  ```js
  state = {
    subjects: {
      total: 0,
      items: [],
    },
  };
  ``` 
* 定义请求函数(调用函数发送 mock 请求获取相应的数据(使用 async await处理异步请求))
  ```js
    // 获取subject分页列表数据
  getSubjectList = async (page, limit) => {
    // console.log(page, limit);
    // 发送请求
    const result = await reqGetSubjectList(page, limit);
    // console.log(result);
    // 更新数据
    this.setState({
      subjects: result,
    });
  };
  ```
* 在componentDidMount()生命周期函数中开局请求第一页数据
  ```js
  componentDidMount() {
    // 代表一上来请求第一页数据
    this.getSubjectList(1, 10);
  }
  ```
* 渲染组件页面
  * 步骤
    * 获取状态
      ```jsx
      const { subjects } = this.state;
      ```
    * 返回页面
      ```jsx
      return (
        <div className="subject">
          <Button type="primary" className="subject-btn"> 
            <PlusOutlined /> // 字体图标
            新建
          </Button>
          // 单独定义表格的列
          <Table
            columns={columns} // 决定列头
            expandable={{
              // 决定列是否可以展开
              // 决定行展开时显示什么内容
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>{record.description}</p>
              ),
              // 决定行是否可以展开
              // 返回值true 就是可以展开
              // 返回值false 就是不可以展开
              rowExpandable: (record) => record.name !== "Not Expandable",
            }}
            dataSource={subjects.items} // 决定每一行显示的数据
            rowKey="_id" // 指定key属性的值是_id
            pagination={{
              total: subjects.total, // 数据总数
              showQuickJumper: true, // 是否显示快速跳转
              showSizeChanger: true, // 是否显示修改每页显示数量
              pageSizeOptions: ["5", "10", "15", "20"],
              defaultPageSize: 10,
              onChange: this.getSubjectList, // 页码发生变化触发的回调
            }}
          />
        </div>
      );
      ```
    * 单独定义表格列头
      ```jsx
        // 共两列,数组中的两个对象
       const columns = [
        // 第一列显示分类名称
        {
          // 表头显示的内容
          title: "分类名称",
          // 当前列要显示data中哪个数据（显示数据的key属性）
          // data[dataIndex]
          // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
          dataIndex: "title",
          // 遍历元素需要唯一key属性
          key: "title",
        },
        {
          title: "操作",
          dataIndex: "",
          key: "action",
          // 列的宽度
          width: 200,
          // 默认情况下，渲染的内容是纯文本
          // 如果想渲染成其他方案（按钮）需要用render方法指定
          render: () => (
            <>
              <Button type="primary">
                <FormOutlined />
              </Button>
              <Button type="danger" className="subject-btn">
                <DeleteOutlined />
              </Button>
            </>
          ),
        },
      ];
      ```
      * 分页完善
        ```js
        // 每页数量发生改变的时候
        // 参数： current： 当前页码  size：当前页数量
        handleChange = (current,size) =>{
          console.log(current,size);
          this.getSubjectList(current,size)
        }
        ```
### 点击一级菜单,显示二级菜单
* API
  * `expandedRowKeys` 对展开的行进行控制
  * `onExpandedRowsChange` 展开行的时候触发的方法 ,会将展开的行添加到数组中
* mock二级菜单数据
  * 问题:
    * 大家二级菜单服务器路由的时候,没有效果,请求进不去
  * 原因分析:
    * 首先二级菜单写在了一级菜单下面,一级菜单的请求路径为`"/admin/edu/subject/:page/:limit"`,二级菜单为`"/admin/edu/subject/get/:parentId"`,请求过来之后,上面两个地址都会命中`/admin/edu/subject/:page/:limit"`,后面路由就不会执行,所以请求不会进来
    * 解决:二级菜单必须发放在前面 直接命中二级菜单
  * 问题:
    * 模拟数据,当数据之后一条的时候,返回的是一个对象而不是数组
  * 原因分析:
    * mock机制问题,当数组里面的元素是一个个对象的时候,这个时候随机数据只有一个元素,那么就会只有这个元素的对象,忽略数组
  * 解决:
    * 判断总数的长度,如果为 1 ,将数据修改为数组  `if(total === 1) data.items = [data.items]`
  * 步骤:
    * 获取请求参数params
    * 模拟数据
    * 返回响应
* 使用 redux 管理数据
  * 步骤
    * 定义 API 获取二级分类的分页列表数据
    * 定义常量模块
    * 定义同步 action 获取二级课程分类数据
    * 定义异步 action 返回 dispatch 发送请求返回数据
    * 定义 reducer 生成新 state 
* 在组件中显示数据
  * 在 `onExpandedRowsChange` 回调中定义展开行的方法
  * 展开的时候应该发送请求并更新组件状态,关闭的时候只应该更新组件,不应该发送请求
### 点击'新建'按钮,跳转到添加课程界面并添加数据
* 注意: 使用 `express` 框架时,默认不解析请求体数据 必须使用中间件解析POST\PUT请求的请求体参数
* 实现步骤
  * 显示'新建页面',调用路由
  * 新建组件并在 `config/asyncCompos` 中统一暴露
  * `antd` 表单组件配合工厂函数组件使用
  * 搭建结构
  * 前端验证,验证成功后提示添加数据成功,之后跳回列表页面查看数据
  * 使用Hooks定义工厂函数生命周期函数
  * 在生命周期函数中发送请求请求数据
  * 点击加载更多加载一份全新数据