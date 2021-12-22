import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataPagination from "../components/DataPagination";
import { searchCitizens } from "../redux/actions/citizenAction";
import { Autocomplete, TextField } from "@mui/material";
import locationData from "../data/location.json";
import { postDataAPI } from "../utils/fetchData";

const SearchCitizen = () => {
  const { auth, user } = useSelector((state) => state);

  const [searchQuery, setSearchQuery] = useState({
    fullName: "",
    city: "",
    district: "",
    ward: "",
    village: "",
    //  Key
    city_key: true,
    district_key: true,
    ward_key: true,
    village_key: true,
  });

  const [availableVillages, setAvailableVillages] = useState([]);

  const [disabledLocation, setDisabledLocation] = useState({
    city: false,
    district: false,
    ward: false,
    village: false,
  });

  const dispatch = useDispatch();

  const availableDistricts = useMemo(() => {
    if (searchQuery.city) {
      const res = locationData.find((e) => e.label === searchQuery.city);

      if (res) {
        return res.Districts;
      }
    }
  }, [searchQuery.city]);

  const avaiableWards = useMemo(() => {
    if (searchQuery.city && searchQuery.district && availableDistricts) {
      const res = availableDistricts.find(
        (e) => e.label === searchQuery.district
      );

      if (res) {
        return res.Wards;
      }
    }
  }, [searchQuery.city, searchQuery.district, availableDistricts]);

  const handleSearchQuery = (e) => {
    const { value, name } = e.target;
    setSearchQuery({
      ...searchQuery,
      [name]: value,
    });
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    const { city, district, ward, village } = searchQuery;

    const location = {
      city,
      district,
      ward,
      village,
    };

    const res_search = {
      ...searchQuery,
      location,
    };

    dispatch(searchCitizens(res_search, auth));
  };

  useEffect(() => {
    if (searchQuery.ward && searchQuery.ward.length > 0) {
      const getVillages = async () => {
        const locaWard = {
          ward: searchQuery.ward,
        };
        const res = await postDataAPI("unit/getVillage", locaWard);

        setAvailableVillages(res.data);
      };

      getVillages();
    }
  }, [searchQuery.ward]);

  useEffect(() => {
    const { city, district, ward, village } = searchQuery;
    const {
      nameOfUnit,
      nameOfParentUnit,
      nameOfGrandUnit,
      nameOfGreatGrandUnit,
    } = auth.user;

    let location = {};

    if (nameOfGreatGrandUnit) {
      location = {
        city: nameOfGreatGrandUnit,
        district: nameOfGrandUnit,
        ward: nameOfParentUnit,
        village: nameOfUnit,
      };
    } else if (!nameOfGreatGrandUnit && nameOfGrandUnit) {
      location = {
        city: nameOfGrandUnit,
        district: nameOfParentUnit,
        ward: nameOfUnit,
        village: village,
      };
    } else if (!nameOfGreatGrandUnit && !nameOfGrandUnit && nameOfParentUnit) {
      location = {
        city: nameOfParentUnit,
        district: nameOfUnit,
        ward: ward,
        village: village,
      };
    } else if (
      !nameOfGreatGrandUnit &&
      !nameOfGrandUnit &&
      !nameOfParentUnit &&
      nameOfUnit
    ) {
      location = {
        city: nameOfUnit,
        district: district,
        ward: ward,
        village: village,
      };
    } else if (
      !nameOfGreatGrandUnit &&
      !nameOfGrandUnit &&
      !nameOfParentUnit &&
      !nameOfUnit
    ) {
      location = {
        city: city,
        district: district,
        ward: ward,
        village: village,
      };
    }

    console.log(location);

    const res_search = {
      ...searchQuery,
      location,
    };

    dispatch(searchCitizens(res_search, auth));
  }, [auth, dispatch]);

  useEffect(() => {
    setSearchQuery({
      ...searchQuery,
      city: user.searchLocation.city,
      district: user.searchLocation.district,
      ward: user.searchLocation.ward,
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
    <div className="list-citizens">
      <div className="list-citizens-container">
        <div className="title">Tìm kiếm công dân</div>

        <form
          onSubmit={handleSubmitSearch}
          className="list-citizens-search search"
        >
          <TextField
            className="filter name"
            name="fullName"
            placeholder="Tên công dân"
            sx={{ width: "50%" }}
            onChange={handleSearchQuery}
            size="small"
          />
          {!disabledLocation.city ? (
            <Autocomplete
              className="filter city"
              noOptionsText={"Không có lựa chọn phù hợp"}
              options={locationData}
              size="small"
              key={searchQuery.city_key + "city"}
              onInputChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  city: newInput,
                  district: "",
                  ward: "",
                  village: "",
                  district_key: !searchQuery.district_key,
                  ward_key: !searchQuery.ward_key,
                  village_key: !searchQuery.village_key,
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
              options={availableDistricts}
              size="small"
              // value={searchQuery.district}
              key={searchQuery.district_key + "district"}
              disabled={searchQuery.city ? false : true}
              onInputChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  district: newInput,
                  ward: "",
                  village: "",
                  ward_key: !searchQuery.ward_key,
                  village_key: !searchQuery.village_key,
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
              options={avaiableWards}
              size="small"
              // value={searchQuery.location.ward}
              key={searchQuery.ward_key + "ward"}
              onInputChange={(e, newInput) => {
                setSearchQuery({
                  ...searchQuery,
                  ward: newInput,
                  village: "",
                  village_key: !searchQuery.village_key,
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

          <Autocomplete
            className="filter village"
            noOptionsText={"Không có lựa chọn phù hợp"}
            options={availableVillages}
            size="small"
            // value={searchQuery.location.ward}
            getOptionLabel={(option) => option.nameOfUnit}
            key={searchQuery.village_key}
            onInputChange={(e, newInput) => {
              setSearchQuery({
                ...searchQuery,
                village: newInput,
              });
            }}
            disabled={searchQuery.ward ? false : true}
            renderInput={(params) => (
              <TextField {...params} label="Thôn/Bản/Khu/Tổ dân phố" />
            )}
          />

          <button className="submit">Tìm kiếm</button>
        </form>

        <div className="list-citizens-result">
          <DataPagination />
        </div>
      </div>
    </div>
  );
};

export default SearchCitizen;
