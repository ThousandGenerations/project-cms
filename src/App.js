/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-15 10:10:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\App.js
 */

import React, { useState } from "react";
import { Router } from "react-router-dom";
import history from "@utils/history";
import { IntlProvider } from "react-intl";
import { zh, en } from "./locales";

import Layout from "./layouts";
// 引入重置样式（antd已经重置了一部分了）
import "./assets/css/reset.css";
import PubSub from "pubsub-js";
function App() {
  const [data, setData] = useState(["zh"]);
  PubSub.subscribe("REACTIVE_DATA", (msg, data) => {
    // console.log(msg, data);
    setData(data);
    console.log(data);
  });
  console.log(data);
  const locale = data;
  const messages = locale === "en" ? en : zh;
  return (
    <Router history={history}>
      <IntlProvider
        locale={locale} // 当前语言环境
        messages={messages} // 加载使用的语言包
      >
        <Layout />
      </IntlProvider>
    </Router>
  );
}

export default App;
