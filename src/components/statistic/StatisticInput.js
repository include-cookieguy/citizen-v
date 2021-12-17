import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Autocomplete, TextField, Switch } from "@mui/material";
import locationData from "../../data/location.json";
import { postDataAPI } from "../../utils/fetchData";
import StatisticAge from "./StatisticAge";

const StatisticInput = () => {
  const { auth, user } = useSelector((state) => state);

  const [searchQuery, setSearchQuery] = useState({
    city: [],
    district: [],
    ward: [],
    village: "",
    //  Key
    // city_key: true,
    // district_key: true,
    // ward_key: true,
    // village_key: true,
  });

  const [resQuery, setResQuery] = useState({});

  const [disabledLocation, setDisabledLocation] = useState({
    city: false,
    district: false,
    ward: false,
    village: false,
  });

  const [availableVillages, setAvailableVillages] = useState([]);

  useEffect(() => {
    if (searchQuery.ward) {
      const getVillages = async () => {
        let locaWard = {
          ward: "",
        };

        locaWard = {
          ...locaWard,
          ward: searchQuery.ward,
        };

        const res = await postDataAPI("unit/getVillage", locaWard);

        setAvailableVillages(res.data);
      };

      getVillages();
    }
  }, [searchQuery.ward]);

  const availableDistricts = useMemo(() => {
    if (searchQuery.city.length === 1) {
      const res = locationData.find((e) => e.label === searchQuery.city[0]);

      if (res) {
        return res.Districts;
      }
    }

    if (typeof searchQuery.city === "string") {
      const res = locationData.find((e) => e.label === searchQuery.city);

      if (res) {
        return res.Districts;
      }
    }
  }, [searchQuery.city]);

  const avaiableWards = useMemo(() => {
    if (
      typeof searchQuery.city === "string" &&
      typeof searchQuery.district === "string"
    ) {
      const res = availableDistricts.find(
        (e) => e.label === searchQuery.district
      );

      if (res) {
        return res.Wards;
      }
    }

    if (searchQuery.district.length === 1) {
      const res = availableDistricts.find(
        (e) => e.label === searchQuery.district[0]
      );

      if (res) {
        return res.Wards;
      }
    }
  }, [searchQuery.city, searchQuery.district, availableDistricts]);

  useEffect(() => {
    console.log(resQuery);
  }, [resQuery]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    const { city, district, ward, village } = searchQuery;

    const location = {
      city: typeof city === "string" ? city : city.join(","),
      district: typeof district === "string" ? district : district.join(","),
      ward: typeof ward === "string" ? ward : ward.join(","),
      village: village,
    };

    const res_search = {
      ...searchQuery,
      location,
    };

    setResQuery(res_search.location);
  };

  useEffect(() => {
    setSearchQuery({
      ...searchQuery,
      city: user.searchLocation.city ? user.searchLocation.city : [],
      district: user.searchLocation.district
        ? user.searchLocation.district
        : [],
      ward: user.searchLocation.ward ? user.searchLocation.ward : [],
      village: user.searchLocation.village,
    });

    setDisabledLocation({
      ...disabledLocation,
      city: user.disabledLocation.city,
      district: user.disabledLocation.district,
      ward: user.disabledLocation.ward,
      village: user.disabledLocation.village,
    });
  }, [user.searchLocation, user.disabledLocation]);

  return (
    <div className="statistic">
      <div className="statistic-container">
        <div className="stats-title">
          Các thống kê và phân tích số liệu về dân cư
        </div>

        <div className="stats-filter">
          <form onSubmit={handleSubmitSearch} className="list-citizens-search list">
            {!disabledLocation.city ? (
              <Autocomplete
                className="filter city"
                noOptionsText={"Không có lựa chọn phù hợp"}
                options={locationData}
                multiple
                size="small"
                // key={searchQuery.city_key + "city"}
                onChange={(e, newInput) => {
                  setSearchQuery({
                    ...searchQuery,
                    city: newInput.map((e) => e.label),
                    district: [],
                    ward: [],
                    village: "",
                    // district_key: !searchQuery.district_key,
                    // ward_key: !searchQuery.ward_key,
                    // village_key: !searchQuery.village_key,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tỉnh/Thành Phố" />
                )}
              />
            ) : (
              <TextField
                className="filter city"
                value={searchQuery.city}
                variant="outlined"
                disabled={true}
                size="small"
              />
            )}

            {!disabledLocation.district ? (
              <Autocomplete
                className="filter district"
                noOptionsText={"Không có lựa chọn phù hợp"}
                options={availableDistricts || []}
                multiple
                size="small"
                // key={searchQuery.district_key + "district"}
                // value={searchQuery.district}
                disabled={searchQuery.city ? false : true}
                onChange={(e, newInput) => {
                  setSearchQuery({
                    ...searchQuery,
                    district: newInput.map((e) => e.label),
                    ward: [],
                    village: "",
                    // district_key: !searchQuery.district_key,
                    // ward_key: !searchQuery.ward_key,
                    // village_key: !searchQuery.village_key,
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Quận/Huyện" />
                )}
              />
            ) : (
              <TextField
                className="filter district"
                value={searchQuery.district}
                variant="outlined"
                disabled={true}
                size="small"
              />
            )}

            {!disabledLocation.ward ? (
              <Autocomplete
                className="filter ward"
                noOptionsText={"Không có lựa chọn phù hợp"}
                options={avaiableWards || []}
                multiple
                size="small"
                // value={searchQuery.location.ward}
                // key={searchQuery.ward_key}
                onChange={(e, newInput) => {
                  setSearchQuery({
                    ...searchQuery,
                    ward: newInput.map((e) => e.label),
                    // district_key: !searchQuery.district_key,
                    // ward_key: !searchQuery.ward_key,
                  });
                }}
                disabled={searchQuery.district ? false : true}
                renderInput={(params) => (
                  <TextField {...params} label="Xã/Phường" />
                )}
              />
            ) : (
              <TextField
                className="filter ward"
                value={searchQuery.ward}
                variant="outlined"
                disabled={true}
                size="small"
              />
            )}

            {auth.user.regency === "B1" &&
              (!disabledLocation.village ? (
                <Autocomplete
                  className="filter village"
                  noOptionsText={"Không có lựa chọn phù hợp"}
                  options={availableVillages || []}
                  size="small"
                  // value={searchQuery.location.ward}
                  // key={searchQuery.ward_key}
                  getOptionLabel={(option) => option.nameOfUnit}
                  onInputChange={(e, newInput) => {
                    setSearchQuery({
                      ...searchQuery,
                      village: newInput,
                      // district_key: !searchQuery.district_key,
                      // ward_key: !searchQuery.ward_key,
                    });
                  }}
                  disabled={searchQuery.ward ? false : true}
                  renderInput={(params) => (
                    <TextField {...params} label="Thôn/Bản/Khu/Tổ dân phố" />
                  )}
                />
              ) : (
                <TextField
                  className="filter ward"
                  value={searchQuery.village}
                  variant="outlined"
                  disabled={true}
                  size="small"
                />
              ))}

            <button className="submit">Thống kê phân tích</button>
          </form>
        </div>

        <div className="stats-result">
          {Object.keys(resQuery).length !== 0 && (
            <StatisticAge location={resQuery} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticInput;
