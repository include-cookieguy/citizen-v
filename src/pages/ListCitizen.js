import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataPagination from "../components/DataPagination";
import { listCitizens } from "../redux/actions/citizenAction";
import { Autocomplete, TextField } from "@mui/material";
import locationData from "../data/location.json";

const ListCitizen = () => {
  const { auth, user } = useSelector((state) => state);

  const [searchQuery, setSearchQuery] = useState({
    city: [],
    district: [],
    ward: [],
    village: [],
    //  Key
    city_key: true,
    district_key: true,
    ward_key: true,
  });

  const [disabledLocation, setDisabledLocation] = useState({
    city: false,
    district: false,
    ward: false,
  });

  const dispatch = useDispatch();

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

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    const { city, district, ward, village } = searchQuery;

    const location = {
      city: typeof city === "string" ? city : city.join(","),
      district: typeof district === "string" ? district : district.join(","),
      ward: typeof ward === "string" ? ward : ward.join(","),
      village,
    };

    const res_search = {
      ...searchQuery,
      location,
    };

    dispatch(listCitizens(res_search, auth));
  };

  useEffect(() => {
    const { city, district, ward, village } = searchQuery;

    const location = {
      city: typeof city === "string" ? city : city.join(","),
      district: typeof district === "string" ? district : district.join(","),
      ward: typeof ward === "string" ? ward : ward.join(","),
      village,
    };

    const res_search = {
      ...searchQuery,
      location,
    };

    dispatch(listCitizens(res_search, auth));
  }, []);

  useEffect(() => {
    setSearchQuery({
      ...searchQuery,
      city: user.searchLocation.city ? user.searchLocation.city : [],
      district: user.searchLocation.district
        ? user.searchLocation.district
        : [],
      ward: user.searchLocation.ward ? user.searchLocation.ward : [],
    });

    setDisabledLocation({
      ...disabledLocation,
      city: user.disabledLocation.city,
      district: user.disabledLocation.district,
      ward: user.disabledLocation.ward,
    });
  }, [user.searchLocation, user.disabledLocation]);

  return (
    <div className='list-citizens'>
      <div className='list-citizens-container'>
        <div className='title'>Danh sách công dân theo địa phương</div>

        <form onSubmit={handleSubmitSearch} className="list-citizens-search">
          {!disabledLocation.city ? (
            <Autocomplete
              className='filter city'
              noOptionsText={"Không có lựa chọn phù hợp"}
              options={locationData}
              multiple
              size='small'
              key={searchQuery.city_key + "city"}
              onChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  city: newInput.map((e) => e.label),
                  district: [],
                  ward: [],
                  district_key: !searchQuery.district_key,
                  ward_key: !searchQuery.ward_key,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Tỉnh/Thành Phố" />
              )}
            />
          ) : (
            <TextField
              className='filter city'
              value={searchQuery.city}
              variant="outlined"
              disabled={true}
              size='small'
            />
          )}

          {!disabledLocation.district ? (
            <Autocomplete
              className='filter district'
              noOptionsText={"Không có lựa chọn phù hợp"}
              options={availableDistricts || []}
              multiple
              size='small'
              // key={searchQuery.district_key + "district"}
              // value={searchQuery.district}
              disabled={searchQuery.city ? false : true}
              onChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  district: newInput.map((e) => e.label),
                  ward: [],
                  district_key: !searchQuery.district_key,
                  ward_key: !searchQuery.ward_key,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Quận/Huyện" />
              )}
            />
          ) : (
            <TextField
              className='filter district'
              value={searchQuery.district}
              variant="outlined"
              disabled={true}
              size='small'
            />
          )}

          {!disabledLocation.ward ? (
            <Autocomplete
              className='filter ward'
              noOptionsText={"Không có lựa chọn phù hợp"}
              options={avaiableWards || []}
              multiple
              size='small'
              // value={searchQuery.location.ward}
              // key={searchQuery.ward_key}
              onChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  ward: newInput.map((e) => e.label),
                  district_key: !searchQuery.district_key,
                  ward_key: !searchQuery.ward_key,
                });
              }}
              disabled={searchQuery.district ? false : true}
              renderInput={(params) => (
                <TextField {...params} label="Xã/Phường" />
              )}
            />
          ) : (
            <TextField
              className='filter ward'
              value={searchQuery.ward}
              variant="outlined"
              disabled={true}
              size='small'
            />
          )}

          <button className='submit'>Tìm kiếm</button>
        </form>

        <div className='list-citizens-result'>
          <DataPagination />
        </div>
      </div>
    </div>
  );
};

export default ListCitizen;
