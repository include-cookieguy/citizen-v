import React, { useState } from "react";
import location from "../data/location.json";
import ethnic from "../data/ethnic.json";

const InputCitizen = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    city: "",
    district: "",
    ward: "",
  });
  const [selectedEthnic, setSelectedEthnic] = useState("");

  const availableDistrict = location.find(
    (c) => c.Name === selectedLocation.city
  );
  const availableWard = availableDistrict?.Districts?.find(
    (d) => d.Name === selectedLocation.district
  );

  const handleCity = (e) => {
    setSelectedLocation({
      ...selectedLocation,
      city: e.target.value,
      district: "",
      ward: "",
    });
  };

  const handleDistrict = (e) => {
    setSelectedLocation({
      ...selectedLocation,
      district: e.target.value,
      ward: "",
    });
  };

  return (
    <div className="input-citizen">
      <form>
        <div className="form-group">
          <label htmlFor="fullname">
            Họ và tên <span className="text-danger">{"(*)"}</span>
          </label>
          <input
            id="fullname"
            placeholder="Họ và tên"
            type="text"
            name="fullName"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dob">
            Ngày sinh <span className="text-danger">{"(*)"}</span>
          </label>
          <input type="date" id="dob" name="dateOfBirth"></input>
        </div>

        <div className="form-group">
          <label htmlFor="fullname">
            Giới tính <span className="text-danger">{"(*)"}</span>
          </label>
          <input></input>
        </div>

        <div>
          <label>Tỉnh/Thành phố</label>
          <select
            placeholder="Quận/Huyện"
            value={selectedLocation.city}
            onChange={handleCity}
          >
            <option>Tỉnh/Thành phố</option>
            {location.map((e, key) => {
              return (
                <option value={e.Name} key={key}>
                  {e.Name}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label>Quận/Huyện</label>
          <select
            placeholder="Quận/Huyện"
            value={selectedLocation.district}
            onChange={handleDistrict}
            disabled={selectedLocation.city ? false : true}
          >
            <option>Quận/Huyện</option>
            {availableDistrict?.Districts.map((e, key) => {
              return (
                <option value={e.Name} key={key}>
                  {e.Name}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label>Xã/Phường</label>
          <select
            placeholder="Xã/Phường"
            value={selectedLocation.ward}
            onChange={(e) =>
              setSelectedLocation({ ...selectedLocation, ward: e.target.value })
            }
            disabled={selectedLocation.district ? false : true}
          >
            <option>Xã/Phường</option>
            {availableWard?.Wards.map((e, key) => {
              return (
                <option value={e.Name} key={key}>
                  {e.Name}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label>Dân tộc</label>
          <select
            placeholder="Dân tộc"
            value={selectedEthnic}
            onChange={(e) => setSelectedEthnic(e.target.value)}
          >
            <option>Dân tộc</option>
            {ethnic.ethnic.map((value, key) => {
              return (
                <option value={value.Tên} key={key}>
                  {value.Tên}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fullname">
            Họ và tên <span className="text-danger">{"(*)"}</span>
          </label>
          <input id="fullname" placeholder="Họ và tên" type="text" />
        </div>

        <div className="form-group">
          <label htmlFor="fullname">
            Họ và tên <span className="text-danger">{"(*)"}</span>
          </label>
          <input id="fullname" placeholder="Họ và tên" type="text" />
        </div>

        <div className="form-group">
          <label htmlFor="fullname">
            Họ và tên <span className="text-danger">{"(*)"}</span>
          </label>
          <input id="fullname" placeholder="Họ và tên" type="text" />
        </div>
      </form>
    </div>
  );
};

export default InputCitizen;
