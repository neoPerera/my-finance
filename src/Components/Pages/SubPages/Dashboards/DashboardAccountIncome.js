import React from 'react';
import { Col, Card, Statistic } from 'antd';

const DashboardAccountIncome = ({ chartData, formatter }) => {
  const incomeData = chartData?.chartIncomes || [];

  return (
    <Col xs={20} sm={12} md={8} lg={6} xl={4}>
      <Card title="Account Incomes">
        {incomeData.length > 0 && (
          <>
            {incomeData.map((item) => (
              <Statistic
                key={item.type}
                title={`${item.type} Incomes (LKR)`}
                value={item.value}
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

export default DashboardAccountIncome;
