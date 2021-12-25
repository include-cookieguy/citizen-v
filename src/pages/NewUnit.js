import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  DialogContent,
  Dialog,
  DialogTitle,
  DialogActions,
  Autocomplete,
  TextField,
  Switch,
  Stack,
} from "@mui/material";

import {
  getChildUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../redux/actions/unitAction";
import {
  createUser,
  getChildUser,
  updateUserById,
  getOptions,
} from "../redux/actions/userAction";

import alertDelete from "../assets/alert-delete.jpg";

export default function NewUnit() {
  const initState = {
    loading: false,

    // Dropdown options
    select: [],
    cSelect: [],

    // Modal
    isModalOpen: false,
    isEditModalOpen: false,
    isAccountModalOpen: false,
    isEditAccountModalOpen: false,

    // New Unit
    newUnit: null,
    newUnitCode: null,

    // Edit Unit
    editUnit: null,
    editUnitCode: null,
    editUnitId: null,

    //  New Account
    newUsername: null,
    newPassword: null,

    //  Edit Account
    editUser: null,
    editUsername: null,
    editPassword: null,
    editStartTime: null,
    editEndTime: null,
    editActive: null,

    // Delete Unit
    deleteId: 0,
    isDeleteMsgOpen: false,
  };
  const [state, setState] = useState(initState);

  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket);

  useEffect(async () => {
    setState({ ...state, loading: true });
    await dispatch(getChildUnit());
    await dispatch(getChildUser());
    setState({ ...state, loading: false });
    let options = (await getOptions()) || [];
    let cOptions = options.map((x) => ({ label: x }));
    setState({ ...state, select: options, cSelect: cOptions });
  }, []);

  const regency = useSelector((state) => state.auth.user.regency);

  let cRows = useSelector((state) => {
    console.log("all unit: ", state.unit.allUnit);
    return state.unit.allUnit.map((u, idx) => ({
      id: idx + 1,
      _id: u._id,
      name: u.nameOfUnit,
      code: u.code,
      status: u.status === true ? "Đã hoàn thành" : "Chưa hoàn thành",
    }));
  });
  let cChildUser = useSelector((state) => state.user.allUser);

  //  Compute select
  const computedSelect = async (temp) => {
    let cTemp = await Promise.all(temp.map((x) => ({ label: x })));
    setState({ ...state, select: temp });
    setState({ ...state, cSelect: cTemp });
  };

  //  New Unit handler
  const handleOpen = () => setState({ ...state, isModalOpen: true });
  const handleClose = () => setState({ ...state, isModalOpen: false });
  const handleUnit = (e, v) => {
    setState({ ...state, newUnit: (v || {}).label });
  };
  const handleKeydownUnit = (e) => {
    if (e.keyCode === 13) {
      let temp = state.select;
      if (!temp.includes(e.target.value)) {
        temp.push(e.target.value);
      }
      computedSelect(temp);
      setState({ ...state, newUnit: e.target.value });
    }
  };
  const handleCode = (e) => {
    setState({ ...state, newUnitCode: e.target.value });
  };
  const handleSubmit = () => {
    dispatch(
      createUnit({ nameOfUnit: state.newUnit, code: state.newUnitCode })
    );
    handleClose();
  };

  //  New Account handler
  const handleAccountOpen = (row) =>
    setState({ ...state, isAccountModalOpen: true, newUsername: row.code });
  const handleAccountClose = () =>
    setState({ ...state, isAccountModalOpen: false });
  const handleUsername = (e) =>
    setState({ ...state, newUsername: e.target.value });
  const handlePassword = (e) =>
    setState({ ...state, newPassword: e.target.value });
  const handleAccountSubmit = () => {
    dispatch(
      createUser({ username: state.newUsername, password: state.newPassword })
    );
    handleAccountClose();
  };

  //  Edit Unit handler
  const handleEditOpen = (params) => {
    setState({
      ...state,
      isEditModalOpen: true,
      editUnit: params.name,
      editUnitCode: params.code,
      editUnitId: params._id,
    });
  };
  const handleEditClose = () => setState({ ...state, isEditModalOpen: false });
  const handleEditCode = (e) => {
    setState({ ...state, editUnitCode: e.target.value });
  };
  const handleEditSubmit = () => {
    dispatch(
      updateUnit({
        _id: state.editUnitId,
        nameOfUnit: state.editUnit,
        code: state.editUnitCode,
      })
    );
    handleEditClose();
  };

  //  Edit Account handler
  const handleEditAccountOpen = (row) => {
    let user = cChildUser.filter((u) => u.username === row.code)[0];
    console.log(user.startTime);
    console.log(user.endTime);
    user.startTime = new Date(parseInt(user.startTime) || new Date().getTime())
      .toISOString()
      .split(".")[0];
    user.endTime = new Date(parseInt(user.endTime) || new Date().getTime())
      .toISOString()
      .split(".")[0];
    // user.startTime = '2021-12-26T04:17:00'
    // user.endTime = '2021-12-26T04:17:00'
    setState({
      ...state,
      isEditAccountModalOpen: true,
      editUser: user,
      editUsername: user.username,
      editActive: user.active,
      editStartTime: user.startTime,
      editEndTime: user.endTime,
    });
  };
  const handleEditAccountClose = () =>
    setState({ ...state, isEditAccountModalOpen: false });
  const handleEditUsername = (e) =>
    setState({ ...state, editUsername: e.target.value });
  const handleEditPassword = (e) =>
    setState({ ...state, editPassword: e.target.value });
  const handleEditActive = () =>
    setState({ ...state, editActive: !state.editActive });
  const handleEditStartTime = (e) =>
    setState({ ...state, editStartTime: e.target.value });
  const handleEditEndtTime = (e) => {
    console.log(e.target.value);
    setState({ ...state, editEndTime: e.target.value });
  };
  const handleEditAccountSubmit = () => {
    dispatch(
      updateUserById(socket, {
        _id: state.editUser._id,
        newPassword: state.editPassword,
        active: state.editActive,
        startTime: state.editStartTime,
        endTime: state.editEndTime,
      })
    );
    handleEditAccountClose();
  };

  //  Delete Unit handler
  const handleDeleteMsgOpen = ({ _id }) =>
    setState({ ...state, isDeleteMsgOpen: true, deleteId: _id });

  const handleDeleteMsgClose = () =>
    setState({ ...state, isDeleteMsgOpen: false });

  const handleDelete = () => {
    dispatch(
      deleteUnit({
        _id: state.deleteId,
      })
    );
    setState({ ...state, isDeleteMsgOpen: false });
  };

  const columns = [
    { field: "id", headerName: "STT", flex: 80, minWidth: 62 },
    { field: "name", headerName: "Tên đơn vị", flex: 300, minWidth: 231 },
    { field: "code", headerName: "Mã đơn vị", flex: 100, minWidth: 100 },
    {
      field: "account",
      headerName: "Tài khoản đơn vị",
      flex: 200,
      minWidth: 154,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter((u) => u.username === params.row.code)[0];
        return (
          <>
            {user && (
              <Button onClick={() => handleEditAccountOpen(params.row)}>
                Chỉnh sửa
              </Button>
            )}
            {!user && (
              <Button onClick={() => handleAccountOpen(params.row)}>
                Tạo mới
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Quản lý mã đơn vị",
      flex: 250,
      minWidth: 192,
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
  ];

  const A3_columns = [
    { field: "id", headerName: "STT", flex: 80, minWidth: 62 },
    { field: "name", headerName: "Tên đơn vị", flex: 300, minWidth: 231 },
    { field: "code", headerName: "Mã đơn vị", flex: 100, minWidth: 100 },
    {
      field: "status",
      headerName: "Trạng thái khai báo",
      flex: 100,
      minWidth: 150,
    },
    {
      field: "account",
      headerName: "Tài khoản đơn vị",
      flex: 200,
      minWidth: 154,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter((u) => u.username === params.row.code)[0];
        return (
          <>
            {user && (
              <Button onClick={() => handleEditAccountOpen(params.row)}>
                Chỉnh sửa
              </Button>
            )}
            {!user && (
              <Button onClick={() => handleAccountOpen(params.row)}>
                Tạo mới
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerName: "Quản lý mã đơn vị",
      flex: 250,
      minWidth: 192,
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
  ];

  function NoRowsOverlay() {
    return (
      <Stack marginTop="200px" alignItems="center" justifyContent="center">
        Chưa có đơn vị nào được khai báo
      </Stack>
    );
  }

  return (
    <>
      <div className="newUnit-body">
        <div className="header">
          <div className="header-title">
            <div>Danh sách các đơn vị</div>
          </div>

          <div className="button-new-unit">
            <Button style={{ border: "1px solid" }} onClick={handleOpen}>
              Khai báo và cấp mã
            </Button>
          </div>
        </div>

        <Dialog // New Unit dialog
          open={state.isModalOpen}
          onClose={handleClose}
        >
          <DialogTitle>Khai báo và cấp mã</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 300, display: "flex" }}
          >
            <Autocomplete
              disablePortal
              onChange={handleUnit}
              onKeyDown={handleKeydownUnit}
              options={state.cSelect}
              sx={{ width: 300, marginTop: "10px" }}
              renderInput={(params) => (
                <TextField {...params} label="Tên đơn vị" />
              )}
            />
            <TextField
              label="Mã đơn vị"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              onChange={handleCode}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button className="create" onClick={handleSubmit}>
              Cấp mã
            </Button>
            <Button className="close" onClick={handleClose}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Edit Unit dialog
          open={state.isEditModalOpen}
          onClose={handleEditClose}
          className="dialog-edit-code"
        >
          <DialogTitle>Chỉnh sửa mã đơn vị</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 250, display: "flex" }}
          >
            <TextField
              label="Tên đơn vị"
              variant="outlined"
              style={{ marginTop: "10px" }}
              value={state.editUnit}
              disabled
            ></TextField>
            <TextField
              label="Mã đơn vị"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              value={state.editUnitCode}
              onChange={handleEditCode}
            ></TextField>
          </DialogContent>
          <DialogActions className="button-action">
            <Button className="update" onClick={handleEditSubmit}>
              Cập nhật
            </Button>
            <Button className="close" onClick={handleEditClose}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // New Account dialog
          open={state.isAccountModalOpen}
          onClose={handleAccountClose}
        >
          <DialogTitle>Cấp tài khoản cho đơn vị</DialogTitle>
          <DialogContent
            style={{ width: "100%", height: 300, display: "flex" }}
          >
            <TextField
              label="Mã đơn vị"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              value={state.newUsername}
              onChange={handleUsername}
              disabled
            ></TextField>
            <TextField
              label="Mật khẩu"
              variant="outlined"
              style={{ marginLeft: "10px", marginTop: "10px" }}
              onChange={handlePassword}
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button className="create" onClick={handleAccountSubmit}>
              Tạo
            </Button>
            <Button className="close" onClick={handleAccountClose}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Edit Account dialog
          open={state.isEditAccountModalOpen}
          onClose={handleEditAccountClose}
        >
          <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
          <DialogContent style={{ width: "100%", minHeight: 300 }}>
            <div style={{ display: "flex", width: "100%" }}>
              <TextField
                label="Mã đơn vị"
                variant="outlined"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                value={state.editUsername}
                onChange={handleEditUsername}
                disabled
              ></TextField>
              <TextField
                label="Mật khẩu"
                variant="outlined"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={handleEditPassword}
              ></TextField>
            </div>
            <br />
            <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h4>Quyền khai báo</h4>
              <Switch
                checked={state.editActive || false}
                onChange={handleEditActive}
                inputProps={{ "aria-label": "controlled" }}
              ></Switch>
            </div>
            <br />
            <br />
            <div>
              <h3>Thời gian khai báo</h3>
              <TextField
                label="Thời gian bắt đầu"
                variant="standard"
                defaultValue={state.editStartTime}
                InputLabelProps={{ shrink: true, style: {} }}
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="datetime-local"
                onChange={handleEditStartTime}
              ></TextField>
              <br />
              <br />
              <TextField
                label="Thời gian kết thúc"
                variant="standard"
                defaultValue={state.editEndTime}
                InputLabelProps={{ shrink: true, style: {} }}
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="datetime-local"
                onChange={handleEditEndtTime}
              ></TextField>
            </div>
          </DialogContent>
          <DialogActions>
            <Button className="update" onClick={handleEditAccountSubmit}>
              Cập nhật
            </Button>
            <Button className="close" onClick={handleEditAccountClose}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog // Message before delete something...
          open={state.isDeleteMsgOpen}
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
                <div>Bạn có chắc chắn muốn xóa đơn vị này không?</div>
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

        <DataGrid
          autoHeight
          rows={cRows}
          columns={regency === "A3" ? A3_columns : columns}
          pageSize={7}
          components={{ NoRowsOverlay }}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          loading={state.loading}
          disableSelectionOnClick={true}
        />
      </div>
    </>
  );
}
