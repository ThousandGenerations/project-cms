import React, { Component } from "react";
import Visits from "./components/Visits";
import Sales from "./components/Sales";
import SearchRight from "./components/SearchRight";
import Static from "./components/Static";
export default class Admin extends Component {
  render() {
    return (
      <div>
        <Visits />
        <Sales />
        <SearchRight />
        <Static />
      </div>
    );
  }
}
