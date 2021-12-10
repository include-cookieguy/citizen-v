import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import locationData from "../data/location.json";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import { getDataAPI, postDataAPI } from "../utils/fetchData";
import ChartMonitor from "./ChartMonitor";

const Monitor = () => {
  const [units, setUnits] = useState([]);
  const { auth, user } = useSelector((state) => state);
  const [currentUnit, setCurrentUnit] = useState("");
  const [numberCitizens, setNumberCitizens] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unitDistricts = user.searchLocation.city
      ? locationData.filter((e) => e.label === user.searchLocation.city)[0]
          .Districts
      : [];
    const unitWards = user.searchLocation.district
      ? unitDistricts.filter((e) => e.label === user.searchLocation.district)[0]
          .Wards
      : [];

    const getVillage = async () => {
      const res = await postDataAPI("unit/getVillage", {
        ward: user.searchLocation.ward,
      });

      return res.data;
    };

    switch (auth.user.regency) {
      case "A1":
        setUnits(locationData.map((e) => e.label));
        break;
      case "A2":
        setUnits(unitDistricts.map((e) => e.label));
        break;
      case "A3":
        setUnits(unitWards.map((e) => e.label));
        break;
      case "B1":
        getVillage().then((data) => setUnits(data.map((e) => e.nameOfUnit)));
        break;
      default:
        break;
    }
  }, [auth.user.regency, user.searchLocation]);

  useEffect(() => {
    const getCount = async () => {
      const res = await getDataAPI(
        `user/monitor${currentUnit ? "?unit=" + currentUnit : ""}`
      );

      setNumberCitizens(res.data);
    };

    getCount();
  }, [currentUnit]);

  return (
    <div>
      <h1>Theo dõi tình hình/tiến độ nhập liệu</h1>
      <Autocomplete
        className="filter city"
        noOptionsText={"Không có lựa chọn phù hợp"}
        options={units}
        size="small"
        onChange={(e, newInput) => {
          setCurrentUnit(newInput);
        }}
        renderInput={(params) => <TextField {...params} label="Địa phương" />}
      />

      {currentUnit && (
        <div>
          {" "}
          <span>
            Tổng số công dân đã khai báo của {currentUnit} là: {numberCitizens}
          </span>
          <ChartMonitor currentUnit={currentUnit} />{" "}
        </div>
      )}
    </div>
  );
};

export default Monitor;
