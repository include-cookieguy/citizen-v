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

import "../styles/newUnit.scss";
import location from "../data/location.json";
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

const style = {
  position: "absolute",
  display: "flex",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "700px",
  height: "400px",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewUnit() {
  const initState = {
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
  };
  const [state, setState] = useState(initState);

  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(getChildUnit());
    dispatch(getChildUser());
    let options = await getOptions()
    let cOptions = options.map(x => ({ label: x }))
    setState({ ...state, select: options, cSelect: cOptions });
  }, []);

  let cRows = useSelector((state) =>
    state.unit.allUnit.map((u, idx) => ({
      id: idx + 1,
      _id: u._id,
      name: u.nameOfUnit,
      code: u.code,
    }))
  );
  let cChildUser = useSelector((state) => state.user.allUser);

  //  Compute select
  const computedSelect = (temp) => {
    let cTemp = temp.map((x) => ({ label: x }));
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
    handleEditClose()
  };

  //  Edit Account handler
  const handleEditAccountOpen = (row) => {
    let user = cChildUser.filter(u => u.username === row.code)[0]
    state.editUser = user
    user.startTime = (user.startTime || "").split('.')[0]
    user.endTime = (user.endTime || "").split('.')[0]
    setState({
      ...state, 
      isEditAccountModalOpen: true, 
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
  const handleEditEndtTime = (e) =>
    setState({ ...state, editEndTime: e.target.value });
  const handleEditAccountSubmit = () => {
    dispatch(
      updateUserById({
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
  const handleDelete = ({ _id }) => {
    dispatch(deleteUnit({ _id }));
  };

  const columns = [
    { field: 'id', headerName: 'STT', flex: 80, minWidth: 62 },
    { field: 'name', headerName: 'Tên đơn vị', flex: 300, minWidth: 231 },
    { field: 'code', headerName: 'Mã đơn vị', flex: 100, minWidth: 100 },
    {
      field: 'account',
      headerName: 'Tài khoản đơn vị',
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
      field: 'action',
      headerName: 'Quản lý mã đơn vị',
      flex: 250,
      minWidth: 192,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              style={{ marginRight: '30px' }}
              onClick={() => handleEditOpen(params.row)}>Chỉnh sửa</Button>
            <Button onClick={() => handleDelete(params.row)}>Xóa</Button>
          </>
        );
      },
    },
  ];

  function NoRowsOverlay() {
    return (
      <Stack marginTop='200px' alignItems="center" justifyContent="center">
        Chưa có đơn vị nào được khai báo
      </Stack>
    );
  }

  return (
    <div className="newUnit-body">
      <div className='name-of-official'>
        <div className='department'>{localStorage['department']}</div>
        <div className='official'>{localStorage['official']}</div>
        <div className='start'>* * * * * * *</div>
      </div>

      <div className='header'>
        <div className='header-title'>
          <div>Danh sách các đơn vị</div>
        </div>

        <div className='button-new-unit'>
          <Button style={{ border: '1px solid', margin: '', }}
            onClick={handleOpen}
          >Khai báo và cấp mã</Button>
        </div>
      </div>

      <Dialog // New Unit dialog
        open={state.isModalOpen}
        onClose={handleClose}
      >
        <DialogTitle >Khai báo và cấp mã</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex', }}>
          <Autocomplete
            disablePortal
            onChange={handleUnit}
            onKeyDown={handleKeydownUnit}
            options={state.cSelect}
            sx={{ width: 300, marginTop: '10px' }}
            renderInput={(params) =>
              <TextField
                {...params}
                label="Tên đơn vị"
              />
            }
          />
          <TextField label='Mã đơn vị' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px', }}
            onChange={handleCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, }} onClick={handleSubmit}>Cấp mã</Button>
          <Button style={{ height: 60, }} onClick={handleClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Unit dialog
        open={state.isEditModalOpen}
        onClose={handleEditClose}
      >
        <DialogTitle >Chỉnh sửa mã đơn vị</DialogTitle>
        <DialogContent style={{ width: '100%', height: 250, display: 'flex', }}>
          <TextField label='Tên đơn vị' variant='outlined'
            style={{ marginTop: '10px' }}
            value={state.editUnit}
            disabled
          ></TextField>
          <TextField label='Mã đơn vị' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px', }}
            value={state.editUnitCode}
            onChange={handleEditCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, }} onClick={handleEditSubmit}>Cập nhật</Button>
          <Button style={{ height: 60, }} onClick={handleEditClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog // New Account dialog
        open={state.isAccountModalOpen}
        onClose={handleAccountClose}
      >
        <DialogTitle >Cấp tài khoản cho đơn vị</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex', }}>
          <TextField label='Mã đơn vị' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px', }}
            value={state.newUsername}
            onChange={handleUsername}
            disabled
          ></TextField>
          <TextField label='Mật khẩu' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px', }}
            onChange={handlePassword}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, }} onClick={handleAccountSubmit}>Tạo</Button>
          <Button style={{ height: 60, }} onClick={handleAccountClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Account dialog
        open={state.isEditAccountModalOpen}
        onClose={handleEditAccountClose}
      >
        <DialogTitle >Chỉnh sửa tài khoản</DialogTitle>
        <DialogContent style={{ width: '100%', minHeight: 300, }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField label='Mã đơn vị' variant='outlined'
              style={{ marginLeft: '10px', marginTop: '10px', }}
              value={state.editUsername}
              onChange={handleEditUsername}
              disabled
            ></TextField>
            <TextField label='Mật khẩu' variant='outlined'
              style={{ marginLeft: '10px', marginTop: '10px', }}
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
            <TextField label='Thời gian bắt đầu' variant='standard'
              defaultValue={state.editStartTime}
              InputLabelProps={{ shrink: true, style: {} }}
              style={{ marginLeft: '10px', marginTop: '10px', }}
              type='datetime-local'
              onChange={handleEditStartTime}
            ></TextField>
            <br />
            <br />
            <TextField label='Thời gian kết thúc' variant='standard'
              defaultValue={state.editEndTime}
              InputLabelProps={{ shrink: true, style: {} }}
              style={{ marginLeft: '10px', marginTop: '10px', }}
              type='datetime-local'
              onChange={handleEditEndtTime}
            ></TextField>
          </div>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, }} onClick={handleEditAccountSubmit}>Cập nhật</Button>
          <Button style={{ height: 60, }} onClick={handleEditAccountClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        autoHeight
        rows={cRows}
        columns={columns}
        pageSize={7}
        components={{ NoRowsOverlay }}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
      />
    </div>
  );
}
