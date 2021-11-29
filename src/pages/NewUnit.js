import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'
import { Button, DialogContent, Dialog, DialogTitle, DialogActions,
  Autocomplete, TextField, Switch
} from '@mui/material';

import '../styles/newUnit.scss'
import location from '../data/location.json'
import { getAllUnit, createUnit, updateUnit, deleteUnit } from '../redux/actions/unitAction';
import { createUser, getChildUser, updateUserById } from '../redux/actions/userAction';

const style = {
  position: 'absolute',
  display: 'flex',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '700px',
  height: '400px',
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function NewUnit() {
  const initState = {
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

  }
  const [state, setState] = useState(initState)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllUnit())
    dispatch(getChildUser())
  }, [])

  let cSelect = location.map(x => ({ label: x.Name }))
  let cRows = useSelector(state => state.unit.allUnit.map((u, idx) => ({ id: idx, _id: u._id, name: u.nameOfUnit, code: u.code })))
  let cChildUser = useSelector(state => state.user.allUser)
  
  //  New Unit handler
  const handleOpen = () => setState({ ...state, isModalOpen: true })
  const handleClose = () => setState({ ...state, isModalOpen: false })
  const handleUnit = (e, v) => {
    setState({ ...state, newUnit: (v || {}).label })
  }
  const handleCode = (e) => {
    setState({ ...state, newUnitCode: e.target.value })
  }
  const handleSubmit = () => {
    dispatch(createUnit({ nameOfUnit: state.newUnit, code: state.newUnitCode }))
    handleClose()
  }

  //  New Account handler
  const handleAccountOpen = (row) => setState({ ...state, isAccountModalOpen: true, newUsername: row.code })
  const handleAccountClose = () => setState({ ...state, isAccountModalOpen: false })
  const handleUsername = (e) => setState({ ...state, newUsername: e.target.value })
  const handlePassword = (e) => setState({ ...state, newPassword: e.target.value }) 
  const handleAccountSubmit = () => {
    dispatch(createUser({ username: state.newUsername, password: state.newPassword }))
    handleAccountClose()
  }
  
  //  Edit Unit handler
  const handleEditOpen = (params) => {
    setState({
      ...state,
      isEditModalOpen: true,
      editUnit: params.name,
      editUnitCode: params.code,
      editUnitId: params._id
    })
  }
  const handleEditClose = () => setState({ ...state, isEditModalOpen: false })
  const handleEditCode = (e) => {
    setState({ ...state, editUnitCode: e.target.value })
  }
  const handleEditSubmit = () => {
    dispatch(updateUnit({
      _id: state.editUnitId,
      nameOfUnit: state.editUnit,
      code: state.editUnitCode,
    }))
  }

  //  Edit Account handler
  const handleEditAccountOpen = (row) => {
    let user = cChildUser.filter(u => u.username === row.code)[0]
    state.editUser = user
    setState({
      ...state, 
      isEditAccountModalOpen: true, 
      editUsername: user.username, 
      editActive: user.active
    })
  }
  const handleEditAccountClose = () => setState({ ...state, isEditAccountModalOpen: false })
  const handleEditUsername = (e) => setState({ ...state, editUsername: e.target.value })
  const handleEditPassword = (e) => setState({ ...state, editPassword: e.target.value }) 
  const handleEditActive = () => setState({ ...state, editActive: !state.editActive })
  const handleEditStartTime = (e) => setState({ ...state, editStartTime: e.target.value })
  const handleEditEndtTime = (e) => setState({ ...state, editEndTime: e.target.value })
  const handleEditAccountSubmit = () => {
    dispatch(updateUserById({
      _id: state.editUser._id,
      newPassword: state.editPassword,
      active: state.editActive,
      startTime: state.editStartTime,
      endTime: state.editEndTime
    }))
    handleEditAccountClose()
  }

  //  Delete Unit handler
  const handleDelete = ({ _id }) => {
    dispatch(deleteUnit({ _id }))
  }

  const columns = [
    { field: 'id', headerName: 'STT', width: 80 },
    { field: '_id', headerName: '_ID', width: 240 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'code', headerName: 'Code', width: 80 },
    {
      field: 'account',
      headerName: 'Account',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter(u => u.username === params.row.code)[0]
        return (
          <>
            { user && <Button style={{ fontSize: '1.4rem' }} onClick={ () => handleEditAccountOpen(params.row) }>Edit</Button> }
            { !user && <Button style={{ fontSize: '1.4rem' }} onClick={ () => handleAccountOpen(params.row) }>Create</Button> }
          </>
        );
      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button style={{ fontSize: '1.4rem' }} onClick={ () => handleEditOpen(params.row) }>Edit</Button>
            <Button style={{ fontSize: '1.4rem' }} onClick={ () => handleDelete(params.row) }>Delete</Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="newUnit-body">
      <Button style={{ border: '1px solid' ,margin: '10px auto 10px 90%', fontSize: '1.5rem' }}
        onClick={handleOpen}
      >New Unit</Button>

      <Dialog // New Unit dialog
        style={{ fontSize: '1.6rem' }}
        open={state.isModalOpen}
        onClose={handleClose}
      >
        <DialogTitle style={{ fontSize: '1.8rem' }}>Create new Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex', fontSize: '1.6rem' }}>
          <Autocomplete
            disablePortal
            onChange={handleUnit}
            options={cSelect}
            sx={{ width: 300, marginTop: '10px' }}
            renderInput={(params) => 
              <TextField 
                { ...params } 
                // InputProps={{ style: { fontSize: '1.6rem' } }}s
                label="Unit" 
                InputLabelProps={{ style: { fontSize: '1.6rem' } }} 
              />
            }
          />
          <TextField label='Code' variant='outlined'
            InputProps={{ style: { fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
            style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
            onChange={handleCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleSubmit}>Submit</Button>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Unit dialog
        style={{ fontSize: '1.6rem' }}
        open={state.isEditModalOpen}
        onClose={handleEditClose}
      >
        <DialogTitle style={{ fontSize: '1.8rem' }}>Edit Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 250, display: 'flex', fontSize: '1.6rem' }}>
          <TextField label='Unit' variant='outlined' 
            InputProps={{ style: { fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
            style={{ marginTop: '10px' }}
            value={state.editUnit}
            disabled
          ></TextField>
          <TextField label='Code' variant='outlined' 
            InputProps={{ style: { fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
            style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
            value={state.editUnitCode}
            onChange={handleEditCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, fontSize: '1.6rem' }} onClick={handleEditSubmit}>Submit</Button>
          <Button style={{ height: 60, fontSize: '1.6rem' }} onClick={handleEditClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // New Account dialog
        style={{ fontSize: '1.6rem' }}
        open={state.isAccountModalOpen}
        onClose={handleAccountClose}
      >
        <DialogTitle style={{ fontSize: '1.8rem' }}>Create new account</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex', fontSize: '1.6rem' }}>
          <TextField label='Username' variant='outlined'
            InputProps={{ style: { fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
            style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
            value={state.newUsername}
            onChange={handleUsername}
            disabled
          ></TextField>
          <TextField label='Password' variant='outlined'
            InputProps={{ style: { fontSize: '1.6rem' } }}
            InputLabelProps={{ style: { fontSize: '1.6rem' } }}
            style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
            onChange={handlePassword}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleAccountSubmit}>Create</Button>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleAccountClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Account dialog
        style={{ fontSize: '1.6rem' }}
        open={state.isEditAccountModalOpen}
        onClose={handleEditAccountClose}
      >
        <DialogTitle style={{ fontSize: '1.8rem' }}>Edit account</DialogTitle>
        <DialogContent style={{ width: '100%', minHeight: 300, fontSize: '1.6rem' }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField label='Username' variant='outlined'
              InputProps={{ style: { fontSize: '1.6rem' } }}
              InputLabelProps={{ style: { fontSize: '1.6rem' } }}
              style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
              value={state.editUsername}
              onChange={handleEditUsername}
              disabled
            ></TextField>
            <TextField label='Password' variant='outlined'
              InputProps={{ style: { fontSize: '1.6rem' } }}
              InputLabelProps={{ style: { fontSize: '1.6rem' } }}
              style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
              onChange={handleEditPassword}
            ></TextField>
          </div>
          <br />
          <br />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h4>Quyền khai báo</h4>
            <Switch
              checked={state.editActive || false} 
              onChange={handleEditActive}
              inputProps={{ 'aria-label': 'controlled' }}
            ></Switch>
          </div>
          <br />
          <br />
          <div>
            <h3>Thời gian khai báo</h3>
            <TextField label='Start time' variant='standard'
              InputProps={{ style: { fontSize: '1.6rem' } }}
              InputLabelProps={{ shrink: true, style: { fontSize: '1.6rem' } }}
              style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
              type='datetime-local'
              onChange={handleEditStartTime}
            ></TextField>
            <br />
            <br />
            <TextField label='End time' variant='standard'
              InputProps={{ style: { fontSize: '1.6rem' } }}
              InputLabelProps={{ shrink: true, style: { fontSize: '1.6rem' } }}
              style={{ marginLeft: '10px', marginTop: '10px', fontSize: '1.6rem' }}
              type='datetime-local'
              onChange={handleEditEndtTime}
            ></TextField>
          </div>

        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleEditAccountSubmit}>Submit</Button>
          <Button style={{ height: 60, fontSize: '1.4rem' }} onClick={handleEditAccountClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        style={{ fontSize: '1.6rem' }}
        rows={cRows}
        columns={columns}
        pageSize={7}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
      />

    </div>
  )
}
