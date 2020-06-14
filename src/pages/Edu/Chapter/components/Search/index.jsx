import React, { useEffect } from "react";
import { Form, Select, Button, message } from "antd";
import { connect } from "react-redux";
import "./index.less";
// 引入reducer
import { getAllCourseList, getChapterList } from "../../redux";

const { Option } = Select;

function Search({ getAllCourseList, allCourseList, getChapterList }) {
  // antd 的 Form 组件给我们提供了hooks函数 useForm (只能在工厂函数中使用),这个钩子提供了Form对象,可以对表单进行各种操作

  // 使用from hooks
  const [form] = Form.useForm();
  // 使用useEffect发送请求(ComponentDidMount)
  useEffect(() => {
    // console.log(getAllCourseList());
    getAllCourseList();
  }, [getAllCourseList]);
  // 表单验证成功后触发的回调函数,发送请求获取课时数据
  const finish = async ({ courseId }) => {
    console.log(courseId);
    await getChapterList({ page: 1, limit: 10, courseId });
    message.success("获取课时数据成功");
  };
  // 重置表单
  const resetForm = () => {
    form.resetFields(); // 重置所有,传递数据参数重置指定的数据
  };
  return (
    <Form
      layout="inline"
      className="chapter-search"
      form={form}
      onFinish={finish}
    >
      <Form.Item
        label="选择课程"
        name="courseId"
        rules={[{ required: true, message: "请选择课程！" }]}
      >
        <Select placeholder="请选择课程" className="chapter-search-select">
          {console.log(allCourseList)}
          {allCourseList.map((course) => {
            return (
              <Option key={course._id} value={course._ids}>
                {course.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="search_margin">
          查询课程章节
        </Button>
        <Button className="subject-btn" onClick={resetForm}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  (state) => ({
    allCourseList: state.chapter.allCourseList,
  }),
  {
    getAllCourseList,
    getChapterList,
  }
)(Search);
