import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataPagination from "../components/DataPagination";
import { searchCitizens } from "../redux/actions/citizenAction";
import { Autocomplete, TextField } from "@mui/material";
import locationData from "../data/location.json";

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
  });

  const [disabledLocation, setDisabledLocation] = useState({
    city: false,
    district: false,
    ward: false,
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
    setSearchQuery({
      ...searchQuery,
      city: user.searchLocation.city,
      district: user.searchLocation.district,
      ward: user.searchLocation.ward,
    });

    setDisabledLocation({
      ...disabledLocation,
      city: user.disabledLocation.city,
      district: user.disabledLocation.district,
      ward: user.disabledLocation.ward,
    });
  }, [user.searchLocation, user.disabledLocation]);

  useEffect(() => {
    console.log(searchQuery.city);
    console.log(searchQuery.district);
  }, [searchQuery.city, searchQuery.district]);

  return (
    <div>
      <form onSubmit={handleSubmitSearch} className="search-citizen">
        <TextField
          name="fullName"
          sx={{ width: "50%" }}
          onChange={handleSearchQuery}
        />
        {!disabledLocation.city ? (
          <Autocomplete
            options={locationData}
            sx={{ width: 300 }}
            key={searchQuery.city_key + "city"}
            onInputChange={(e, newInput) => {
              setSearchQuery({
                ...searchQuery,
                city: newInput,
                district: "",
                ward: "",
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
            value={searchQuery.city}
            variant="outlined"
            disabled={true}
          />
        )}

        {!disabledLocation.district ? (
          <Autocomplete
            options={availableDistricts}
            sx={{ width: 300 }}
            // value={searchQuery.district}
            key={searchQuery.district_key + "district"}
            disabled={searchQuery.city ? false : true}
            onInputChange={(e, newInput) => {
              setSearchQuery({
                ...searchQuery,
                district: newInput,
                ward_key: !searchQuery.ward_key,
                ward: "",
              });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Quận/Huyện" />
            )}
          />
        ) : (
          <TextField
            value={searchQuery.district}
            variant="outlined"
            disabled={true}
          />
        )}

        {!disabledLocation.ward ? (
          <Autocomplete
            options={avaiableWards}
            sx={{ width: 300 }}
            // value={searchQuery.location.ward}
            key={searchQuery.ward_key}
            onInputChange={(e, newInput) => {
              setSearchQuery({
                ...searchQuery,
                ward: newInput,
              });
            }}
            disabled={searchQuery.district ? false : true}
            renderInput={(params) => (
              <TextField {...params} label="Xã/Phường" />
            )}
          />
        ) : (
          <TextField
            value={searchQuery.ward}
            variant="outlined"
            disabled={true}
          />
        )}

        <button>Tìm kiếm</button>
      </form>

      <div>
        <DataPagination />
      </div>
    </div>
  );
};

export default SearchCitizen;
