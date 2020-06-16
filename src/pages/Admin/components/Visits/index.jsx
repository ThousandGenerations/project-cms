import React from "react";
import { Row, Col, Progress } from "antd";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { AreaChart, Chart, Interval } from "bizcharts";
import Card from "@comps/Card";

import "./index.less";
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

// 柱状图数据源
const barData = [
  {
    type: "家具家电",
    sales: 38,
  },
  {
    type: "粮油副食",
    sales: 50,
  },
  {
    type: "生鲜水果",
    sales: 50,
  },
  {
    type: "美容洗护",
    sales: 45,
  },
  {
    type: "母婴用品",
    sales: 48,
  },
  {
    type: "进口食品",
    sales: 38,
  },
  {
    type: "食品饮料",
    sales: 38,
  },
  {
    type: "家庭清洁",
    sales: 38,
  },
  {
    type: "移动电脑",
    sales: 28,
  },
  {
    type: "品牌手机",
    sales: 50,
  },
];
// 样式配置项
const layout = {
  xs: 24,
  xm: 12,
  sm: 12,
  lg: 6,
};
export default function Visits() {
  return (
    <Row gutter={16}>
      <Col {...layout}>
        <Card
          title="总销售额"
          number="￥123456"
          content={
            <>
              <span>
                周同比 12% &nbsp;
                {/* 图标 箭头向上 */}
                <CaretUpOutlined style={{ color: "red" }} />
              </span>
              <span>
                {/* 箭头向下 */}
                周同比 10% &nbsp;
                <CaretDownOutlined style={{ color: "green" }} />
              </span>
            </>
          }
          footer="日销售额 ￥123456"
        ></Card>
      </Col>
      <Col {...layout}>
        <Card
          title="访问量"
          number="222222"
          content={
            <div className="charts-container">
              {/* https://bizcharts.net/product/BizCharts4/category/77/page/118 */}
              <AreaChart
                data={data} // 数据
                forceFit // 自适应宽高
                xField="year" // x轴加载数据的字段
                yField="value" // y轴加载数据的字段
                color="pink" // 颜色
                xAxis={{ visible: false }} // 隐藏x轴
                yAxis={{ visible: false }} // 隐藏y轴
              />
            </div>
          }
          footer="日销售额 ￥12423"
        ></Card>
      </Col>
      <Col {...layout}>
        <Card
          title="支付笔数"
          number="333333"
          content={
            <div>
              <Chart data={barData} autoFit height={30} pure>
                <Interval position="type*sales" />
              </Chart>
            </div>
          }
          footer="转换率60%"
        ></Card>
      </Col>
      <Col {...layout}>
        <Card
          title="运营结束"
          number="444444"
          content={
            <Progress
              strokeColor={{
                // 渐变颜色
                "0%": "#108ee9",
                "100%": "#1DA57A",
              }}
              percent={66.6}
            />
          }
          footer={
            <>
              <span>
                周同比 12% &nbsp;
                {/* 图标 箭头向上 */}
                <CaretUpOutlined style={{ color: "red" }} />
              </span>
              <span>
                {/* 箭头向下 */}
                周同比 10% &nbsp;
                <CaretDownOutlined style={{ color: "green" }} />
              </span>
            </>
          }
        ></Card>
      </Col>
    </Row>
  );
}
