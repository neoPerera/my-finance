import React from 'react';
import { Col, Card, Statistic } from 'antd';

const DashboardAccountBalance = ({ chartData, formatter }) => {
  const accountBalances = chartData?.chart4?.[1] || [];

  return (
    <Col xs={20} sm={12} md={8} lg={6} xl={4}>
      <Card title="Account Balance">
        {accountBalances.length > 0 && (
          <>
            {accountBalances.map((item) => (
              <Statistic
                key={item.account_name}
                title={`${item.account_name} Balance (LKR)`}
                value={item.account_balance}
                precision={2}
                formatter={formatter}
              />
            ))}
          </>
        )}
      </Card>
    </Col>
  );
};

export default DashboardAccountBalance;
