import {
  Card,
  Col,
  Flex,
  Row,
  Skeleton,
  Space,
  Spin,
  Statistic,
  Table,
  message,
} from "antd";
import * as React from "react";
import { Liquid, Pie, Sankey } from "@antv/g2plot";
import { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import Axios from "axios";

function DashBoard() {
  // Use React state to manage the chart instance

  const [spinning, setSpinning] = React.useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [chartData, setChartData] = React.useState({
    chart1: [],
    chart2: [],
    chart3: [],
    chart4: [[], 0],
    chartExpenses: [],
    chartIncomes: []
  });
  const formatter = (value) => <CountUp end={value} separator="," />;
  const data = {
    transTable: {
      columns: [
        // {
        //   title: "Key",
        //   dataIndex: "key",
        //   key: "Key",
        // },
        {
          title: "Account",
          dataIndex: "account",
          key: "account",
        },
        {
          title: "Reason",
          dataIndex: "name",
          key: "age",
        },
        {
          title: "Amount",
          dataIndex: "int_amount_char",
          key: "amount",
        },
      ],
    },
  };

  useEffect(() => {
    // if (isMounted.current) {
    // const swalInstance = Swal.fire({
    //   title: "Loading",
    //   timerProgressBar: true,
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });
    const fetchData = async () => {
      setSpinning(true);
      try {
        console.log(window.env?.REACT_APP_API_URL);
        const response = await Axios.get(
          `${window.env?.REACT_APP_API_URL}api/dashboard`
        );

        console.log("income List Data:", response.data);

        const newData = response.data;

        // Update the state with the new data
        setChartData({
          chart1: newData.chart1[0] || [],
          chart2: newData.chart2[0] || [],
          chart3: newData.chart3[0] || [],
          chart4: newData.chart4 || [],
          chartExpenses: newData.chartExpenses[0] || [],
          chartIncomes: newData.chartIncomes[0] || []
        });
        console.log(newData);
        // if (swalInstance) {
        //   swalInstance.close(); // Close the SweetAlert2 modal when the component unmounts
        // }
        setSpinning(false);
      } catch (error) {
        setSpinning(false);
        messageApi.open({
          type: "error",
          content: `${error}`,
        });
        console.error("Error fetching income list:", error);
      }
    };

    //   isMounted.current = false;
    // }
    fetchData();
  }, []);

  return (
    <>
      {spinning ? (
        <Skeleton active />
      ) : (
        <>
          {/* Uncomment and use Layout if needed */}
          {/* <Layout> */}
          {contextHolder}
          {/* <Spin spinning={spinning} fullscreen /> */}
          <Flex wrap="wrap" gap="middle">
            {/* <Row> */}
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Account Balance">
                {/* {chartData.chart4.length > 0 && (
                  <Statistic
                    title="Account Balance (LKR)"
                    value={chartData.chart4[1]}
                    precision={2}
                    formatter={formatter}
                  />
                )} */}
                {chartData.chart4[1].length > 0 && (
                  <>
                    {chartData.chart4[1].map((item) => (
                      <Statistic
                        key={item.account_name} // Assuming account_name is a unique identifier
                        title={`${item.account_name} Balance (LKR)`} // Corrected title syntax
                        value={item.account_balance}
                        precision={2}
                        formatter={formatter}
                      />
                    ))}
                  </>
                )}
              </Card>
              {/* </Layout> */}
            </Col>
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Account Incomes">

                {chartData.chartIncomes.length > 0 && (
                  <>
                    {chartData.chartIncomes.map((item) => (
                      <Statistic
                        key={item.type} // Assuming account_name is a unique identifier
                        title={`${item.type} Incomes (LKR)`} // Corrected title syntax
                        value={item.value}
                        precision={2}
                        formatter={formatter}
                      />
                    ))}
                  </>
                )}
              </Card>
              {/* </Layout> */}
            </Col>
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Account Expenses">

                {chartData.chartExpenses.length > 0 && (
                  <>
                    {chartData.chartExpenses.map((item) => (
                      <Statistic
                        key={item.type} // Assuming account_name is a unique identifier
                        title={`${item.type} Expenses (LKR)`} // Corrected title syntax
                        value={item.value}
                        precision={2}
                        formatter={formatter}
                      />
                    ))}
                  </>
                )}
              </Card>
              {/* </Layout> */}
            </Col>
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Expense Pie Chart">
                {chartData.chart1.length > 0 && (
                  <PieChart data={chartData.chart1} />
                )}
              </Card>
            </Col>
            <Space />
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Transaction Flow">
                {chartData.chart2.length > 0 && (
                  <SankeyChart data={chartData.chart2} />
                )}
              </Card>
            </Col>
            <Col xs={20} sm={12} md={8} lg={6} xl={4}>
              <Card title="Cash account">
                {chartData.chart3.length > 0 && (
                  <LiquidChart data={chartData.chart3} />
                )}
              </Card>
              {/* </Layout> */}
            </Col>
            <Col xs={20} sm={12} md={8} lg={6} xl={7}>
              <Card title="Transactions">
                {chartData.chart4[0].length > 0 && (
                  <Table
                    size="small"
                    scroll={{
                      x: 500,
                      // y: 400,
                    }}
                    dataSource={chartData.chart4[0]}
                    columns={data.transTable.columns}
                    pagination={{pageSize: 10}}
                  />
                )}
              </Card>
              {/* </Layout> */}
            </Col>
            {/* </Row> */}
          </Flex>
        </>
      )}
    </>
  );
}

// Chart Components
const PieChart = ({ data }) => {
  const [chartInstance, setChartInstance] = React.useState(null);

  React.useEffect(() => {
    if (!chartInstance) {
      const chart = new Pie("container", {
        appendPadding: 10,
        data: data,
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

      chart.render();
      setChartInstance(chart);
      // Cleanup on unmount
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [chartInstance]);
  // Your chart logic here
  return <div id="container"></div>;
};

const SankeyChart = ({ data }) => {
  const [chartInstance, setChartInstance] = React.useState(null);

  React.useEffect(() => {
    if (!chartInstance) {
      const chart = new Sankey("container2", {
        data: data,
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

      chart.render();
      setChartInstance(chart);
      // Cleanup on unmount
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [chartInstance]);
  // Your chart logic here
  return <div id="container2"></div>;
};

const LiquidChart = ({ data }) => {
  const [chartInstance, setChartInstance] = React.useState(null);
  // const inc = Math.round(data[1]?.value || 0);
  // const exp = Math.round(data[0]?.value || 0);
  let inc = 0;
  let exp = 0;

  data.forEach((item) => {
    if (item.type === "INC") {
      inc += item.value;
    } else if (item.type === "EXP") {
      exp += item.value;
    }
  });

  const val = (inc - exp) / inc;
  console.log(
    `Percentage=>${val};Income==>${inc};expence==>${exp};data==>${data}`
  );
  React.useEffect(() => {
    if (!chartInstance) {
      const chart = new Liquid("container3", {
        percent: val.toFixed(2),
        outline: {
          border: 4,
          distance: 8,
        },
        wave: {
          length: 128,
        },
      });

      chart.render();
      setChartInstance(chart);
      // Cleanup on unmount
      return () => {
        if (chartInstance) {
          chartInstance.destroy();
        }
      };
    }
  }, [chartInstance]);
  return <div id="container3"></div>;
};

export default DashBoard;
