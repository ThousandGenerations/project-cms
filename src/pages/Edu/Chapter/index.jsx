import React, { Component } from "react";
import Search from "./components/Search";
import List from "./components/List";
class Chapter extends Component {
  // 利用ref技术获取真实dom元素,获取最外层元素传递给list组件
  fullscreenRef = React.createRef();
  render() {
    return (
      <div ref={this.fullscreenRef} style={{ background: "#f5f5f5" }}>
        <Search />
        <List fullscreenRef={this.fullscreenRef} />
      </div>
    );
  }
}

export default Chapter;
