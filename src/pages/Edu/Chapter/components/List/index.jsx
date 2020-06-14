import React, { Component } from "react";
import { Button, Tooltip, Alert, Table, Modal, message } from "antd"; // 使用actd提供的个别组件
import {
  // 使用antd提供的图标
  PlusOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
  DeleteOutlined,
  FormOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { getLessonList, getChapterList } from "../../redux";
import "./index.less"; // 引入样式
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Player from "griffith";
import screenfull from "screenfull";

// 引入章节列表请求
@withRouter // 传递路由组件的三大属性给非路由组件,因为要点击跳转到添加页面
@connect(
  (state) => ({
    chapters: state.chapter.chapters,
    id: state.chapter.chapters.id,
  }),
  {
    getChapterList,
    getLessonList,
  }
) // react-redux语法将属性传递个UI组件
class List extends Component {
  state = {
    expandedRowKeys: [],
    isShowVideoModal: false,
    lesson: {},
    id: this.props.id,
  };
  componentDidMount() {
    console.log(this.state);
  }
  // 展开行发生变化的时候触发的回调函数
  handleExpandedRowsChange = (expandedRowKeys) => {
    const length = expandedRowKeys.length;
    if (length > this.state.expandedRowKeys.length) {
      const lastKey = expandedRowKeys[length - 1];
      this.props.getLessonList(lastKey);
    }
    this.setState({
      expandedRowKeys,
      // id: "5ee3485e301d6d03ac1aa5b9",
    });
  };
  showAddLesson = (chapter) => {
    return () => {
      // 默认情况不是路由组件,已经通过withRouter
      // 要在权限管理给到权限 还要在角色管理添加上去这个权限
      this.props.history.push("/edu/chapter/addlesson", chapter);
    };
  };
  // 预览视频
  showVideoModal = (lesson) => {
    return () => {
      this.setState({
        isShowVideoModal: true,
        lesson,
      });
    };
  };
  // 点击按钮关闭modal
  hidden = (lesson) => {
    this.setState({
      isShowVideoModal: false,
      lesson,
    });
  };
  // 全屏显示
  screenFull = () => {
    // 通过ref技术获取真实的dom元素
    const dom = this.props.fullscreenRef.current;
    // screenfull库实现局部全屏
    screenfull.toggle(dom); //toggle 切换全屏
    // screenfull.request(dom)  // 显示全屏 不能进行切换
  };
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
  render() {
    const { chapters, id } = this.props; // 接收chapters
    const { expandedRowKeys, isShowVideoModal, lesson } = this.state; // 获取expandedRowKeys
    console.log(this.props);
    // this.setState({
    //   id: this.props.id,
    // });
    // 创建列
    const columns = [
      {
        title: "名称",
        dataIndex: "title", // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
        key: "title", // React 需要的 key，如果已经设置了唯一的 dataIndex ，可以忽略这个属性
      },
      {
        title: "是否免费",
        dataIndex: "free",
        key: "free",
        render: (free) => {
          console.log(free);
          return free === undefined ? "" : free ? "是" : "否";
        },
      },
      {
        title: "视频",
        key: "video",
        render: (lesson) => {
          return (
            "video" in lesson && (
              <Tooltip title="预览视频">
                <Button onClick={this.showVideoModal(lesson)}>
                  <EyeOutlined />
                </Button>
              </Tooltip>
            )
          );
        },
      },
      {
        title: "操作",
        key: "action",
        width: 250,
        render: (data) => {
          return (
            <>
              {"list" in data ? null : (
                <Tooltip>
                  <Button
                    type="primary"
                    className="chapter-btn"
                    onClick={this.showAddLesson(data)}
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="更新">
                <Button type="primary">
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除">
                <Button type="danger" className="subject-btn">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    ];
    return (
      <div className="chapter-list">
        <div className="chapter-list-header">
          <h5>课程章节列表</h5>
          <div>
            <Button type="primary">
              <PlusOutlined />
              新增
            </Button>
            <Button type="danger">批量删除</Button>
            <Tooltip title="全屏">
              <FullscreenOutlined onClick={this.screenFull} />
            </Tooltip>
            <Tooltip title="刷新" onClick={this.refresh(id)}>
              <ReloadOutlined />
            </Tooltip>
            <Tooltip title="设置">
              <SettingOutlined />
            </Tooltip>
          </div>
        </div>
        <Alert message="已选择 0 项" type="info" showIcon />
        <Table
          className="chapter-list-table"
          columns={columns} // 决定列头
          expandable={{
            // 内部默认会使用children作为展开的子菜单
            // 也就是说，如果要展开的数据有children属性，才会有展开图标，就会作为子菜单展开~
            // 负责展开行
            // 展开哪些行？[行的key值, 行的key值...]
            // [_id, _id]
            expandedRowKeys,
            // 展开行触发的方法。
            // 将展开的行[1, 2, 3]作为参数传入
            onExpandedRowsChange: this.handleExpandedRowsChange,
          }}
          dataSource={chapters.items} // 决定每一行显示的数据
          rowKey="_id" // 指定key属性的值是_id
          pagination={{
            // current, // 当前页数
            // pageSize, // 每页条数
            total: chapters.total, // 数据总数
            showQuickJumper: true, // 是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            // onChange: this.getSubjectList, // 页码发生变化触发的回调
            // onShowSizeChange: this.getFirstPageSubjectList,
          }}
        />
        <Modal
          title={lesson.title} // 标题
          visible={isShowVideoModal} // 显示&隐藏
          onCancel={this.hidden}
          footer={null}
          centered // 垂直居中
          destroyOnClose={true} // 关闭时销毁子元素
        >
          {/* https://github.com/zhihu/griffith/blob/master/README-zh-Hans.md */}
          <Player
            // id="video"
            // duration={128}
            // 预览图
            cover="http://localhost:3000/static/media/logo.ba1f87ec.png" // 封面图
            sources={{
              hd: {
                play_url: lesson.video,
              },
            }}
          />
        </Modal>
      </div>
    );
  }
}
export default List;
