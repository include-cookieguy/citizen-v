export const validateCitizen = (info) => {
  const {
    fullName,
    dateOfBirth,
    email,
    phoneNumber,
    identifiedCode,
    gender,
    city,
    district,
    ward,
  } = info;

  console.log(info);

  const err = {};

  if (!fullName) {
    err.fullName = "Vui lòng nhập họ và tên của công dân.";
  } else if (!validateFullName(fullName)) {
    err.fullName =
      "Họ và tên của công dân chỉ được chứa ký tự là chữ in hoa hoặc chữ thường.";
  }

  if (!validateEmail(email) && email) {
    err.email = "Email của công dân không đúng định dạng.";
  }

  if (!dateOfBirth) {
    err.dateOfBirth = "Vui lòng nhập ngày sinh của công dân.";
  }

  if (!city) {
    err.city = "Vui lòng chọn Tỉnh/Thành phố của công dân.";
  }

  if (!district) {
    err.district = "Vui lòng chọn Quận/Huyện của công dân.";
  }

  if (!ward) {
    err.ward = "Vui lòng chọn Xã/Phường của công dân.";
  }

  if (!gender) {
    err.gender = "Vui lòng chọn giới tính của công dân.";
  }

  if (!validatePhoneNumber(phoneNumber) && phoneNumber) {
    err.phoneNumber =
      "Số điện thoại của công dân chỉ được chứ các số và phải chứa ít nhất 10 số.";
  }

  if (!identifiedCode) {
    err.identifiedCode =
      "Vui lòng nhập căn cước công dân/chứng minh thư của công dân.";
  } else if (!validateID(identifiedCode)) {
    err.identifiedCode =
      "CCCD/CMT của công dân chỉ được chứ các số và phải chứa ít nhất 9 số.";
  }

  return {
    errMsg: err,
    errLength: Object.keys(err).length,
  };
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateFullName(fullName) {
  const re = /^([^0-9]*)$/;
  const re_second = /^([^!<>?=+@{}_$%]*)$/;
  return re.test(fullName) && re_second.test(fullName);
}

function validatePhoneNumber(phoneNumber) {
  const re = /^!*(\d!*){10,}$/;
  return re.test(phoneNumber);
}

function validateID(ID) {
  const re = /^!*(\d!*){9,}$/;
  return re.test(ID);
}
