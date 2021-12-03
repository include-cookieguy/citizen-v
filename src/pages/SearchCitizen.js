import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataPagination from "../components/DataPagination";
import { searchCitizens } from "../redux/actions/citizenAction";
import { Autocomplete, TextField } from "@mui/material";
import locationData from "../data/location.json";

const SearchCitizen = () => {
  const [searchQuery, setSearchQuery] = useState({
    fullName: "",
    location: {
      city: "",
      district: "",
      ward: "",
    },
  });

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const availableDistricts = useMemo(() => {
    if (searchQuery.location.city) {
      const res = locationData.find(
        (e) => e.label === searchQuery.location.city
      );

      if (res) {
        return res.Districts;
      }
    }
  }, [searchQuery.location.city]);

  const avaiableWards = useMemo(() => {
    if (
      searchQuery.location.city &&
      searchQuery.location.district &&
      availableDistricts
    ) {
      const res = availableDistricts.find(
        (e) => e.label === searchQuery.location.district
      );

      if (res) {
        return res.Wards;
      }
    }
  }, [
    searchQuery.location.city,
    searchQuery.location.district,
    availableDistricts,
  ]);

  const handleSearchQuery = (e) => {
    const { value, name } = e.target;
    setSearchQuery({
      ...searchQuery,
      [name]: value,
    });
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    dispatch(searchCitizens(searchQuery, auth));
  };

  return (
    <div>
      <form onSubmit={handleSubmitSearch} className="search-citizen">
        <input
          type="text"
          placeholder="Họ và tên"
          name="fullName"
          className="fullname-search"
          onChange={handleSearchQuery}
        />
        <Autocomplete
          disablePortal
          options={locationData}
          sx={{ width: 300 }}
          onInputChange={(e, newInput) => {
            setSearchQuery({
              ...searchQuery,
              location: {
                ...searchQuery.location,
                city: newInput,
                district: "",
                ward: "",
              },
            });
          }}
          renderInput={(params) => (
            <TextField {...params} label="Tỉnh/Thành Phố" />
          )}
        />

        <Autocomplete
          disablePortal
          options={availableDistricts}
          sx={{ width: 300 }}
          disabled={searchQuery.location.city ? false : true}
          onInputChange={(e, newInput) => {
            setSearchQuery({
              ...searchQuery,
              location: {
                ...searchQuery.location,
                district: newInput,
                ward: "",
              },
            });
          }}
          renderInput={(params) => <TextField {...params} label="Quận/Huyện" />}
        />

        <Autocomplete
          disablePortal
          options={avaiableWards}
          sx={{ width: 300 }}
          onInputChange={(e, newInput) => {
            setSearchQuery({
              ...searchQuery,
              location: {
                ...searchQuery.location,
                ward: newInput,
              },
            });
          }}
          disabled={searchQuery.location.district ? false : true}
          renderInput={(params) => <TextField {...params} label="Xã/Phường" />}
        />

        <button>Tìm kiếm</button>
      </form>

      <div>
        <DataPagination />
      </div>
    </div>
  );
};

export default SearchCitizen;
