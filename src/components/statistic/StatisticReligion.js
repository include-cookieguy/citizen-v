import React, { useEffect, useState } from "react";
import { postDataAPI } from "../../utils/fetchData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StatisticReligion = ({ location }) => {
  const [dataReligion, setDataReligion] = useState([]);

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
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatisticReligion;
