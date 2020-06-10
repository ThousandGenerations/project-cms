import React, { Component } from "react";
// 使用antd
import { Button, Table } from "antd";

// 使用antd字体图标
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
// 获取请求函数
// import { reqGetSubjectList } from '@api/edu/subject'
import { getSubjectList, getSubSubjectList } from "./redux";

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
  }
)
class Subject extends Component {
  // 定义初始状态
  state = {
    expandedRowKeys: [], // 展开项
  };
  // 在componentDidMount()生命周期函数中发送请求
  componentDidMount() {
    // 一上来应该请求第一页数据 并且指定默认每页显示数量
    console.log(this.state);
    this.props.getSubjectList(1, 10);
  }
  handleExpandedRowsChange = (expandedRowKeys) => {
    console.log("handleExpandedRowsChange", expandedRowKeys);
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
  render() {
    const { subjectList, getSubjectList } = this.props;
    const { expandedRowKeys } = this.state;

    const columns = [
      {
        // 表头显示的内容
        title: "分类名称",
        dataIndex: "title",
        // 指定唯一的key属性
        key: "title",
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
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
            onShowSizeChange: getSubjectList, // 每页数量发生变化触发的回调
          }}
        />
      </div>
    );
  }
}
export default Subject;
