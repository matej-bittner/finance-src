"use client";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { value: 12, date: "2024-12-12" },
  { value: 25, date: "2024-12-11" },
  { value: 5, date: "2024-12-10" },
];

interface ChartOneProps {
  data: { date: string; totalSales: number }[];
}
const ChartOne = ({ data }: ChartOneProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className="bg-blue-400">
      <LineChart width={500} height={200} data={data}>
        <CartesianGrid />
        <XAxis dataKey="date" />
        <YAxis tickFormatter={(tick) => tick} />
        <Tooltip />
        <Line dataKey="totalSales" type="monotone" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartOne;
