import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import popCity from "../data/pop_city.json";

const ChartCitizen = () => {
  const [data, setData] = useState(() => {
    let mapPop = popCity.map((e) => ({
      ...e,
      pop: parseInt(e.pop.replace(/\./g, "")),
    }));

    return mapPop.sort((a, b) => (a.pop < b.pop ? 1 : -1)).slice(0, 10);
  });
  return (
    <div style={{ width: "100vw", height: "100vh", margin: "20px" }}>
      <BarChart width={1200} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="city" />
        <YAxis />
        <Bar label={true} dataKey="pop" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default ChartCitizen;
