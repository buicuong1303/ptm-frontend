/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import { Typography } from '@material-ui/core';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#ffff',
          padding: '5px',
          border: '1px solid #cccc'
        }}
      >
        <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
      </div>
    );
  }

  return null;
};

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function SimplePieChart(props) {
  const { pieChart } = props;
  const COLORS = ['#0088FE', '#00C49F'];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      {props.title && <Typography variant="h5">{props.title}</Typography>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={730} height={300}>
          <Pie
            data={pieChart}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
            isAnimationActive={false}
          >
            {pieChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}

export default SimplePieChart;
