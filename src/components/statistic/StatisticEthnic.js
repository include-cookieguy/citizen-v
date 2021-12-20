import React, { useEffect, useState } from "react";
import { postDataAPI } from "../../utils/fetchData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const StatisticEthnic = ({ location }) => {
  const [dataEthnic, setDataEthnic] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    const getStatisticEthnic = async () => {
      const res = await postDataAPI("citizen/statistic/ethnic", {
        location: location,
      });

      let totalEthnic = 0;
      res.data.forEach((e) => (totalEthnic += e.count));

      setDataEthnic(
        res.data
          .map((e) => ({
            name: e._id,
            y: e.count / totalEthnic,
          }))
          .slice(0, 10)
      );

      setRowData(
        res.data.map((e, index) => ({
          name: e._id,
          id: index + 1,
          count: e.count,
        }))
      );
    };

    getStatisticEthnic();
  }, [location]);

  const columns = [
    { field: "id", headerName: "STT", flex: 1, minWidth: 60 },
    { field: "name", headerName: "Dân tộc", flex: 4, minWidth: 230 },
    { field: "count", headerName: "Số người", flex: 3, minWidth: 150 },
  ];

  function NoRowsOverlay() {
    return (
      <Stack marginTop="200px" alignItems="center" justifyContent="center">
        Không có công dân nào phù hợp với yêu cầu
      </Stack>
    );
  }

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "",
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
        data: dataEthnic,
      },
    ],
  };

  return (
    <div className="stats-chart ethnic"> 
      <div className="chart-title">Theo dân tộc</div>

      <div className="chart-subtitle">10 dân tộc có số lượng dân số lớn nhất</div>

      <HighchartsReact highcharts={Highcharts} options={options} />

      <div className="total-title">Tổng dân số của các dân tộc</div>
      <div className="table-of-ethnic">
        <DataGrid
          autoHeight
          rows={rowData}
          columns={columns}
          components={{ NoRowsOverlay }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          disableSelectionOnClick={true}
        />
      </div>
    </div>
  );
};

export default StatisticEthnic;
