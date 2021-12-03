import React, { useMemo, useState } from "react";
import locationData from "../data/location.json";
import ethnic from "../data/ethnic.json";
import { postDataAPI } from "../utils/fetchData";
import { useSelector } from "react-redux";
import { Box, TextField, Autocomplete } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import moment from "moment";
import { validateCitizen } from "../utils/validateCitizen";

const InputCitizen = () => {
  const { auth } = useSelector((state) => state);
  const [citizenInfo, setCitizenInfo] = useState({
    fullName: "",
    dateOfBirth: new Date(),
    currentAddress: "",
    gender: "",
    email: "",
    phoneNumber: "",
    identifiedCode: "",
    occupation: "",
    religion: "",
    city: "",
    district: "",
    ward: "",
    village: "",
    ethnic: "",
  });

  const [errBlur, setErrBlur] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    identifiedCode: "",
    city: "",
    district: "",
    ward: "",
    phoneNumber: "",
    email: "",
  });

  const availableDistricts = useMemo(() => {
    if (citizenInfo.city) {
      const res = locationData.find((e) => e.label === citizenInfo.city);

      if (res) {
        return res.Districts;
      }
    }
  }, [citizenInfo.city]);

  const avaiableWards = useMemo(() => {
    if (citizenInfo.city && citizenInfo.district && availableDistricts) {
      const res = availableDistricts.find(
        (e) => e.label === citizenInfo.district
      );

      if (res) {
        return res.Wards;
      }
    }
  }, [citizenInfo.city, citizenInfo.district, availableDistricts]);

  const handleBlur = (type) => {
    if (!citizenInfo[type]) {
      switch (type) {
        case "fullName":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập họ và tên của công dân.",
          });

          break;
        case "dateOfBirth":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập ngày sinh của công dân.",
          });
          break;
        case "gender":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn giới tính của công dân.",
          });
          break;
        case "identifiedCode":
          setErrBlur({
            ...errBlur,
            [type]:
              "Vui lòng nhập căn cước công dân/chứng minh thư của công dân.",
          });
          break;

        case "city":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn Tỉnh/Thành phố của công dân.",
          });
          break;

        case "district":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn Quận/Huyện của công dân.",
          });
          break;

        case "ward":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn Xã/Phường của công dân.",
          });
          break;

        default:
          break;
      }
    } else if (type === "fullName" && citizenInfo[type]) {
      let replaceSpace = citizenInfo.fullName;

      console.log(replaceSpace);

      replaceSpace = replaceSpace.replace(/\s+/g, " ").trim();

      const capitals = replaceSpace
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

      setCitizenInfo({ ...citizenInfo, fullName: capitals.join(" ") });
    } else if (type === "identifiedCode" && !validateID(citizenInfo[type])) {
      setErrBlur({
        ...errBlur,
        identifiedCode:
          "CCCD/CMT của công dân chỉ được chứ các số và phải chứa ít nhất 9 số.",
      });
    }
  };

  function validateID(ID) {
    const re = /^!*(\d!*){9,}$/;
    return re.test(ID);
  }

  const handleBlurInput = (type) => {
    setErrBlur({ ...errBlur, [type]: "" });
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    setCitizenInfo({
      ...citizenInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { city, district, ward, village } = citizenInfo;

    const check = validateCitizen(citizenInfo);
    if (check.errLength > 0) {
      setErrBlur(check.errMsg);
    } else {
      const location = {
        city,
        district,
        ward,
        village,
      };

      delete citizenInfo.city;
      delete citizenInfo.district;
      delete citizenInfo.ward;
      delete citizenInfo.village;

      const finalInfo = {
        ...citizenInfo,
        dateOfBirth: moment(citizenInfo.dateOfBirth).format("DD/MM/YYYY"),
        location,
      };
      const res = await postDataAPI("citizen", finalInfo, auth.token);

      console.log(res.data);
    }
  };

  return (
    <div className="input-citizen">
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <div>
            <label className="label-text">
              Họ và tên <span>{"(*)"}</span>
            </label>
            <TextField
              error={errBlur.fullName ? true : false}
              placeholder="Ví dụ: Nguyễn Văn A"
              name="fullName"
              value={citizenInfo.fullName}
              onChange={handleInput}
              onBlur={() => handleBlur("fullName")}
              onInput={() => handleBlurInput("fullName")}
              helperText={errBlur.fullName}
            />

            <label className="label-text">
              Ngày sinh <span>{"(*)"}</span>
            </label>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disableFuture
                placeholder="dd/mm/yyyy"
                openTo="year"
                inputFormat="dd/MM/yyyy"
                views={["year", "month", "day"]}
                value={citizenInfo.dateOfBirth}
                onChange={(newValue) => {
                  setCitizenInfo({
                    ...citizenInfo,
                    dateOfBirth: newValue,
                  });

                  setErrBlur({
                    ...errBlur,
                    dateOfBirth: "",
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    helperText={errBlur.dateOfBirth}
                    error={errBlur.dateOfBirth ? true : false}
                    onBlur={() => handleBlur("dateOfBirth")}
                    onInput={() => handleBlurInput("dateOfBirth")}
                  />
                )}
              />
            </LocalizationProvider>

            <label className="label-text">
              Giới tính <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              options={["Nam", "Nữ"]}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, gender: newInput });
                setErrBlur({ ...errBlur, gender: "" });
              }}
              onBlur={() => handleBlur("gender")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Nam/Nữ"
                  helperText={errBlur.gender}
                  error={errBlur.gender ? true : false}
                />
              )}
            />
          </div>

          <label className="label-text">
            Căn cước công dân/Chứng minh thư <span>{"(*)"}</span>
          </label>
          <div>
            <TextField
              placeholder="Ví dụ: 123456789101"
              helperText={errBlur.identifiedCode}
              name="identifiedCode"
              onChange={handleInput}
              error={errBlur.identifiedCode ? true : false}
              onBlur={() => handleBlur("identifiedCode")}
              onInput={() => handleBlurInput("identifiedCode")}
            />

            <label className="label-text">Số điện thoại</label>
            <TextField
              placeholder="Ví dụ: 0123456789"
              name="phoneNumber"
              onChange={handleInput}
              helperText={errBlur.phoneNumber}
              error={errBlur.phoneNumber ? true : false}
            />

            <label className="label-text">Email</label>
            <TextField
              placeholder="Ví dụ: nguyenvana@gmail.com"
              helperText={errBlur.email}
              sx={{ width: 300 }}
              error={errBlur.email ? true : false}
              name="email"
              onChange={handleInput}
            />
          </div>

          <div>
            <label className="label-text">
              Tỉnh/Thành phố <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              options={locationData}
              sx={{ width: 300 }}
              key={citizenInfo.city + "city"}
              onBlur={() => handleBlur("city")}
              clearText="Xoá"
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  city: newInput,
                  district: "",
                  ward: "",
                });

                setErrBlur({
                  ...errBlur,
                  city: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ví dụ: Thành phố Hà Nội"
                  helperText={errBlur.city}
                  error={errBlur.city ? true : false}
                />
              )}
            />
            <label className="label-text">
              Quận/Huyện <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              options={availableDistricts}
              key={citizenInfo.district + "district"}
              sx={{ width: 300 }}
              disabled={citizenInfo.city ? false : true}
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  district: newInput,
                  ward: "",
                });
                setErrBlur({
                  ...errBlur,
                  district: "",
                });
              }}
              onBlur={() => handleBlur("district")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ví dụ: Quận Ba Đình"
                  helperText={errBlur.district}
                  error={errBlur.district ? true : false}
                />
              )}
            />
            <label className="label-text">
              Xã/Phường <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              options={avaiableWards}
              key={citizenInfo.ward}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, ward: newInput });
                setErrBlur({
                  ...errBlur,
                  ward: "",
                });
              }}
              onBlur={() => handleBlur("ward")}
              disabled={citizenInfo.district ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ví dụ: Phường Phúc Xá"
                  helperText={errBlur.ward}
                  error={errBlur.ward ? true : false}
                />
              )}
            />
          </div>

          <label className="label-text">Thôn/Xóm/Khu/Ấp</label>
          <TextField
            placeholder="Ví dụ: Ấp Thạnh Vinh"
            name="village"
            onChange={(e) =>
              setCitizenInfo({
                ...citizenInfo,
                village: e.target.value,
              })
            }
          />

          <label className="label-text">Nghề nghiệp</label>
          <TextField
            placeholder="Ví dụ: Lập trình viên"
            name="occupation"
            onChange={handleInput}
          />

          <label className="label-text">Địa chỉ hiện tại</label>
          <TextField
            placeholder="Số nhà - Thôn/Xóm/Khu/Ấp - Xã/Phường - Quận/Huyện - Tỉnh/Thành Phố"
            name="currentAddress"
            sx={{ width: 600 }}
            onChange={handleInput}
          />

          <label className="label-text">Dân tộc</label>
          <Autocomplete
            disablePortal
            options={ethnic.ethnic}
            sx={{ width: 300 }}
            onInputChange={(e, newInput) =>
              setCitizenInfo({ ...citizenInfo, ethnic: newInput })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Ví dụ: Kinh" />
            )}
          />

          <label className="label-text">Tôn giáo</label>
          <Autocomplete
            disablePortal
            options={[
              "Không",
              "Phật giáo",
              "Công giáo",
              "Tin Lành",
              "Hoà Hảo",
              "Hồi giáo",
              "Bà-la-môn",
              "Cao Đài",
            ]}
            sx={{ width: 300 }}
            onChange={(e, newInput) =>
              setCitizenInfo({ ...citizenInfo, religion: newInput })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Không" />
            )}
          />
        </Box>
        <button className="submit-button">Gửi dữ liệu</button>
      </form>
    </div>
  );
};

export default InputCitizen;
