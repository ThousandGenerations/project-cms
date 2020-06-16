import React, { Component } from "react";
import {
  Chart,
  registerShape,
  Geom,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
  Annotation,
} from "bizcharts"; // 数据源

// 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const points = cfg.points;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path: path,
      },
    });
  },
});
export default class SearchRight extends Component {
  // console.log(data);
  state = {
    data: [],
    total: 0,
  };
  componentDidMount() {
    setTimeout(() => {
      const data = [
        {
          type: "分类一",
          value: 27,
        },
        {
          type: "分类二",
          value: 25,
        },
        {
          type: "分类三",
          value: 18,
        },
        {
          type: "分类四",
          value: 15,
        },
        {
          type: "分类五",
          value: 10,
        },
        {
          type: "其它",
          value: 8,
        },
      ];
      this.setState({
        data,
        total: data.reduce((pre, val) => {
          return pre + val.value;
        }, 0),
      });
    }, 1000);
  }
  render() {
    const { total, data } = this.state;
    return (
      <Chart
        data={data}
        height={500}
        autoFit
      >
        <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
        <Axis visible={false} />
        <Tooltip showTitle={false} />
        <Interval
          adjust="stack"
          position="value"
          color="type"
          shape="sliceShape"
        />
        <Interaction type="element-single-selected" />
        <Annotation.Text
          position={["50%", "45%"]}
          content="销售量"
          style={{
            lineHeight: "240px",
            fontSize: "30",
            fill: "#262626",
            textAlign: "center",
          }}
        />
        <Annotation.Text
          position={["50%", "55%"]}
          content={total}
          style={{
            lineHeight: "240px",
            fontSize: "30",
            fill: "#262626",
            textAlign: "center",
          }}
        />
      </Chart>
    );
  }
}
