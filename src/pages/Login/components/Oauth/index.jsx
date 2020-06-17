import React, { Component } from "react";
import { connect } from "react-redux";
import { loginSync } from "@redux/actions/login";

@connect(null, { loginSync })
class Oauth extends Component {
  // 已经注册用户,返回token token位于地址栏的query参数
  // 当前组件是任何用户都能访问,所以添加到 config/routes常量路由中
  // 在组件加载后获取token进行登录
  componentDidMount() {
    // 获取query参数中的token --> 相当于就是登陆成功的意思
    const token = this.props.location.search.split("=")[1];
    // 保存在redux中
    this.props.loginSync(token);
    // 保存在本地
    localStorage.setItem("USER_TOKEN", token);
    // 跳转到首页
    this.props.history.replace("/");
  }
  render() {
    return <div>'登陆中'</div>;
  }
}

export default Oauth;
