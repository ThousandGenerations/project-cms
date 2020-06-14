/*
 * @Author: your name
 * @Date: 2020-06-08 20:56:00
 * @LastEditTime: 2020-06-14 14:39:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \React-project-cms\src\App.js
 */

import React from "react";
import { Router } from "react-router-dom";
import history from "@utils/history";
import { IntlProvider } from "react-intl";
import { zh, en } from "./locales";

import Layout from "./layouts";
// 引入重置样式（antd已经重置了一部分了）
import "./assets/css/reset.css";

function App() {
  const locale = "zh";
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
