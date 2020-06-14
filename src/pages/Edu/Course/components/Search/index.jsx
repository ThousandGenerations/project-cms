import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";

// import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { reqGetAllTeacherList } from "@api/edu/teacher";
import { reqGetAllSubjectList, reqGetSubSubjectList } from "@api/edu/subject";
import { getCourseList } from "../../redux";
import { FormattedMessage, useIntl } from "react-intl";
import "./index.less";

const { Option } = Select;

function SearchForm({ getCourseList, getSearchFormData }) {
  const intl = useIntl();
  const [form] = Form.useForm();

  // 使用状态hooks,初始化教师列表和分类列表
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

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

    // 调用父组件方法 给父组件传递数据
    getSearchFormData({ title, teacherId, subjectId, subjectParentId });

    message.success("查询课程分类数据成功~");
  };
  // 重置
  const resetForm = () => {
    form.resetFields();
  };

  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Form.Item
        name="title"
        label={intl.formatMessage({
          id: "title",
        })}
      >
        <Input
          placeholder={intl.formatMessage({
            id: "title",
          })}
          style={{ width: 250, marginRight: 20 }}
        />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id="teacher" />}>
        <Select
          allowClear
          placeholder={<FormattedMessage id="teacher" />}
          style={{ width: 250, marginRight: 20 }}
        >
          {teachers.map((teacher) => {
            return (
              <Option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id="subject" />}>
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={subjects}
          loadData={loadData}
          // onChange={onChange}
          changeOnSelect
          placeholder={intl.formatMessage({
            id: "subject",
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          <FormattedMessage id="searchBtn" />
        </Button>
        <Button onClick={resetForm}>
          <FormattedMessage id="resetBtn" />
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null, { getCourseList })(SearchForm);
