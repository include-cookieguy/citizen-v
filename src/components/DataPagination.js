import { Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DataPagination = () => {
  const { citizen } = useSelector((state) => state);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (citizen.searchCitizensList) {
      const mapSearch = citizen.searchCitizensList.map((e, index) => ({
        ...e,
        id: index + 1,
        city: e.location.city,
        district: e.location.district,
        ward: e.location.ward,
        village: e.location.village,
      }));
      setRowData(mapSearch);
    }
  }, [citizen.searchCitizensList]);

  const columns = [
    { field: "id", headerName: "STT", width: 80 },
    { field: "fullName", headerName: "Họ và tên", width: 250 },
    { field: "dateOfBirth", headerName: "Ngày sinh", width: 120 },
    {
      field: "gender",
      headerName: "Giới tính",
      width: 100,
      sortable: false,
    },
    {
      field: "identifiedCode",
      headerName: "CCCD/CMT",
      width: 160,
      sortable: false,
    },
    {
      field: "ethnic",
      headerName: "Dân tộc",
      width: 160,
    },
    {
      field: "religion",
      headerName: "Tôn giáo",
      width: 170,
    },
    {
      field: "city",
      headerName: "Tỉnh/Thành Phố",
      width: 200,
    },
    {
      field: "district",
      headerName: "Quận/Huyện",
      width: 200,
    },
    {
      field: "ward",
      headerName: "Xã/Phường",
      width: 200,
    },
    {
      field: "village",
      headerName: "Thôn/Xóm/Ấp/Khu",
      width: 220,
    },
    {
      field: "residentAddress",
      headerName: "Địa chỉ thường trú",
      width: 550,
    },
    {
      field: "currentAddress",
      headerName: "Địa chỉ tạm trú",
      width: 550,
      sortable: false,
    },
    {
      field: "educationLevel",
      headerName: "Trình độ học vấn",
      width: 150,
    },
    {
      field: "occupation",
      headerName: "Nghề nghiệp",
      width: 160,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 160,
      sortable: false,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      sortable: false,
    },
  ];

  function NoRowsOverlay() {
    return (
      <Stack marginTop='200px' alignItems="center" justifyContent="center">
        Không có công dân nào phù hợp với yêu cầu
      </Stack>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight
        rows={rowData}
        columns={columns}
        components={{ NoRowsOverlay }}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
      />
    </div>
  );
};

export default DataPagination;
