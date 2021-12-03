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
        id: index,
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
      width: 200,
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
    {
      field: "occupation",
      headerName: "Nghề nghiệp",
      width: 160,
    },
    {
      field: "currentAddress",
      headerName: "Địa chỉ hiện tại",
      width: 400,
      sortable: false,
    },
    {
      field: "ethnic",
      headerName: "Dân tộc",
      width: 100,
    },
    {
      field: "religion",
      headerName: "Tôn giáo",
      width: 120,
    },
  ];

  function NoRowsOverlay() {
    return (
      <Stack height="100%" alignItems="center" justifyContent="center">
        Không có công dân nào phù hợp với yêu cầu
      </Stack>
    );
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rowData}
        columns={columns}
        components={{ NoRowsOverlay }}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
      />
    </div>
  );
};

export default DataPagination;
