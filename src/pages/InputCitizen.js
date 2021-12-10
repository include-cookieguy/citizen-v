import React, { useMemo, useState } from "react";
import locationData from "../data/location.json";
import ethnic from "../data/ethnic.json";
import { postDataAPI } from "../utils/fetchData";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  TextField,
  Autocomplete,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import moment from "moment";
import { validateCitizen } from "../utils/validateCitizen";
import logoDepartment from "../assets/department-citizen.png";
import vnLocale from "../data/formatVietnamMonth";

const InputCitizen = () => {
  // alert submit
  const [open, setOpen] = useState(false);
  const handleOpenAlert = () => {
    setOpen(true);
  };
  const handleCloseAlert = () => {
    setOpen(false);
  };

  const [alertMsg, setAlertMsg] = useState("");

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
    residentAddress: "",
    educationLevel: "",
    city: "",
    district: "",
    ward: "",
    village: "",
    ethnic: "",
    age: 0,
    //  Key
    city_key: true,
    district_key: true,
    ward_key: true,
  });

  const [errBlur, setErrBlur] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    identifiedCode: "",
    city: "",
    district: "",
    ward: "",
    ethnic: "",
    occupation: "",
    phoneNumber: "",
    email: "",
    religion: "",
    currentAddress: "",
    residentAddress: "",
    educationLevel: "",
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
          if (citizenInfo.age > 15) {
            setErrBlur({
              ...errBlur,
              [type]:
                "Vui lòng nhập căn cước công dân/chứng minh thư của công dân.",
            });
          }
          break;
        case "ethnic":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn dân tộc của công dân.",
          });
          break;
        case "occupation":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập nghề nghiệp của công dân.",
          });
          break;
        case "religion":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng chọn tôn giáo của công dân.",
          });
          break;
        case "currentAddress":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập địa chỉ tạm trú của công dân.",
          });
          break;
        case "residentAddress":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập địa chỉ thường trú của công dân.",
          });
          break;
        case "educationLevel":
          setErrBlur({
            ...errBlur,
            [type]: "Vui lòng nhập trình độ học vấn của công dân.",
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

  function printImage() {
    const image = document.querySelector(".form-nhap");
    const printWindow = window.open("", "Print Window", "height=400,width=600");
    printWindow.document.write("<html><head><title>Print Window</title>");
    printWindow.document.write("</head><body ><img src='");
    printWindow.document.write(image.src);
    printWindow.document.write("' /></body></html>");
    printWindow.document.close();
    printWindow.print();
  }

  function validateID(ID) {
    const re = /^!*(\d!*){9,}$/;
    return re.test(ID);
  }

  const handleBlurInput = (type) => {
    setErrBlur({ ...errBlur, [type]: "" });
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    if (name === "educationLevel") {
      let splash = value;
      if (splash.length === 2) {
        splash += "/12";
      }
      setCitizenInfo({ ...citizenInfo, [name]: splash });
    } else {
      setCitizenInfo({
        ...citizenInfo,
        [name]: value,
      });
    }
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

      const finalInfo = {
        ...citizenInfo,
        dateOfBirth: moment(citizenInfo.dateOfBirth).format("DD/MM/YYYY"),
        location,
      };

      console.log(finalInfo);
      const res = await postDataAPI("citizen", finalInfo, auth.token);

      setAlertMsg(res.data.msg);

      handleOpenAlert();
    }
  };

  return (
    <div className="input-citizen">
      <Dialog // notification
        open={open}
        onClose
      >
        <DialogContent
          style={{
            width: "100%",
            display: "flex",
            fontSize: "x-large",
            fontWeight: 400,
          }}
        >
          {alertMsg}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAlert}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <div className="title-logo">
        <div className="header-form">
          <div className="ministry">BỘ Y TẾ</div>
          <div className="department">TỔNG CỤC DÂN SỐ</div>
        </div>
        <div className="logo">
          <img src={logoDepartment} alt="logo of department" />
        </div>
        <div className="title">PHIẾU ĐIỀN THÔNG TIN CỦA CÔNG DÂN</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="print" onClick={() => printImage()}>
          <FontAwesomeIcon icon={faPrint} /> In phiếu điền
        </div>
        <img
          src="https://res.cloudinary.com/dyywecvyl/image/upload/v1639054815/samples/Phi%E1%BA%BFu_%C4%91i%E1%BB%81n_th%C3%B4ng_tin_c%C3%B4ng_d%C3%A2n_1_dyjy8c.png"
          alt="form-nhap"
          className="form-nhap"
          style={{ display: "none" }}
        />
        <Box
          sx={{
            "& .MuiTextField-root": { m: 1 },
          }}
        >
          <div className="field fullname">
            <label className="label-text">
              Họ và tên <span>{"(*)"}</span>
            </label>
            <TextField
              error={errBlur.fullName ? true : false}
              placeholder="Ví dụ: Nguyễn Văn A"
              name="fullName"
              sx={{ width: "100%" }}
              value={citizenInfo.fullName}
              onChange={handleInput}
              onBlur={() => handleBlur("fullName")}
              onInput={() => handleBlurInput("fullName")}
              helperText={errBlur.fullName}
            />
          </div>

          <div className="field date-of-birth">
            <label className="label-text">
              Ngày sinh <span>{"(*)"}</span>
            </label>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={vnLocale}
            >
              <DatePicker
                disableFuture
                placeholder="dd/mm/yyyy"
                openTo="year"
                inputFormat="dd/MM/yyyy"
                views={["year", "month", "day"]}
                value={citizenInfo.dateOfBirth}
                // onError={() =>
                //   setErrBlur({
                //     ...errBlur,
                //     dateOfBirth: "Ngày/tháng/năm sinh không hợp lệ.",
                //   })
                // }
                onChange={(newValue) => {
                  setCitizenInfo({
                    ...citizenInfo,
                    dateOfBirth: newValue,
                    age: new Date().getFullYear() - newValue.getFullYear(),
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
                    sx={{ width: "100%" }}
                    error={errBlur.dateOfBirth ? true : false}
                    onBlur={() => handleBlur("dateOfBirth")}
                    onInput={() => handleBlurInput("dateOfBirth")}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          <div className="field gender">
            <label className="label-text">
              Giới tính <span>{"(*)"}</span>
            </label>
            <Autocomplete
              disablePortal
              noOptionsText={"Không có lựa chọn phù hợp"}
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

          <div className="field identified-code">
            <label className="label-text">
              Căn cước công dân/Chứng minh thư{" "}
              {citizenInfo.age > 15 && <span>{"(*)"}</span>}
            </label>
            <TextField
              placeholder={
                citizenInfo.age > 15
                  ? "Ví dụ: 123456789101"
                  : "Công dân chưa đủ tuổi để sở hữu CCCD/CMT"
              }
              helperText={citizenInfo.age > 15 && errBlur.identifiedCode}
              name="identifiedCode"
              sx={{ width: "100%" }}
              onChange={handleInput}
              disabled={citizenInfo.age < 15 ? true : false}
              error={errBlur.identifiedCode ? true : false}
              onBlur={() => handleBlur("identifiedCode")}
              onInput={() => handleBlurInput("identifiedCode")}
            />
          </div>

          <div className="field ethnic">
            <label className="label-text">
              Dân tộc <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Không có lựa chọn phù hợp"}
              disablePortal
              options={ethnic.ethnic}
              onBlur={() => handleBlur("ethnic")}
              sx={{ width: 300 }}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, ethnic: newInput });
                setErrBlur({
                  ...errBlur,
                  ethnic: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ví dụ: Kinh"
                  helperText={errBlur.ethnic}
                  error={errBlur.ethnic ? true : false}
                />
              )}
            />
          </div>

          <div className="field religion">
            <label className="label-text">
              Tôn giáo <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Không có lựa chọn phù hợp"}
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
              onBlur={() => handleBlur("religion")}
              onInputChange={(e, newInput) => {
                setCitizenInfo({ ...citizenInfo, religion: newInput });
                setErrBlur({
                  ...errBlur,
                  religion: "",
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ví dụ: Không"
                  helperText={errBlur.religion}
                  error={errBlur.religion ? true : false}
                />
              )}
            />
          </div>

          <div className="field province">
            <label className="label-text">
              Tỉnh/Thành phố <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Không có lựa chọn phù hợp"}
              disablePortal
              options={locationData}
              sx={{ width: 300 }}
              key={citizenInfo.city_key + "city"}
              onBlur={() => handleBlur("city")}
              clearText="Xoá"
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  city: newInput,
                  district: "",
                  ward: "",
                  district_key: !citizenInfo.district_key,
                  ward_key: !citizenInfo.ward_key,
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
          </div>

          <div className="field district">
            <label className="label-text">
              Quận/Huyện <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Không có lựa chọn phù hợp"}
              disablePortal
              options={availableDistricts}
              key={citizenInfo.district_key + "district"}
              sx={{ width: 300 }}
              disabled={citizenInfo.city ? false : true}
              onInputChange={(e, newInput) => {
                console.log(newInput);
                setCitizenInfo({
                  ...citizenInfo,
                  district: newInput,
                  ward: "",
                  ward_key: !citizenInfo.ward_key,
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
          </div>

          <div className="field ward">
            <label className="label-text">
              Xã/Phường <span>{"(*)"}</span>
            </label>
            <Autocomplete
              noOptionsText={"Không có lựa chọn phù hợp"}
              disablePortal
              options={avaiableWards}
              key={citizenInfo.ward_key}
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

          <div className="field village">
            <label className="label-text">Thôn/Xóm/Khu/Ấp</label>
            <TextField
              placeholder="Ví dụ: Ấp Thạnh Vinh"
              name="village"
              sx={{ width: "100%" }}
              onChange={(e) =>
                setCitizenInfo({
                  ...citizenInfo,
                  village: e.target.value,
                })
              }
            />
          </div>

          <div className="field current-address">
            <label className="label-text">
              Địa chỉ thường trú <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("residentAddress")}
              onInput={() => handleBlurInput("residentAddress")}
              error={errBlur.residentAddress ? true : false}
              helperText={errBlur.residentAddress}
              className="ta dang o dau"
              placeholder="Số nhà - Thôn/Xóm/Khu/Ấp - Xã/Phường - Quận/Huyện - Tỉnh/Thành Phố"
              name="residentAddress"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field temp-address">
            <label className="label-text">
              Địa chỉ tạm trú <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("currentAddress")}
              onInput={() => handleBlurInput("currentAddress")}
              error={errBlur.currentAddress ? true : false}
              helperText={errBlur.currentAddress}
              className="ta dang o dau"
              placeholder="Số nhà - Thôn/Xóm/Khu/Ấp - Xã/Phường - Quận/Huyện - Tỉnh/Thành Phố"
              name="currentAddress"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field academic-level">
            <label className="label-text">
              Trình độ học vấn <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("educationLevel")}
              onInput={() => handleBlurInput("educationLevel")}
              error={errBlur.educationLevel ? true : false}
              helperText={errBlur.educationLevel}
              value={citizenInfo.educationLevel}
              placeholder="Ví dụ: 12/12"
              name="educationLevel"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field occupation">
            <label className="label-text">
              Nghề nghiệp <span>{"(*)"}</span>
            </label>
            <TextField
              onBlur={() => handleBlur("occupation")}
              onInput={() => handleBlurInput("occupation")}
              error={errBlur.occupation ? true : false}
              helperText={errBlur.occupation}
              placeholder="Ví dụ: Lập trình viên"
              name="occupation"
              sx={{ width: "100%" }}
              onChange={handleInput}
            />
          </div>

          <div className="field phone">
            <label className="label-text">Số điện thoại</label>
            <TextField
              placeholder="Ví dụ: 0123456789"
              name="phoneNumber"
              sx={{ width: "100%" }}
              onChange={handleInput}
              helperText={errBlur.phoneNumber}
              error={errBlur.phoneNumber ? true : false}
            />
          </div>

          <div className="field email">
            <label className="label-text">Email</label>
            <TextField
              placeholder="Ví dụ: nguyenvana@gmail.com"
              helperText={errBlur.email}
              sx={{ width: "100%" }}
              error={errBlur.email ? true : false}
              name="email"
              onChange={handleInput}
            />
          </div>
        </Box>

        <div className="submit">
          <div>
            <button className="submit-button">Gửi dữ liệu</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputCitizen;
