// Data gathered from http://populationpyramid.net/germany/2015/
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { postDataAPI } from "../../utils/fetchData";
// Age categories

const StatisticAge = () => {
  const [data, setData] = useState({});
  const [series, setSeries] = useState([]);
  useEffect(() => {
    const getAgeByGender = async () => {
      const res = await postDataAPI("citizen/statistic/age", {
        location: {
          city: "Tỉnh Bắc Ninh",
          district: "Huyện Lương Tài",
          ward: "Thị trấn Thứa,Xã Quảng Phú",
          village: "",
        },
      });

      //   series: [
      //   {
      //     name: "Nam",
      //     data: [
      //       -2.2, -2.1, -2.2, -2.4, -2.7, -3.0, -3.3, -3.2, -2.9, -3.5, -4.4, -4.1,
      //       -3.4, -2.7, -2.3, -2.2, -1.6, -0.6, -0.3, -0.0, -0.0,
      //     ],
      //   },
      //   {
      //     name: "Nữ",
      //     data: [
      //       2.1, 2.0, 2.1, 2.3, 2.6, 2.9, 3.2, 3.1, 2.9, 3.4, 4.3, 4.0, 3.5, 2.9,
      //       2.5, 2.7, 2.2, 1.1, 0.6, 0.2, 0.0,
      //     ],
      //   },
      // ],

      let dataMale = [];
      let dataFemale = [];
      // for (const [key, value] of Object.entries(res.data)) {
      //   dataMale[key / 5] = value.sumMale;
      //   dataFemale[key / 5] = value.sumFemale;
      // }

      const seri_temp = [
        {
          name: "Nam",
          data: dataMale,
        },
        {
          name: "Nữ",
          data: dataFemale,
        },
      ];

      for (let i = 0; i < 100; i += 5) {
        const str = i.toString();
        if (res.data.hasOwnProperty(str)) {
          seri_temp[0].data.push(res.data[str].sumMale);
          seri_temp[1].data.push(res.data[str].sumFemale);
        }
      }

      console.log(seri_temp);

      setSeries(seri_temp);
    };

    getAgeByGender();
  }, []);

  var categories = [
    "0-4",
    "5-9",
    "10-14",
    "15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65-69",
    "70-74",
    "75-79",
    "80-84",
    "85-89",
    "90-94",
    "95-99",
    "100 + ",
  ];

  const options = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Population pyramid for Germany, 2018",
    },
    subtitle: {
      text: 'Source: <a href="http://populationpyramid.net/germany/2018/">Population Pyramids of the World from 1950 to 2100</a>',
    },
    accessibility: {
      point: {
        valueDescriptionFormat: "{index}. Age {xDescription}, {value}",
      },
    },
    xAxis: [
      {
        categories: categories,
        reversed: false,
        labels: {
          step: 1,
        },
        accessibility: {
          description: "Age (male)",
        },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        categories: categories,
        linkedTo: 0,
        labels: {
          step: 1,
        },
        accessibility: {
          description: "Age (female)",
        },
      },
    ],
    yAxis: {
      title: {
        text: null,
      },
      labels: {
        formatter: function () {
          return Math.abs(this.value) + "%";
        },
      },
      accessibility: {
        description: "Percentage population",
        rangeDescription: "Range: 0 to 100",
      },
    },

    plotOptions: {
      series: {
        stacking: "normal",
      },
    },

    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          this.series.name +
          ", age " +
          this.point.category +
          "</b><br/>" +
          "Population: " +
          Highcharts.numberFormat(Math.abs(this.point.y), 1) +
          "%"
        );
      },
    },

    series: series,
  };
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StatisticAge;
