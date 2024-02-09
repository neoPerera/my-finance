import { Card, Col, Row, Space } from "antd";
import * as React from "react";
import { Liquid, Pie, Sankey } from "@antv/g2plot";

function DashBoard() {
  const data = {
    pie: [
      { type: "Income", value: 27 },
      { type: "Expense", value: 25 },
    ],
    sankey: [
      { source1: "INC01", target: "Income", value: 100 },
      { source1: "INC02", target: "Income", value: 10 },
      { source1: "Income", target: "EXP01", value: 20 },
    ],
  };

  React.useEffect(() => {
    const chart = new Pie("container", {
      appendPadding: 10,
      data: data.pie,
      angleField: "value",
      colorField: "type",
      radius: 0.9,
      label: {
        type: "inner",
        offset: "-30%",
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: "center",
        },
      },
      interactions: [{ type: "element-active" }],
    });

    const chart2 = new Sankey("container2", {
      data: data.sankey,
      sourceField: "source1",
      targetField: "target",
      weightField: "value",
      nodeWidthRatio: 0.018,
      nodePaddingRatio: 0.03,
      nodeState: {
        active: {
          style: {
            linewidth: 1.5,
          },
        },
      },
      tooltip: { showTitle: true },
    });

    const chart3 = new Liquid("container3", {
      percent: 0.25,
      outline: {
        border: 4,
        distance: 8,
      },
      wave: {
        length: 100,
      },
    });

    chart.render();
    chart2.render();
    chart3.render();
  }, [data]);

  return (
    <>
      {/* Uncomment and use Layout if needed */}
      {/* <Layout> */}
      <Row gutter={[16, 16]}>
        <Col>
          <Card style={{ width: 300 }}>
            <div id="container"></div>
          </Card>
        </Col>
        <Space />
        <Col>
          <Card>
            <div id="container2"></div>
          </Card>
          {/* </Layout> */}
        </Col>
        <Col>
          <Card>
            <div id="container3"></div>
          </Card>
          {/* </Layout> */}
        </Col>
      </Row>
    </>
  );
}

export default DashBoard;
