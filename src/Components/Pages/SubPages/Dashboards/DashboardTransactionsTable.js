import React from 'react';
import { Col, Card, Table } from 'antd';

const DashboardTransactionsTable = ({ chartData, data }) => {
  const transactions = chartData?.chart4?.[0] || [];

  return (
    <Col xs={20} sm={12} md={8} lg={6} xl={7}>
      <Card title="Transactions">
        {transactions.length > 0 && (
          <Table
            size="small"
            scroll={{ x: 500 }}
            dataSource={transactions}
            columns={data?.transTable?.columns || []}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </Col>
  );
};

export default DashboardTransactionsTable;
