<!--
 * @Author: your name
 * @Date: 2020-06-08 20:57:46
 * @LastEditTime: 2020-06-17 00:10:48
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
    * 定义异步 action 返回 dispatch 发送请求返回数据交给同步action管理数据
    * 定义 reducer 生成新 state 数据
* 在组件中显示数据
  * 在 `onExpandedRowsChange` 回调中定义展开行的方法
  * 展开的时候应该发送请求并更新组件状态,关闭的时候只应该更新组件,不应该发送请求
### 点击'新建'按钮,跳转到添加课程界面并添加数据
* 注意: 使用 `express` 框架时,默认不解析请求体数据 必须使用中间件解析POST\PUT请求的请求体参数
* 实现步骤
  * 点击按钮显示'新建页面',调用路由跳转,跳转到对应的路由组件显示
    ```jsx
      // 定义点击按钮触发跳转的方法
      handleClick = () => {
        // 定义路由跳转到添加课程页面
        this.props.history.push("/edu/subject/add");
      };
    ```
  * 新建组件并在 `config/asyncCompos` 中统一暴露,并在页面设置权限
  * 新建组件是一个`antd` 表单组件,配合工厂函数组件使用,因为antd给工厂函数组件提供了自定义的Hooks,里面有各种操作表单的方法
  * 表单验证,验证成功后提示添加数据成功,之后跳回列表页面查看数据,表单验证由antd来做
    * 表单验证成功之后点击添加触发submit,接着会触发 `antd` 的 `onFinish` 收集数据,并跳转回分类管理组件
      ```jsx
       // 表单验证成功
      const onFinish = async (values) => {
        // values 收集到的表单数据
        // 发送请求添加数据
        const { title, parentId } = values;
        await reqAddSubject(title, parentId);
        // 提示成功添加数据成功
        message.success("添加课程分类数据成功");
        // 跳回数据列表页面查看数据
        history.push("/edu/subject/list");
      };
      ```
  * 使用Hooks定义工厂函数生命周期函数,相当于是 `ComponentDidMount`,初始化加载父级分类选项
  * 在生命周期函数中开局发送请求,请求数据
    ```jsx
    // 工厂函数组件生命周期函数
    useEffect(() => {
      page = 1; // 每次调用初始化生命周期函数加载组件的时候,重置page,组件没有重新加载不会重置,所以下面调用加载更多数据的时候就能++了,但是组件刚加载的时候不论怎样都是第一页数据
      const fetchData = async () => { // 发送请求
        // 第二个参数,代表当前函数只会执行一次,相当于ComponentDidMount
        const items = await getSubjectList(page++, 10);
        if (items.length !== 0) { // 如果有数据
          setSubjects(items); // 更新状态
        }
      };
      fetchData();// 调用函数发请求
    }, [getSubjectList]);
    ```
  * 点击加载更多加载一份全新数据,因为现在默认请求是第一页+10条数据,需要点击加载更多按钮加载更多数据,这个时候就又需要发送请求
    ```jsx
    // 点击加载更多数据
    const loadMore = async () => {
      const items = await getSubjectList(page++, 10);
      // 更新一份全新数据~
      setSubjects([...subjects, ...items]);
    };
    ```
  * 点击返回,调用`<Link />` 组件,回到课程管理组件,不添加数据
    ```jsx
    <Link to="/edu/subject/list">
      <ArrowLeftOutlined />
    </Link>
    ```
### 点击编辑按钮进入更新模式
* `render`方法接收什么数据?
  * 默认是接收包含所有数据的值
  * 也有特殊情况,如果有`dataIndex`,假如`dataIndex`值为`title`,render方法就只接受title的值
  * 步骤:
    * 绑定点击事件传递`render`接收数据`subject`,返回一个事件回调的方式,如果没有dataIndex `subject` 就保存着所有数据的值
    * 定义方法,返回事件回调
    * 判断状态中subjectId有没有值,如果有就说明用户还没有退出编辑模式,此时不能进行其他操作,提示用户并return
    * 更新状态,将subject._id的值给到状态的subjectId
    * render方法中获取状态的值,进行判断,如果点击的id和状态中id相等,就显示input输入框,否则就显示原本的纯文本数据
    * 处于编辑模式,按钮应该切换为确认和取消,同样是在操作列进行判断,状态中id和目标id一致,则进行按钮切换
    * 受控组件收集数据
    * 触发更新或者取消回调
    * 定义Redux,API请求
    * 数据一致/数据为空,不应该发送请求
    * 成功之后退出编辑状态
    * 删除数据,删除数据并不是多组件共享状态,所以不需要使用redux进行管理
    ```jsx
      // 定义点击按钮显示编辑模式事件回调
    showInput = (subject) => {
      // 接收所有已经添加的数据
      // 返回值应该是个函数
      return () => {
        // 此时如果状态中 subjectId 有值,说明用户正处于编辑模式,应该提示用户必须退出编辑才能继续操作
        if (this.state.subjectId) {
          message.warn("退出编辑模式才能继续操作");
          return;
        }
        // 更新状态
        this.setState({
          subjectId: subject._id, //将拿到的对应id给到状态
          subjectTitle: subject.title, // 将对应title给到状态
        });
      };
    };

      // 受控组件收集表单数据
    handleInputChange = (e) => {
      this.setState({
        updateSubjectTitle: e.target.value,
      });
    };
    
      // 输入完成之后点击确认按钮触发的回调
    updateSubject = async () => {
      // 更新回调,进行验证, 如果没有值/相同值的情况不能进行更新
      // 取出状态中对应的id,title,以及更新后的title
      const { subjectId, subjectTitle, updateSubjectTitle } = this.state;
      if (!updateSubjectTitle) {
        // 提示
        message.warn("不能为空哦~");
        return;
      }
      if (subjectTitle === updateSubjectTitle) {
        message.warn("一样干嘛还改");
        return;
      }
      // 更新成功 发送请求
      await this.props.updateSubject(updateSubjectTitle, subjectId);
      // 提示成功
      message.success("成功啦~");
      // 调用退出函数退出编辑模式
      this.cancel();
    };
    ```
  * 点击删除按钮删除分类数据
    * 弹出 `Modal` 层,提示用户要删除的数据信息
    * 触发确定回调之后删除数据
      * 提示用户删除成功
      * 重新请求分页列表
        * 如果删除的数据只有一条,应该跳转到前一页
        ```jsx
         // 删除分类数据
        delSubject = (subject) => {
          // confirm确认,发送请求,更新状态
          return () => {
            Modal.confirm({
              title: (
                <p>
                  确定要删除<span className="text">{subject.title}</span>
                  {""}课程?
                </p>
              ),
              icon: <ExclamationCircleOutlined />,
              onOk: async () => {
                // 点击确定的回调,发送请求更新数据和页面
                await reqDelSubject(subject._id);
                // 删除成功,提示用户
                message.success("删除成功");
                // 请求新的分页数据
                const { current, pageSize } = this.state;
                // 如果删除数据只有一条,应该跳转到前一页,条件是大于1,页数 至少2 ,删除分类是一级分类
                if (
                  current > 1 &&
                  this.props.subjectList.length === 1 &&
                  subject.parentId === "0"
                  // 页数>2 数据只有1 一级菜单
                ) {
                  // 前一页
                  this.getSubjectList(current - 1, pageSize);
                  return;
                }
                // 如果不是,直接更新当前数据
                this.getSubjectList(current, pageSize);
              },
            });
          };
        };
        ```
    * 触发取消回调不进行任何操作,单纯更新状态从而更新页面
    ```jsx
       // 点击取消按钮的时候触发的回调
    cancel = () => {
      // 更新状态就是更新页面,将状态中 id和最新的title为空,顺便更新页面
      this.setState({
        subjectId: "",
        updateSubjectTitle: "",
      });
    };
    ```

### 章节管理组件
* 请求所有课程数据
* 首先查看API,想要获取所有课程数据,得先有讲师数据
* 使用`postman`添加数据
  * 添加讲师数据
  * 添加课程详细信息
  * 定义API --> 所有课程数据
  * 定义异步action获取所有课程数据到同步action
  * 在reducer中定义数据状态
  * 在页面显示
    * search组件
      * antd的form函数组件Hooks
        ```js
        // Form组件提供hooks函数 useForm（只能在工厂函数组件使用，不能在ES6类组件使用）
        // 该函数作用就是提供一个form对象，让我们可以对表单进行各种操作
        const [form] = Form.useForm();
        ```
      * 点击查询课程按钮触发 `antd` 组件的 `onFinish` 回调收集表单数据   
      * 使用收集到的数据发送请求,请求分页列表数据
        ```jsx
          // 表单验证成功后触发的回调函数,发送请求获取课时数据
        const finish = async ({ courseId }) => {
          // 获取章节分页列表数据
          await getChapterList({ page: 1, limit: 10, courseId });
          // 提示用户
          message.success("获取课时数据成功");
        };
        ```
      * 提示用户获取成功
      * 定义重置按钮的回调
        ```js
        // 重置表单
        const resetForm = () => {
          form.resetFields(); // 重置所有,传递数据参数重置指定的数据,不传代表重置所有
        };
        ```
      * 使用redux管理状态,通知list组件更新数据
      * list组件接收章节数据,进行展示
        ```jsx
         const { chapters, id } = this.props; // 接收chapters
        ```
      * 全屏功能 `screenfull库实现局部全屏`
        ```jsx
        // 全屏显示
        screenFull = () => {
          // 通过ref技术获取真实的dom元素
          const dom = this.props.fullscreenRef.current;
          // screenfull库实现局部全屏
          screenfull.toggle(dom); //toggle 切换全屏
          // screenfull.request(dom)  // 显示全屏 不能进行切换
        };
        ```
      * 预览视频功能
        * 视屏列渲染`lesson`数据,点击按钮触发预览回调
        ```js
        // 接收lesson数据
        showVideoModal = (lesson) => {
          // 返回事件回调
          return () => {
            // 更新状态,显示modal框
            this.setState({
              isShowVideoModal: true,
              lesson,
            });
          };
        };
        ```
      * 刷新功能 重新获取分页列表数据发送请求
      ```jsx
        // 刷新功能
        refresh = (id) => {
          return () => {
            // 点击刷新重新发送请求,加载页面
            this.props.getChapterList({
              page: 1,
              limit: 10,
              courseId: id,
            });
            message.success("成功");
            this.setState({});
          };
        };
      ```

### 课程管理组件
* 结构:
  * 整体大组件中有 `search` 组件
* 思路:
  * 在 `search` 组件中请求讲师数据以及分类数据
  * 点击查询按钮在大组件 `list` 中显示分页列表数据
* 步骤:
  * 定义 `search` 组件,`Form`组件,使用 `antd` 工厂函数组件
    ```jsx
    const [form] = Form.useForm();
    // 使用状态hooks,初始化教师列表和分类列表
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);
    ```
  * 请求讲师数据以及分类列表数据
    * 使用 hooks 生命周期函数发送请求
      ```jsx
          // 使用生命周期hooks 发送请求
      useEffect(() => {
        const fetchData = async () => {
          // 请求所有讲师数据,是用Promise.all方法 同时请求
          const [teachers, subjects] = await Promise.all([
            // 请求所有讲师数据
            reqGetAllTeacherList(),
            // 请求所有一级分类数据
            reqGetAllSubjectList(),
          ]);
          // 更新状态
          setTeachers(teachers);
          // 处理并展示subjects数据
          const data = subjects.map((subject) => {
            return {
              value: subject._id, // 选中的值
              label: subject.title, // 显示的名称
              isLeaf: false, // 没有二级列表
            };
          });
          // 更新状态
          setSubjects(data);
        };
        fetchData();
      }, []);
      ```
    * 因为要请求两个数据,可以使用 `Promise.all()` 方法进行优化,同时请求
    * `Cascader` 级联选择
      * 请求分类数据时,可能还会有二级分类列表,这个时候要使用级联选择
      * 点击一级分类如果还有二级分类,要再次请求
        ```jsx
              // 点击一级菜单调用函数 ==> 加载二级菜单数据
        const loadData = async (selectedOptions) => {
          console.log(selectedOptions);
          /* 
            selectedOptions 代表了当前选中的菜单
            当前如果二级菜单 [ {} ] --> 里面的对象保存的是当前点击的一级菜单数据

            如果将来有三级菜单:[ {一级} ,{二级} ]
            当前点击的菜单就是数组的最后一项值

            selectedOptions[selectedOptions.length - 1]

            添加loading属性 页面就会出现加载图标

            .loading = true
          */
          const targetOption = selectedOptions[selectedOptions.length - 1];
          // 添加loading
          targetOption.loading = true;

          // 加载二级菜单数据(传入对应的id)
          const { items } = await reqGetSubSubjectList(targetOption.value);

          // 关闭loading
          targetOption.loading = false;

          // 如果items(二级菜单有值,那么一级菜单就有一个children属性,通过children属性就能获取到二级菜单的数据显示在页面上,如果没有值,就把状态中isLeaf调为true 代表没有二级菜单)
          if (items.length) {
            targetOption.children = items.map((item) => {
              return {
                value: item._id,
                label: item.title,
              };
            });
          } else {
            // 如果items没有值,就说明没有二级菜单
            targetOption.isLeaf = true;
          }

          // 调用工厂函数setState更新页面
          // 只更新数据,页面没有变化
          // setSubjects() 接收的值不能和之前一样 要是一个全新的数据
          setSubjects([...subjects]);
        };
        ```
  * 收集表单数据,点查询按钮向 `List` 组件传递数据, `List` 组件负责显示数据
    ```jsx
     // 收集表单数据
      const onFinish = async (values) => {
        const {
          title,
          teacherId,
          subject = [], // 默认值
        } = values;
        let subjectId, subjectParentId;

        if (subject.length === 1) {
          // 值只有一个，代表是一级分类
          subjectParentId = "0";
          subjectId = subject[0];
        } else if (subject.length === 2) {
          // 值有两个，代表是二级分类
          subjectParentId = subject[0];
          subjectId = subject[1];
        }
        // 发送请求查询数据
        await getCourseList({
          title,
          teacherId,
          page: 1,
          limit: 10,
          subjectId,
          subjectParentId,
        });
        // props 子向父通信,传递函数调用父组件的函数,传递数据
        // 调用父组件方法 给父组件传递数据
        getSearchFormData({ title, teacherId, subjectId, subjectParentId });

        message.success("查询课程分类数据成功~");
      };
    ```
    * `List` 组件,接收分类数据
      * 定义初始化状态,存储子组件传递数据
        ```jsx
        state = {
          searchLoading: false,
          tableLoading: false,
          page: 1, // 页数
          limit: 5, // 每页显示条数
          previewVisible: false,
          previewImage: "",
          searchData: {},
        };
        ```
      * 定义方法接收子组件传递数据
        ```jsx
        getSearchFormData = async ({
          teacherId,
          title,
          subjectId,
          subjectParentId,
        }) => {
          const name = await this.props.getTeacher(teacherId);
          console.log(name);
          this.setState({
            searchData: {
              teacherId,
              title,
              subjectId,
              subjectParentId,
              name,
            },
          });
        ```
      * 显示数据
### 对首页进行布局
  * 可视化数据
    * 在页面上以图形化方式显示数据,让数据栩栩如生,非常美观
  * 箭头指示
    * 使用图标进行箭头指示
      * 上箭头 `<CaretUpOutlined style={{ color: "red" }} />`
      * 下箭头 `<CaretDownOutlined style={{ color: "green" }} />`
    * 面积图
      * antd官方提供的已经不能满足需求,找社区精选组件 `AntV` `https://antv.vision/zh`
      * 需要下载库 `bizcharts`
      * 需要组件 `<AreaChart/>` 面积图
      ```jsx
      // 解构使用
      import { AreaChart } from 'bizcharts';
      function APP() {
        return <AreaChart {...options} />;
      }
      // API文档 https://bizcharts.net/product/BizCharts4/category/77/page/118
      ```
    * 柱状图
      * 组件 `<Chart> <Interval/> <Chart/>`
    * antd日期组件
      * 选择日期范围
      ```jsx
          {/* value:日期 onChange: 日期范围发生变化触发的回调 */}
        <RangePicker value={rangeTime} onChange={this.rangePickerChange} />
      ```
        * value中保存着`moment`对象,存储当前日期和选择日期,当用户点击选择日期范围的时候,定义状态将范围修改到指定值
        ```jsx
        // 定义状态
        state = {
          tabKey: "sales", //初始选中的key
          datePicker: "day", //初始选中按钮状态
          rangeTime: [
            // 传入当前日期和一个格式化的标准
            moment(moment().format(dateFormat), dateFormat),
            moment(moment().format(dateFormat), dateFormat),
          ],
        };


        // 点击tab标签的时候触发的回调,更新状态
        // 应该传入当前被选中的tab的key,也就是activeTabKey传入的状态
        // 再点击是更新状态为当前选中的key就能切换
        handleTabChange = (tabKey) => {
          console.log(tabKey);
          this.setState({
            tabKey, // 更新状态为当前选中的key(ES6对象简写)
          });
        };


        // onChange	日期范围发生变化的回调 ,第一个参数得到的是数组 里面有两个 moment 对象,分别是当前日期和选择日期
        // 第二个得到的是数组里面连个字符串形式的日期 也是当前日期和选中日期
        rangePickerChange = (dates, dateStrings) => {
          // console.log(dates, dateStrings);
          // const { rangeTime } = this.state;

          // console.log(rangeTime);
          // 上面打印看出 dates 和 rangeTime条件符合,直接设置
          this.setState({ rangeTime: dates });
        };


        // 选中右边tab 按钮的时候触发的回调
        // 接收参数 返回回调
        changeDatePicker = (datePicker) => {
          return () => {
            // 获取当前时间
            const time = moment(moment().format(dateFormat));
            let rangeTime = null;

            switch (datePicker) {
              case "year":
                rangeTime = [
                  time, // 当前时间
                  moment(moment().add(1, "y").format(dateFormat), dateFormat), //一年后
                ];
                break;
              // 下面是一样的
              case "mouth":
                rangeTime = [
                  time,
                  moment(moment().add(1, "M").format(dateFormat), dateFormat),
                ];
                break;
              case "week":
                rangeTime = [
                  time,
                  moment(moment().add(7, "d").format(dateFormat), dateFormat),
                ];
                break;
              default:
                rangeTime = [time, time];
                break;
            }
            // 更新的datePicker(当前选中日期范围) 和 rangeTime 状态
            this.setState({ datePicker, rangeTime });
          };
        };


        // 获取状态中的值
        const { tabKey, datePicker, rangeTime } = this.state;
        // 定义一个card右上角将要显示的内容,因为要用到状态,所以要定义在this上
        const extra = (
          <div>
            <Button
              type={datePicker === "day" ? "link" : "text"}
              onClick={this.changeDatePicker("day")}
            今日
        </Button>
          </div>


        // 渲染的组件
          <Card
            style={{ width: "100%", marginBottom: 20 }}
            // 定义状态,便于切换
            activeTabKey={tabKey} // 当前激活页签的 key(被选中的tab)
            tabList={tabList} // tabList左侧显示的内容
            tabBarExtraContent={extra} // tab bar 上额外的元素,也就是card右上角显示区域的内容
            onTabChange={this.handleTabChange}
          >
            {/* 渲染card里面的数据,正好对应的就是当前选中的标签页 */}
            {contentList[tabKey]}
        </Card>
        ```
### 登录功能实现
* 登录方式
  * 账户密码登录
    1. 收集数据
    ```jsx
    1. 使用antd的Form组件表单的功能,检验并收集全部表单数据
      <Form onFinish={finish}></Form>
      <Button htmlType="submit">xxx</Button>
      // finish方法在点击 htmlType属性为submit的按钮时会自动检验所有表单内容并收集数据 --> 成功之后才会返回数据,失败就会报错
    ```
    ```jsx
    2. 使用form实例对象功能,检验并收集部分表单数据
    const [form] = useForm() // 创建 antd 提供的hooks 
    <Form form={form}></Form> // 绑定 form  
    form.validateFields(['xxx']) // 使用
    ```
    2. 发送请求
      * 定义API
      * 看数据情况,分析要不要用 redux (就是看回来的数据是否有多个组件使用)
        * 如果没有多个组件使用这条数据
          * 直接在组件中调用API接口发送请求
        * 如果有多个组件使用
          * 定义 `redux` ,使用 `connect` 容器组件装饰UI组件的方式实现多组件共享数据
    3. 记住密码
      * 就是看要不要进行本地持久化存储
    4. 提示登录成功并跳转到首页
      * 首先看当前组件是不是路由组件(看组件是不是通过Router加载)
      * 如果不是就需要用withRouter高阶组件(装饰器语法)给组件传递路由组件三大属性
  * 手机验证码登录
    1. 发送验证码
       * 检验手机号有没有输入并且合不合法
       * 只有正确的话才能发送请求
       * 切换按钮状态
         * 不能点击:控制按钮的 `disable` 属性,通过定义状态改变
         * 按钮显示倒计时
    2. 倒计时功能:
      * 坑: 定时器中内没有办法一直更新状态,值只能更新一次,页面一直在更新(值没有变化)
        * Hooks 函数不能再定时器和循环中使用,只能生效一次
      * 值不用进行状态的管理,定义变量,通过setState更新状态即可
    3. 输入验证码,点击登录,收集数据
    4. 发送请求,登录,跳转首页