import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDataAPI } from "../utils/fetchData";

const ChartMonitor = ({ currentUnit }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getPerDateCitizens = async () => {
      const res = await getDataAPI(
        `user/chartMonitor${currentUnit ? "?unit=" + currentUnit : ""}`
      );

      const dataTemp = res.data
        .map((e) => ({
          name: e.createdAt,
          numberOfCitizens: e.numberOfCitizens,
        }))
        .sort((a, b) => {
          const aConvert = a.name.split("/").reverse().join();
          const bConvert = b.name.split("/").reverse().join();
          return aConvert < bConvert ? -1 : aConvert > bConvert ? 1 : 0;
        });
      setData(dataTemp);
    };

    getPerDateCitizens();
  }, [currentUnit]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" domain={[0, 1]} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line name="Đã nhập" dataKey="numberOfCitizens" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartMonitor;
