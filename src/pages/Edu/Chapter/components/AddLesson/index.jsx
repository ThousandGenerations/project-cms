import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, PageHeader, Form, Button, Input, Switch, message } from "antd";
import Upload from "@comps/Upload";
import { reqAddLesson } from "@api/edu/lesson";
import "./index.less";

/* 
    添加组件流程
      创建组件
      暴露/asyncComp
      给权限
      角色管理添加
*/
// 表单的布局属性
const layout = {
  labelCol: { span: 2 }, // label文字所占宽度比例
  wrapperCol: { span: 5 }, // 右边Input所占宽度比例
};
export default function AddLesson({ location, history }) {
  // Hooks定义状态
  const [subjects, setSubjects] = useState([]);
  // 表单验证成功触发的回调函数,传递收集到的数据values(自动收集)
  const onFinish = async (values) => {
    // console.log(values);
    // 拿到对应的章节id
    const chapterId = location.state._id;
    // 请求
    await reqAddLesson({ ...values, chapterId });
    // 添加成功,提示用户
    message.success("添加成功");
    // 跳转回列表
    history.push("edu/chapter/list");
  };
  const onBack = () => {
    // 跳转回列表
    history.push("edu/chapter/list");
  };

  return (
    <Card
      title={
        // 页头
        <PageHeader
          className="add-lesson-header"
          // 点击返回
          onBack={onBack}
          // 标题
          title="新增课时"
          // subTitle="This is a subtitle"
        />
      }
    >
      {/* 提交表单且数据验证成功后回调事件 */}
      <Form {...layout} onFinish={onFinish} initialValues={{ free: true }}>
        <Form.Item
          label="课时名称"
          name="title"
          rules={[{ required: true, message: "请输入课时名称~" }]} // 表单验证
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="是否免费"
          name="free"
          /* 
          被设置了 name 属性的 Form.Item 包装的控件，表单控件会自动添加 value（或 valuePropName 指定的其他属性） onChange（或 trigger 指定的其他属性），数据同步将被 Form 接管，这会导致以下结果：

你不再需要也不应该用 onChange 来做数据收集同步（你可以使用 Form 的 onValuesChange），但还是可以继续监听 onChange 事件。

你不能用控件的 value 或 defaultValue 等属性来设置表单域的值，默认值可以用 Form 里的 initialValues 来设置。注意 initialValues 不能被 setState 动态更新，你需要用 setFieldsValue 来更新。

你不应该用 setState，可以使用 form.setFieldsValue 来动态改变表单值。
          
          */
          // name属性相当于 onChange事件 当form内数据发生改变的时候
          // rules={[{ required: true, message: "请选择父级分类" }]}
          // Form表单默认会接管组件value属性
          // 但是Switch组件不要value，需要的是checked
          valuePropName="checked"
        >
          {/* defaultChecked 默认选中 */}
          <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
        </Form.Item>

        <Form.Item
          name="video"
          rules={[{ required: true, message: "请上传视频" }]}
        >
          <Upload />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="add-lesson-btn">
            添加
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
