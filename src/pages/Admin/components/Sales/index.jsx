import React, { Component } from "react";
import { Card, Button, DatePicker, List, Avatar } from "antd";
import moment from "moment"; // antd又一个依赖就是moment
import { Chart, Interval, Tooltip } from "bizcharts";
const { RangePicker } = DatePicker;

// Tab左侧数据
const tabList = [
  {
    key: "sales",
    tab: "销售量",
  },
  {
    key: "visits",
    tab: "访问量",
  },
];

// 数据源
const data = [
  { year: "1991", value: 3 },
  { year: "1992", value: 10 },
  { year: "1993", value: 15 },
  { year: "1994", value: 5 },
  { year: "1995", value: 4.9 },
  { year: "1996", value: 10 },
  { year: "1997", value: 4 },
  { year: "1998", value: 9 },
  { year: "1999", value: 13 },
];

const dataList = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 5",
  },
];
// 内容区域
const contentList = {
  sales: (
    <div>
      <div style={{ width: "70%", float: "left", height: "100%" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          销售业绩
        </span>
        <Chart
          height={300}
          autoFit
          data={data}
          interactions={["active-region"]}
          padding={[30, 30, 30, 50]}
        >
          <Interval position="year*value" />
          <Tooltip shared />
        </Chart>
      </div>
      <div style={{ width: "200px", float: "left" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          销售排名
        </span>
        <List
          style={{ height: "100%" }}
          dataSource={dataList}
          renderItem={(item, index) => (
            <List.Item style={{}}>
              <List.Item.Meta
                avatar={<Avatar>{index + 1}</Avatar>}
                title={`${item.title}`}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  ),
  visits: <p>visits content</p>,
};

// 指定日期格式化 -->  https://ant.design/components/date-picker-cn/#API
const dateFormat = "YYYY-MM-DD";
export default class Sales extends Component {
  state = {
    tabKey: "sales", //初始选中的key
    datePicker: "day", //初始选中按钮状态
    rangeTime: [
      // 传入当前日期和一个格式化的标准
      moment(moment().format(dateFormat), dateFormat),
      moment(moment().format(dateFormat), dateFormat),
    ],
  };
  // 点击tab标签的时候触发的回调,更新状态
  // 应该传入当前被选中的tab的key,也就是activeTabKey传入的状态
  // 再点击是更新状态为当前选中的key就能切换
  handleTabChange = (tabKey) => {
    console.log(tabKey);
    this.setState({
      tabKey, // 更新状态为当前选中的key(ES6对象简写)
    });
  };
  // onChange	日期范围发生变化的回调 ,第一个参数得到的是数组 里面有两个 moment 对象,分别是当前日期和选择日期
  // 第二个得到的是数组里面连个字符串形式的日期 也是当前日期和选中日期
  rangePickerChange = (dates, dateStrings) => {
    // console.log(dates, dateStrings);
    // const { rangeTime } = this.state;

    // console.log(rangeTime);
    // 上面打印看出 dates 和 rangeTime条件符合,直接设置
    this.setState({ rangeTime: dates });
  };
  // 选中右边tab 按钮的时候触发的回调
  // 接收参数 返回回调
  changeDatePicker = (datePicker) => {
    return () => {
      // 获取当前时间
      const time = moment(moment().format(dateFormat));
      let rangeTime = null;

      switch (datePicker) {
        case "year":
          rangeTime = [
            time, // 当前时间
            moment(moment().add(1, "y").format(dateFormat), dateFormat), //一年后
          ];
          break;
        // 下面是一样的
        case "mouth":
          rangeTime = [
            time,
            moment(moment().add(1, "M").format(dateFormat), dateFormat),
          ];
          break;
        case "week":
          rangeTime = [
            time,
            moment(moment().add(7, "d").format(dateFormat), dateFormat),
          ];
          break;
        default:
          rangeTime = [time, time];
          break;
      }
      // 更新的datePicker(当前选中日期范围) 和 rangeTime 状态
      this.setState({ datePicker, rangeTime });
    };
  };
  render() {
    // 获取状态中的值
    const { tabKey, datePicker, rangeTime } = this.state;
    // 定义一个card右上角将要显示的内容,因为要用到状态,所以要定义在this上
    const extra = (
      <div>
        <Button
          type={datePicker === "day" ? "link" : "text"}
          onClick={this.changeDatePicker("day")}
        >
          今日
        </Button>
        <Button
          type={datePicker === "week" ? "link" : "text"}
          onClick={this.changeDatePicker("week")}
        >
          本周
        </Button>
        <Button
          type={datePicker === "mouth" ? "link" : "text"}
          onClick={this.changeDatePicker("mouth")}
        >
          本月
        </Button>
        <Button
          type={datePicker === "year" ? "link" : "text"}
          onClick={this.changeDatePicker("year")}
        >
          本年
        </Button>
        {/* value:日期 onChange: 日期范围发生变化触发的回调 */}
        <RangePicker value={rangeTime} onChange={this.rangePickerChange} />
      </div>
    );
    return (
      <Card
        style={{ width: "100%", marginBottom: 20 }}
        // 定义状态,便于切换
        activeTabKey={tabKey} // 当前激活页签的 key(被选中的tab)
        tabList={tabList} // tabList左侧显示的内容
        tabBarExtraContent={extra} // tab bar 上额外的元素,也就是card右上角显示区域的内容
        onTabChange={this.handleTabChange}
      >
        {/* 渲染card里面的数据,正好对应的就是当前选中的标签页 */}
        {contentList[tabKey]}
      </Card>
    );
  }
}
