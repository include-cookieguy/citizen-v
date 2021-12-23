import React, { useEffect, useState } from "react";
import { postDataAPI } from "../../utils/fetchData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StatisticReligion = ({ location }) => {
  const [dataReligion, setDataReligion] = useState([]);
  const [percentFaithful, setPercentFaithfull] = useState(0);
  const [numberFaithful, setNumberFaithfull] = useState(0);

  useEffect(() => {
    const getStatisticReligion = async () => {
      const res = await postDataAPI("citizen/statistic/religion", {
        location: location,
      });

      let totalReligion = 0;
      res.data.forEach((e) => (totalReligion += e.count));

      setDataReligion(
        res.data.map((e) => ({ name: e._id, y: e.count / totalReligion }))
      );

      setNumberFaithfull(totalReligion - res.data[0].count);
      setPercentFaithfull((totalReligion - res.data[0].count) / totalReligion);
    };

    getStatisticReligion();
  }, [location]);

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Theo tôn giáo",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Chiếm",
        colorByPoint: true,
        data: dataReligion,
      },
    ],
  };

  return (
    <div className="stats-chart religion">
      <HighchartsReact highcharts={Highcharts} options={options} />

      <div className="religion-stats">
        <div className="title">Cả nước hiện có:</div>
        <div className="some-stat">
          <div className="organization">
            <div></div>
            <span>
              <span>39</span>&nbsp;&nbsp;Tổ chức tôn giáo
            </span>
          </div>
          <div className="number-of-faithful">
            <div></div>
            <span>
              <span>{numberFaithful}</span>&nbsp;&nbsp;Tín đồ
            </span>
            <span className="extra">
              (Chiếm {(percentFaithful * 100).toFixed(2)}% dân số)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticReligion;
