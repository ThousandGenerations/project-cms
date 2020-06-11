import React, { Component } from "react";
// 使用antd
import { Button, Table, Tooltip, Input, message, Modal } from "antd";

// 使用antd字体图标
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
// 获取请求函数
// import { reqGetSubjectList } from '@api/edu/subject'
import { getSubjectList, getSubSubjectList, updateSubject } from "./redux";
import { reqDelSubject } from "@api/edu/subject";
// 引入less
import "./index.less";

// 装饰器语法 传递数据和方法
@connect(
  (state) => ({
    subjectList: state.subjectList,
  }),
  {
    // 更新状态数据的方法
    getSubjectList,
    getSubSubjectList,
    updateSubject,
  }
)
class Subject extends Component {
  // 定义初始状态
  state = {
    current: 1, // 当前初始页数
    pageSize: 10, // 当前每页条数
    updateSubjectTitle: "", // 初始化更新分类标题的数据收集
    subjectTitle: "", // 要更新的分类的标题,点击编辑按钮的时候要在input框中显示
    subjectId: "", // 要更新的分类的id,点击编辑(添加)按钮的时候更新id,进行判断,一致就显示input
    expandedRowKeys: [], // 展开项
  };
  // 在componentDidMount()生命周期函数中发送请求
  componentDidMount() {
    // 一上来应该请求第一页数据 并且指定默认每页显示数量
    console.log(this.state);
    this.props.getSubjectList(1, 10);
  }
  // 解决在第二页切换每页数量时数据显示不正确的问题
  // 指定页码
  getFirstPageSubjectList = (page, limit) => {
    this.props.getSubjectList(1, limit);
  };
  // 获取菜单数据列表
  getSubjectList = (page, limit) => {
    this.setState({
      current: page,
      pageSize: limit,
    });
    return this.props.getSubjectList(page, limit);
  };
  // 点击展开以及菜单显示二级菜单
  handleExpandedRowsChange = (expandedRowKeys) => {
    // console.log("handleExpandedRowsChange", expandedRowKeys);
    // 定义变量保存数组长度
    const length = expandedRowKeys.length;
    // 如果最新的长度大于之前的长度 就是展开
    if (length > this.state.expandedRowKeys.length) {
      // 说明是展开
      const lastKey = expandedRowKeys[length - 1]; // 获取数组中最后一个数据 就是当前展开的二级菜单对应的id
      // 发送请求
      this.props.getSubSubjectList(lastKey);
    }
    // 更新state 不是展开的话也要更新页面 但是不发请求
    this.setState({
      expandedRowKeys,
    });
  };
  // 定义点击按钮触发跳转的方法
  handleClick = () => {
    // 定义路由跳转到添加课程页面
    this.props.history.push("/edu/subject/add");
  };

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

  // 受控组件收集标配单数据
  handleInputChange = (e) => {
    this.setState({
      updateSubjectTitle: e.target.value,
    });
  };
  // 输入完成之后的更新回调
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
  // 取消按钮
  cancel = () => {
    // 更新状态就是更新页面,将状态中 id和最新的title为空,顺便更新页面
    this.setState({
      subjectId: "",
      updateSubjectTitle: "",
    });
  };
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
          // 如果删除数据只有一条,应该跳转到第一页,条件是大于1,页数 至少2 ,删除分类是一级分类
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
  render() {
    const { subjectList, getSubjectList } = this.props;
    const { expandedRowKeys } = this.state;

    const columns = [
      {
        // 表头显示的内容
        title: "分类名称",
        // 指定唯一的key属性
        key: "title",
        render: (subject) => {
          // console.log(subject);
          // 从state得到按钮要更新的目标的分类id
          const { subjectId } = this.state;
          // 得到当前数据的id
          const id = subject._id;
          // 进行对比,一致就要显示input
          if (id === subjectId) {
            // 显示input
            return (
              <Input
                className="subject-input"
                defaultValue={subject.title}
                onChange={this.handleInputChange}
              />
            );
          }
          // 否则显示纯文本
          return <span>{subject.title}</span>;
        },
      },
      {
        title: "操作",
        key: "action",
        width: 200,
        // 默认情况下，渲染的内容是纯文本, 如果想渲染成其他方案（按钮）需要用render方法指定
        // render方法接收一个参数,默认包含所有数据的值,特殊情况主要看dataIndex,如果dataIndex是title,就只能接收title的值
        render: (subject) => {
          const { subjectId } = this.state;
          // 得到当前渲染的目标id
          const id = subject._id;
          // console.log(subject);
          // 进行判断,相等就切换按钮
          if (id === subjectId) {
            // 切换按钮
            return (
              <>
                {/* 点击按钮进行更新数据或者取消 */}
                <Button type="primary" onClick={this.updateSubject}>
                  确认
                </Button>
                <Button className="subject-btn" onClick={this.cancel}>
                  取消
                </Button>
              </>
            );
          } else {
            // 不切换
            return (
              // 获取点击按钮要更新的目标id
              <>
                {/*使用Tooltip进行鼠标移除文本提示以及绑定点击事件监听进入input框编辑模式 */}
                <Tooltip title="更新">
                  {/* 函数返回事件回调的方式,将subject传过去 */}
                  <Button type="primary" onClick={this.showInput(subject)}>
                    <FormOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    type="danger"
                    className="subject-btn"
                    onClick={this.delSubject(subject)}
                  >
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
              </>
            );
          }
        },
      },
    ];
    return (
      <div className="subject">
        <Button
          type="primary"
          className="subject-btn"
          onClick={this.handleClick}
        >
          <PlusOutlined />
          新建
        </Button>
        <Table
          columns={columns} // 决定列头
          expandable={{
            expandedRowKeys, // 展开的行控制属性
            onExpandedRowsChange: this.handleExpandedRowsChange, // 展开行的时候触发的方法 ,会将展开的行添加到数组中
          }}
          dataSource={subjectList.items} // 决定每一行显示的数据
          rowKey="_id" // 指定key属性的值是_id
          pagination={{
            total: subjectList.total, // 数据总数
            showQuickJumper: true, // 是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            onChange: getSubjectList, // 页码发生变化触发的回调
            onShowSizeChange: this.getFirstPageSubjectList, // 每页数量发生变化触发的回调
          }}
        />
      </div>
    );
  }
}
export default Subject;
