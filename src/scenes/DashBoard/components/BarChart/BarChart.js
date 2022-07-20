import { Typography } from '@material-ui/core';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// const data = [
//   {
//     name: 'Health',
//     ib: 4000,
//     ob: 2400
//   },
//   {
//     name: 'Life',
//     ib: 3000,
//     ob: 1398
//   },
//   {
//     name: 'Tax',
//     ib: 2000,
//     ob: 9800
//   },
//   {
//     name: 'Persional',
//     ib: 2780,
//     ob: 3908
//   }
// ];

function SimpleBarChart(props) {
  const { barChart } = props;
  return (
    <>
      {props.title && <Typography variant="h5">{props.title}</Typography>}

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={730}
          height={250}
          data={barChart}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="Inbound"
            fill="#8884d8"
            label={{ position: 'top' }}
            barSize={60}
          />
          <Bar
            dataKey="Outbound"
            fill="#82ca9d"
            label={{ position: 'top' }}
            barSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}

export default SimpleBarChart;
