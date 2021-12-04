import React from 'react'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'
import { Button, DialogContent, Dialog, DialogTitle, DialogActions,
  Autocomplete, TextField, Switch
} from '@mui/material';

import '../styles/newUnit.scss'
import location from '../data/location.json'
import { getChildUnit, createUnit, updateUnit, deleteUnit } from '../redux/actions/unitAction';
import { createUser, getChildUser, updateUserById, getOptions } from '../redux/actions/userAction';

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

  }
  const [state, setState] = useState(initState)

  const dispatch = useDispatch()

  useEffect(async () => {
    dispatch(getChildUnit())
    dispatch(getChildUser())
    
    let options = await getOptions()

    let cOptions = options.map(x => ({ label: x }))
    setState({ ...state, select: options, cSelect: cOptions })
  }, [])

  let cRows = useSelector(state => state.unit.allUnit.map((u, idx) => ({ id: idx, _id: u._id, name: u.nameOfUnit, code: u.code })))
  let cChildUser = useSelector(state => state.user.allUser)
  
  //  Compute select
  const computedSelect = (temp) => {
    return new Promise(next => {
      let cTemp = temp.map(x => ({ label: x }))
      next(cTemp)
    })
  }

  //  New Unit handler
  const handleOpen = () => setState({ ...state, isModalOpen: true })
  const handleClose = () => setState({ ...state, isModalOpen: false })
  const handleUnit = (e, v) => {
    setState({ ...state, newUnit: (v || {}).label })
  }
  const handleKeydownUnit = async (e) => {
    if (e.keyCode === 13) {
      let temp = state.select
      if (!temp.includes(e.target.value)) {
        temp.push(e.target.value)
      }
      let cTemp = await computedSelect(temp)
      setState({ ...state, select: temp, cSelect: cTemp, newUnit: e.target.value })
    }
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
    user.startTime = (user.startTime || "").split('.')[0]
    user.endTime = (user.endTime || "").split('.')[0]
    setState({
      ...state, 
      isEditAccountModalOpen: true, 
      editUsername: user.username, 
      editActive: user.active,
      editStartTime: user.startTime,
      editEndTime: user.endTime,
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
    { field: 'code', headerName: 'Code', width: 100 },
    {
      field: 'account',
      headerName: 'Account',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        let user = cChildUser.filter(u => u.username === params.row.code)[0]
        return (
          <>
            { user && <Button  onClick={ () => handleEditAccountOpen(params.row) }>Edit</Button> }
            { !user && <Button  onClick={ () => handleAccountOpen(params.row) }>Create</Button> }
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
            <Button  onClick={ () => handleEditOpen(params.row) }>Edit</Button>
            <Button  onClick={ () => handleDelete(params.row) }>Delete</Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="newUnit-body">
      <Button style={{ border: '1px solid' ,margin: '10px auto 10px 90%',  }}
        onClick={handleOpen}
      >New Unit</Button>

      <Dialog // New Unit dialog
        open={state.isModalOpen}
        onClose={handleClose}
      >
        <DialogTitle >Create new Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex',  }}>
          <Autocomplete
            disablePortal
            onChange={handleUnit}
            onKeyDown={handleKeydownUnit}
            options={state.cSelect}
            sx={{ width: 300, marginTop: '10px' }}
            renderInput={(params) => 
              <TextField 
                { ...params } 
                label="Unit" 
              />
            }
          />
          <TextField label='Code' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px',  }}
            onChange={handleCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60,  }} onClick={handleSubmit}>Submit</Button>
          <Button style={{ height: 60,  }} onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Unit dialog
        open={state.isEditModalOpen}
        onClose={handleEditClose}
      >
        <DialogTitle >Edit Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 250, display: 'flex',  }}>
          <TextField label='Unit' variant='outlined' 
            style={{ marginTop: '10px' }}
            value={state.editUnit}
            disabled
          ></TextField>
          <TextField label='Code' variant='outlined' 
            style={{ marginLeft: '10px', marginTop: '10px',  }}
            value={state.editUnitCode}
            onChange={handleEditCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60,  }} onClick={handleEditSubmit}>Submit</Button>
          <Button style={{ height: 60,  }} onClick={handleEditClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // New Account dialog
        
        open={state.isAccountModalOpen}
        onClose={handleAccountClose}
      >
        <DialogTitle >Create new account</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex',  }}>
          <TextField label='Username' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px',  }}
            value={state.newUsername}
            onChange={handleUsername}
            disabled
          ></TextField>
          <TextField label='Password' variant='outlined'
            style={{ marginLeft: '10px', marginTop: '10px',  }}
            onChange={handlePassword}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60,  }} onClick={handleAccountSubmit}>Create</Button>
          <Button style={{ height: 60,  }} onClick={handleAccountClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Account dialog
        
        open={state.isEditAccountModalOpen}
        onClose={handleEditAccountClose}
      >
        <DialogTitle >Edit account</DialogTitle>
        <DialogContent style={{ width: '100%', minHeight: 300,  }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <TextField label='Username' variant='outlined'
              style={{ marginLeft: '10px', marginTop: '10px',  }}
              value={state.editUsername}
              onChange={handleEditUsername}
              disabled
            ></TextField>
            <TextField label='Password' variant='outlined'
              style={{ marginLeft: '10px', marginTop: '10px',  }}
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
              defaultValue={state.editStartTime}
              InputLabelProps={{ shrink: true, style: {  } }}
              style={{ marginLeft: '10px', marginTop: '10px',  }}
              type='datetime-local'
              onChange={handleEditStartTime}
            ></TextField>
            <br />
            <br />
            <TextField label='End time' variant='standard'
              defaultValue={state.editEndTime}
              InputLabelProps={{ shrink: true, style: {  } }}
              style={{ marginLeft: '10px', marginTop: '10px',  }}
              type='datetime-local'
              onChange={handleEditEndtTime}
            ></TextField>
          </div>

        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60,  }} onClick={handleEditAccountSubmit}>Submit</Button>
          <Button style={{ height: 60,  }} onClick={handleEditAccountClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        
        rows={cRows}
        columns={columns}
        pageSize={7}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
      />

    </div>
  )
}
