import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataPagination from "../components/DataPagination";
import { searchCitizens } from "../redux/actions/citizenAction";

const SearchCitizen = () => {
  const [searchQuery, setSearchQuery] = useState({
    fullName: "",
    dateOfBirth: "",
    currentAddress: "",
    gender: "",
    email: "",
    occupation: "",
    ethnic: "",
    religion: "",
    location: {
      city: "",
      district: "",
      ward: "",
    },
  });

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

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
      <form onSubmit={handleSubmitSearch}>
        <input
          type="text"
          placeholder="Họ và tên"
          name="fullName"
          onChange={handleSearchQuery}
        />
        <input
          type="text"
          placeholder="Tỉnh/Thành Phố"
          onChange={(e) =>
            setSearchQuery({
              ...searchQuery,
              location: { ...searchQuery.location, city: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Quận/Huyện"
          onChange={(e) =>
            setSearchQuery({
              ...searchQuery,
              location: { ...searchQuery.location, district: e.target.value },
            })
          }
        />
        <input
          type="text"
          placeholder="Phuờng/Xã"
          onChange={(e) =>
            setSearchQuery({
              ...searchQuery,
              location: { ...searchQuery.location, ward: e.target.value },
            })
          }
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
