import React from 'react'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid'
import { Button, DialogContent, Dialog, DialogTitle, DialogActions, Autocomplete, TextField, Box } from '@mui/material';

import '../styles/newUnit.scss'
import location from '../data/location.json'
import { getAllUnit, createUnit } from '../redux/actions/unitAction';

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
    
    // New Unit
    newUnit: null,
    newUnitCode: null,

    // Edit Unit
    editUnit: null,
    editUnitCode: null,

  }
  const [state, setState] = useState(initState)

  const dispatch = useDispatch()

  const handleOpen = () => setState({ ...state, isModalOpen: true })
  const handleClose = () => setState({ ...state, isModalOpen: false })
  const handleEditOpen = (params) => {
    setState({ ...state, isEditModalOpen: true, editUnit: 'todo', editUnitCode: 'todo' })
  }
  const handleEditClose = () => setState({ ...state, isEditModalOpen: false })
  

  let cSelect = location.map(x => ({ label: x.Name }))
  let cRows = location.map(x => ({ id: x.Id, name: x.Name }))

  const handleUnit = (e, v) => {
    setState({ ...state, newUnit: (v || {}).label })
  }

  const handleEditCode = (e) => {
    setState({ ...state, editUnitCode: e.target.value })
  } 

  const handleCode = (e) => {
    setState({ ...state, newUnitCode: e.target.value })
  }

  const handleSubmit = () => {
    dispatch(createUnit({ nameOfUnit: state.newUnit, code: state.newUnitCode }))
    handleClose()
  }

  const handleEditSubmit = () => {
    //  TODO
    console.log('edit')
  }

  const handleDelete = () => {

  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'name', headerName: 'Name', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={ () => handleEditOpen(params.row) }>Edit</Button>
            <Button onClick={ () => handleDelete(params.row) }>Delete</Button>
          </>
        );
      },
    },
  ];

  return (
    <div className="newUnit-body">
      <Button style={{ border: '1px solid' ,margin: '10px auto 10px 90%' }} 
        onClick={handleOpen}
      >New Unit</Button>

      <Dialog // New Unit dialog
        open={state.isModalOpen}
        onClose={handleClose}
      >
        <DialogTitle>Create new Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 300, display: 'flex' }}>
          <Autocomplete
            disablePortal
            onChange={handleUnit}
            options={cSelect}
            sx={{ width: '300px', marginTop: '10px' }}
            renderInput={(params) => <TextField { ...params } label="Unit" />}
          />
          <TextField label='Code' variant='outlined' 
            style={{ marginLeft: '10px', marginTop: '10px' }}
            onChange={handleCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60 }} onClick={handleSubmit}>Submit</Button>
          <Button style={{ height: 60 }} onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog // Edit Unit dialog
        open={state.isEditModalOpen}
        onClose={handleEditClose}
      >
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent style={{ width: '100%', height: 250, display: 'flex' }}>
        <TextField label='Unit' variant='outlined' 
            style={{ marginTop: '10px' }}
            value={state.editUnit}
            disabled
          ></TextField>
          <TextField label='Code' variant='outlined' 
            style={{ marginLeft: '10px', marginTop: '10px' }}
            value={state.editUnitCode}
            onChange={handleEditCode}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button style={{ height: 60 }} onClick={handleSubmit}>Submit</Button>
          <Button style={{ height: 60 }} onClick={handleClose}>Close</Button>
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
