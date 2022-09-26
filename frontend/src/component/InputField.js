import React from 'react'
import { Divider, Grid, IconButton, InputBase, Paper } from "@mui/material";

// Icon
import SendIcon from '@mui/icons-material/Send';


const InputField = () => {
  return (
    <Grid item xs={12} sx={{ mb: 5 }}>
      <Paper 
        component="form"
        sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', width: 500, height: 60, borderRadius: 5 }}
      >

        <InputBase 
          placeholder="Type here..."
          sx={{ ml: 1, flex: 1 }} 
        />

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical"/>
        
        <IconButton 
          color="primary"
          sx={{ p: '10px' }}
        >
          <SendIcon />
        </IconButton>

      </Paper>
    </Grid>
  )
}

export default InputField