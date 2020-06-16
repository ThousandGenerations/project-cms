import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Tabs, Row, Col, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.less";
import { resolveOnChange } from "antd/lib/input/Input";
import { reqSendCode } from "@api/acl/oauth";
import { login, mobileLogin } from "@redux/actions/login";
const { TabPane } = Tabs;
// 定义密码格式验证规则
const reg = /^[a-zA-Z0-9_]+$/;
// 定义表单验证规则
const rules = [
  {
    required: true, // 必须输入数据
  },
  {
    // 输入最大字符限制
    max: 15,
    message: "输入的长度不能超过15为",
  },
  {
    // 输入最小字符限制
    min: 4,
    message: "输入的最小长度不能小于4位",
  },
  {
    // 输入字符格式限制
    pattern: /^[a-zA-Z0-9_]+$/, // 正则限制
    message: "输入的内容只能包含数字,字母,下划线",
  },
];

// 定义倒计时初始值
let countingDownTime = 60;
function LoginForm({ login, mobileLogin, history }) {
  // 因为两个表单验证规则有冲突,所以使用这种单独定义校验规则
  // const validator = (rule, value) => {
  //   return new Promise((resolve, reject) => {
  //     // rule 里面保存字段名 value 保存输入的值
  //     if (!value) {
  //       // 如果没有输入值
  //       return reject("请输入值");
  //     }
  //     // 判断输入的值得长度
  //     if (value.length > 15) {
  //       return reject("长度不能超过15个字符");
  //     }
  //     if (value.length < 4) {
  //       return reject("长度不能小于4个字符");
  //     }
  //     if (!reg.test(value)) {
  //       return reject("只能包含数字,字母下划线");
  //     }
  //     // 如果都验证通过,就返回成功的promise
  //     resolve();
  //   });
  // };
  // Form表单提供form对象,对表单进行更加细致的操作
  // 定义了form的hooks记得给form表单绑定,不然是没有用的
  const [form] = Form.useForm();
  // 定义activeKey状态(当前激活tab面板的key)
  const [activeKey, setActiveKey] = useState("user");
  // 是否已经发送验证码的标识(初始时没有发送验证码)
  const [isSendCode, setIsSendCode] = useState(false);
  // 更新倒计时的方法,这里需要注意,不能在定时器中定义hooks,所以这里只更新页面,不需要数据,数据定义才外面就行
  const [, setCountingDownTime] = useState(0);
  // 切换面板的回调(点击tab栏进行切换时触发)
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  // 点击发送验证码触发
  const sendCode = () => {
    // 判断用户有没有输入合法的手机号
    // 手动触发表单的验证规则
    form.validateFields(["mobile"]).then(async ({ mobile }) => {
      // 发送请求，获取验证码~
      if (!(await reqSendCode(mobile))) return;
      // 发送成功~
      setIsSendCode(true); // 代表已经发送过验证码
      countingDown(); // 调用倒计时方法
      message.success("验证码发送成功");
    });
  };

  // 点击登录按钮触发的方法
  const finish = (values) => {
    // 如果状态中 activeKey 为user(当前tab是账户密码登录)
    if (activeKey === "user") {
      form
        // 验证账户名密码登录方式
        .validateFields(["username", "password", "remember"])
        .then(async (values) => {
          // 将用户名密码和记住密码的value取出
          const { username, password, remember } = values;
          // 发送请求
          const token = await login(username, password);
          // 记住密码或者不记住
          if (remember) {
            // 如果用户选择记住密码,那么就进行本地持久化存储
            window.localStorage.setItem("USER_TOKEN", token);
          }
          // 返回首页
          history.replace("/");
        });
      return;
    }
    // 验证手机号登录方式
    form.validateFields(["mobile", "code", "remember"]).then(async (values) => {
      // 获取手机号和验证码以及记住密码
      const { mobile, code, remember } = values;
      // 请求
      const token = await mobileLogin(mobile, code);
      // 请求失败会自动报错(axios二次封装拦截器)
      if (remember) {
        // 如果是记住密码,同样进行本地化持久存储
        window.localStorage.setItem("USER_TOKEN", token);
      }
      // 登陆成功跳转
      history.replace("/");
    });
  };
  // 定义验证码倒计时方法
  const countingDown = () => {
    // 如果倒计时(定时器)定义在状态,hooks的状态内部会进行缓存,不会有效果
    const timer = setInterval(() => {
      // 更新倒计时
      countingDownTime--;
      // 判断如果定义的时间到0
      if (countingDownTime <= 0) {
        // 清除定时器
        clearInterval(timer);
        // 重置倒计时的时间
        countingDownTime = 60;
        // 设置不能点击获取验证码,改为倒计时界面
        setIsSendCode(false);
        return;
      }
      // setCountingDownTime目的为了重新渲染组件，数据更新不更新无所谓
      setCountingDownTime(countingDownTime);
    }, 1000);
  };
  // 定义公共校验规则
  const validateMessages = {
    required: "请输入${name}!",
  };
  return (
    <Form
      form={form}
      name="normal_login"
      className="login-form"
      // onFinish={finish}  使用onFinish会检验所有表单这样会有问题,因为Tabs会有两个表单
      initialValues={{
        remember: "checked",
      }}
      // 公共验证规则
      validateMessages={validateMessages}
    >
      <Tabs activeKey={activeKey} onChange={handleTabChange}>
        <TabPane tab="账户密码登录" key="user">
          <Form.Item name="username" rules={rules}>
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item name="password" rules={rules}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
        </TabPane>
        <TabPane tab="手机号登录" key="mobile">
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/,
                message: "请输入正确的手机号",
              },
            ]}
          >
            <Input prefix={<MobileOutlined />} placeholder="手机号" />
          </Form.Item>
          <Row justify="space-between">
            <Col>
              <Form.Item
                name="code"
                // 表单校验规则
                rules={[
                  {
                    required: true,
                    message: "请输入验证码",
                  },
                  {
                    pattern: /^[0-9]{6}$/,
                    message: "请输入正确的验证码",
                  },
                ]}
              >
                <Input placeholder="验证码" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button onClick={sendCode} disabled={isSendCode}>
                  {isSendCode
                    ? `${countingDownTime}秒后可重发`
                    : "点击发送验证码"}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
          style={{ float: "left" }}
        >
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item style={{ float: "right" }}>
          <Button type="link">忘记密码</Button>
        </Form.Item>
      </Form.Item>

      <Form.Item>
        {/* 点击登录按钮触发事件方法 */}
        <Button
          type="primary"
          onClick={finish}
          style={{ width: "100%", marginBottom: "10px", marginTop: "0" }}
        >
          登录
        </Button>
        {/* 第三方登录方式 */}
        <Form.Item style={{ float: "left" }}>
          <div>
            <span>其他登录方式</span>
            <GithubOutlined className="icons" />
            <WechatOutlined className="icons" />
            <QqOutlined className="icons" />
          </div>
        </Form.Item>
        <Button type="link" style={{ float: "right", padding: "0" }}>
          注册
        </Button>
      </Form.Item>
    </Form>
  );
}

// export default LoginForm;

// 使用withRouter让组件拥有路由组件三大属性
export default withRouter(connect(null, { login, mobileLogin })(LoginForm));
