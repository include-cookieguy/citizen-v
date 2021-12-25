import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputCitizen from "../pages/InputCitizen";
import alertDelete from "../assets/alert-delete.jpg";
import { deleteDataAPI, putDataAPI } from "../utils/fetchData";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import greenTick from '../assets/green-tick.png';
import redX from '../assets/red-x.png'

const DataPagination = () => {
  const { citizen } = useSelector((state) => state);

  const [rowData, setRowData] = useState([]);

  const dispatch = useDispatch();

  const [alertMsg, setAlertMsg] = useState("");

  const [stateRender, setStateRender] = useState({
    isEditAccountModalOpen: false,
    handleEditAccountClose: false,

    isDeleteMsgOpen: false,
    isAfterDeleteMsgOpenSuccess: false,
    isAfterDeleteMsgOpenFail: false,
  });

  const [currentCitizen, setCurrentCitizen] = useState({});

  useEffect(() => {
    if (citizen.searchCitizensList) {
      const mapSearch = citizen.searchCitizensList.map((e, index) => ({
        ...e,
        _id: e._id,
        id: index + 1,
        city: e.location.city,
        district: e.location.district,
        ward: e.location.ward,
        village: e.location.village,
      }));
      setRowData(mapSearch);
    }
  }, [citizen.searchCitizensList]);

  const handleEditOpen = (curCitizen) => {
    setStateRender({
      ...stateRender,
      isEditAccountModalOpen: true,
    });

    const parseDob = curCitizen.dateOfBirth.split("/");

    const dobObject = new Date(+parseDob[2], parseDob[1] - 1, +parseDob[0]);

    setCurrentCitizen({
      ...curCitizen,
      dateOfBirth: dobObject.toString(),
      age:
        new Date().getFullYear() - parseInt(curCitizen.dateOfBirth.slice(-4)),
    });
  };

  const handleDeleteMsgOpen = (curCitizen) => {
    setStateRender({
      ...stateRender,
      isDeleteMsgOpen: true,
    });
    setCurrentCitizen(curCitizen);
  };

  const columns = [
    {
      field: "account",
      headerName: "Chỉnh sửa thông tin công dân",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ marginRight: "30px" }}
              onClick={() => handleEditOpen(params.row)}
            >
              Chỉnh sửa
            </Button>
            <Button
              style={{ color: "red" }}
              onClick={() => handleDeleteMsgOpen(params.row)}
            >
              Xóa
            </Button>
          </>
        );
      },
    },
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
      <Stack marginTop="200px" alignItems="center" justifyContent="center">
        Không có công dân nào phù hợp với yêu cầu
      </Stack>
    );
  }

  const handleEditAccountSubmit = async (curCitizen) => {
    const res = await putDataAPI(`citizen/${curCitizen.idCitizen}`, curCitizen);

    setCurrentCitizen(curCitizen);

    if (res.data.updated) {
      dispatch({
        type: GLOBALTYPES.GET_CITIZENS,
        payload: {
          searchCitizensList: citizen.searchCitizensList.map((e) =>
            e._id === res.data.updateCitizen._id ? res.data.updateCitizen : e
          ),
        },
      });
    }
  };

  const handleEditAccountClose = () => {
    setStateRender({
      ...stateRender,
      isEditAccountModalOpen: false,
    });
  };

  const handleDeleteMsgClose = () => {
    setStateRender({
      ...stateRender,
      isDeleteMsgOpen: false,
    });
  };

  const handleAfterDeleteCloseSuccess = () => {
    setStateRender({
      ...stateRender,
      isAfterDeleteMsgOpenSuccess: false,
    });
  };

  const handleAfterDeleteCloseFail = () => {
    setStateRender({
      ...stateRender,
      isAfterDeleteMsgOpenFail: false,
    });
  };

  const handleDelete = async () => {
    const res = await deleteDataAPI(`citizen/${currentCitizen._id}`);

    setAlertMsg(res.data.msg);

    res.data.deleted ? setStateRender({
      ...stateRender,
      isDeleteMsgOpen: false,
      isAfterDeleteMsgOpenSuccess: true,
    }) : setStateRender({
      ...stateRender,
      isDeleteMsgOpen: false,
      isAfterDeleteMsgOpenFail: true,
    });
  };

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
        disableSelectionOnClick={true}
      />

      <Dialog // Edit citizens dialog
        open={stateRender.isEditAccountModalOpen}
        onClose={handleEditAccountClose}
      >
        <DialogTitle>Chỉnh sửa thông tin công dân</DialogTitle>
        <DialogContent className='update-content'>
          <div className="form-update-citizens">
            <InputCitizen
              editable={true}
              currentCitizen={currentCitizen}
              updateCitizen={(newCitizen) =>
                handleEditAccountSubmit(newCitizen)
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button className="close" onClick={handleEditAccountClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog // Delete citizens dialog
        open={stateRender.isDeleteMsgOpen}
        onClose={handleDeleteMsgClose}
        className="dialog-delete"
      >
        <DialogContent>
          <div className="content-container">
            <div className="img-alert">
              <div>
                <img src={alertDelete} alt="delete" />
              </div>
            </div>
            <div className="msg-alert">
              <div>Bạn có chắc chắn muốn xóa công dân này không?</div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="button-action">
          <Button className="delete" onClick={handleDelete}>
            Tiếp tục xóa
          </Button>

          <Button className="close" onClick={handleDeleteMsgClose}>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog // After delete citizens dialog message => success
        open={stateRender.isAfterDeleteMsgOpenSuccess}
        onClose={handleAfterDeleteCloseSuccess}
        className="after-dialog-delete"
      >
        <DialogContent>
          <div className="content-container">
            <div className="img-alert">
              <div>
                <img src={greenTick} alt="print" />
              </div>
            </div>

            <div className="msg-alert">
              <div>{alertMsg}</div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="button-action">
          <Button className="close" onClick={handleAfterDeleteCloseSuccess}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog // After delete citizens dialog message => fail
        open={stateRender.isAfterDeleteMsgOpenFail}
        onClose={handleAfterDeleteCloseFail}
        className="after-dialog-delete"
      >
        <DialogContent>
          <div className="content-container">
            <div className="img-alert">
              <div>
                <img src={redX} alt="print" />
              </div>
            </div>

            <div className="msg-alert">
              <div>{alertMsg}</div>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="button-action">
          <Button className="close" onClick={handleAfterDeleteCloseFail}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default DataPagination;
