import React from 'react';
import { Col, Card, Statistic } from 'antd';

const DashboardAccountExpense = ({ chartData, formatter }) => {
  const expenseData = chartData?.chartExpenses || [];

  return (
    <Col xs={20} sm={12} md={8} lg={6} xl={4}>
      <Card title="Account Expenses">
        {expenseData.length > 0 && (
          <>
            {expenseData.map((item) => (
              <Statistic
                key={item.type}
                title={`${item.type} Expenses (LKR)`}
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

export default DashboardAccountExpense;
