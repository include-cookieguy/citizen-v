import React from 'react'
import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'

import { useSelector } from 'react-redux'

export default function ShowMessage() {
  let { isShow, type, message } = useSelector(state => state.showMessage)
  return (
    <div style={{ position: 'relative', top: '90px' }} >
      { isShow && <Stack sx={{ width: '20%', margin: 'auto' }} spacing={2}>
        <Alert severity={type}>{message}</Alert>
        </Stack> }
    </div>
  )
}
