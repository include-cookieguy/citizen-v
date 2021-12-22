import React, { useEffect, useState } from "react";
import { postDataAPI } from "../../utils/fetchData";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ChildIcon from "../../assets/occupation-2.png";
import OldIcon from "../../assets/occupation-3.png";
import LabourForce from "../../assets/occupation-1.png";

const StatisticOccupation = ({ location }) => {
  const [dataOccupation, setDataOccupation] = useState({
    statsWorkforce: [],
    statsUnemployed: [],
    statsU15Work: [],
    statsA60Work: [],
  });
  const [topTenOccupation, setTopTenOccupation] = useState([]);

  useEffect(() => {
    const getStatisticOccupation = async () => {
      const res = await postDataAPI("citizen/statistic/occupation", {
        location: location,
      });

      setDataOccupation(res.data);
      setTopTenOccupation(res.data.topTenOccupation);
    };

    getStatisticOccupation();
  }, [location]);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: ["Việc làm"],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Công dân (người)",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y} (người)</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: topTenOccupation.map((e) => ({
      name: e._id,
      data: [e.count],
    })),
  };

  return (
    <div className="stats-chart occupation">
      <div className="chart-title">Theo nghề nghiệp</div>

      <div className="title-top-10">10 nghề có lực lượng lao động đông đảo nhất</div>
      <HighchartsReact highcharts={Highcharts} options={options} />

      <div className="statistic-force">
        <div className="labour-force">
          <div className="box-occupation force-labour">
            <b>{dataOccupation.statsWorkforce.total15To60} người</b>

            <img src={LabourForce} alt="occu" className="img-occupation" />

            <div>Lực lượng lao động từ 15 tuổi trở lên đang làm việc</div>
          </div>

          <div className="box-occupation unemployed">
            <b>
              {(
                (dataOccupation.statsUnemployed.total15To60Unemployed /
                  dataOccupation.statsUnemployed.total15To60) *
                100
              ).toFixed(1)}
              %
            </b>

            <img
              src="https://images.careerbuilder.vn/content/talent_community/51484291_23843207826900429_8453968812310528_n.png"
              alt="occu"
              className="img-occupation"
            />

            <div>Tỷ lệ thất nghiệp của lực lượng lao động trong độ tuổi</div>
          </div>
        </div>

        <div className="non-labour-force">
          <div className="box-occupation young">
            <b>{dataOccupation.statsU15Work.totalU15Work} người</b>

            <img src={ChildIcon} alt="occu" className="img-occupation" />

            <div>
              Trẻ em dưới 15 tuổi trở xuống đang làm việc (chưa đến độ tuổi lao
              động)
            </div>
          </div>

          <div className="box-occupation old">
            <b>{dataOccupation.statsA60Work.totalA60Work} người</b>

            <img src={OldIcon} alt="occu" className="img-occupation" />

            <div>
              Người già từ 60 tuổi trở lên đang làm việc (đã hết độ tuổi lao động)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticOccupation;
