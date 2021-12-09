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
    if (searchQuery.ward) {
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
        city: city,
        district: nameOfGrandUnit,
        ward: nameOfParentUnit,
        village: nameOfUnit,
      };
    } else if (!nameOfGreatGrandUnit && !nameOfGrandUnit && nameOfParentUnit) {
      location = {
        city: city,
        district: district,
        ward: nameOfParentUnit,
        village: nameOfUnit,
      };
    } else if (
      !nameOfGreatGrandUnit &&
      !nameOfGrandUnit &&
      !nameOfParentUnit &&
      nameOfUnit
    ) {
      location = {
        city: city,
        district: district,
        ward: ward,
        village: nameOfUnit,
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
    <div>
      <form onSubmit={handleSubmitSearch} className="search-citizen">
        <TextField
          name="fullName"
          sx={{ width: "50%" }}
          onChange={handleSearchQuery}
        />
        {!disabledLocation.city ? (
          <Autocomplete
            noOptionsText={"Không có lựa chọn phù hợp"}
            options={locationData}
            sx={{ width: 300 }}
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
            value={searchQuery.city}
            variant="outlined"
            disabled={true}
          />
        )}

        {!disabledLocation.district ? (
          <Autocomplete
            noOptionsText={"Không có lựa chọn phù hợp"}
            options={availableDistricts}
            sx={{ width: 300 }}
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
            value={searchQuery.district}
            variant="outlined"
            disabled={true}
          />
        )}

        {!disabledLocation.ward ? (
          <Autocomplete
            noOptionsText={"Không có lựa chọn phù hợp"}
            options={avaiableWards}
            sx={{ width: 300 }}
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
            value={searchQuery.ward}
            variant="outlined"
            disabled={true}
          />
        )}

        <Autocomplete
          noOptionsText={"Không có lựa chọn phù hợp"}
          options={availableVillages}
          sx={{ width: 300 }}
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

        <button>Tìm kiếm</button>
      </form>

      <div>
        <DataPagination />
      </div>
    </div>
  );
};

export default SearchCitizen;
