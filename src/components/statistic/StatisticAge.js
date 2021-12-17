import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { postDataAPI } from "../../utils/fetchData";
import { useSelector } from "react-redux";

const StatisticAge = ({ location }) => {
  const [series, setSeries] = useState([]);
  const { auth, user } = useSelector((state) => state);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const getAgeByGender = async () => {
      const res = await postDataAPI("citizen/statistic/age", {
        location: location,
      });

      let dataMale = [];
      let dataFemale = [];

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

      for (let i = 0; i <= 100; i += 5) {
        const str = i.toString();
        if (res.data.hasOwnProperty(str)) {
          seri_temp[0].data.push(
            (-res.data[str].sumMale / res.data[str].countCitizens) * 5
          );
          seri_temp[1].data.push(
            (res.data[str].sumFemale / res.data[str].countCitizens) * 5
          );
        } else {
          seri_temp[0].data.push(-0);
          seri_temp[1].data.push(0);
        }
      }

      setSeries(seri_temp);
    };
    getAgeByGender();
  }, [location, user.searchLocation]);

  useEffect(() => {
    if (location.city) {
      let str = "";
      if (location.village) {
        str += location.village + ", ";
      }
      if (location.ward) {
        str += location.ward + ", ";
      }
      if (location.district) {
        str += location.district + ", ";
      }
      if (location.city) {
        str += location.city;
      }
      setTitle(str);
    } else {
      setTitle("Việt Nam");
    }
  }, [location]);

  const categories = [
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
      text:
        "Thống kê và phân tích công dân theo độ tuổi-giới tính của " + title,
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
          description: "Tuổi (nam)",
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
          description: "Tuổi (nữ)",
        },
      },
    ],
    yAxis: {
      max: 5,
      min: -5,
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
          ", tuổi " +
          this.point.category +
          "</b><br/>" +
          "Chiếm: " +
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
