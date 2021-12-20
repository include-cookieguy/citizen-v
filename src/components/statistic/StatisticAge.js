import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { postDataAPI } from "../../utils/fetchData";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";

const StatisticAge = ({ location }) => {
  const [series, setSeries] = useState([]);
  const { auth, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAgeByGender = async () => {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
      const res = await postDataAPI("citizen/statistic/age", {
        location: location,
      });
      dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });

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
            (-res.data[str].sumMale / res.data.totalCitizens) * 100
          );
          seri_temp[1].data.push(
            (res.data[str].sumFemale / res.data.totalCitizens) * 100
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

  const percentGender = useMemo(() => {
    if (series.length !== 0) {
      return (
        series[0].data.reduce(function (a, b) {
          return Math.abs(a) + Math.abs(b);
        }, 0) /
        series[1].data.reduce(function (a, b) {
          return a + b;
        }, 0)
      );
    }
  }, [series]);

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
      text: "Theo độ tuổi-giới tính",
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
    <div className="stats-chart age-gender">
      <HighchartsReact highcharts={Highcharts} options={options} />
      {series.length !== 0 && (
        <div className="comment">
          Tỉ lệ Nam/Nữ: {(percentGender * 100).toFixed(1).toString() + "/100"}
        </div>
      )}
    </div>
  );
};

export default StatisticAge;
