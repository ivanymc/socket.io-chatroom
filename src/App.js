import React, { useEffect, useRef, useState } from "react";
import io from 'socket.io-client';
import { Avatar, Container, createTheme, CssBaseline, Divider, Grid, IconButton, InputBase, List, ListItem, Paper, ThemeProvider, Typography } from "@mui/material";

// Component
// import InputField from "./component/InputField";

// Hooks
import useGetReq from "./hook/useGetReq.js";

// Icon
import SendIcon from '@mui/icons-material/Send';


// Connect to backend
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const socket = io.connect(SERVER_URL);

// Create MUI Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
});

function App() {
  // const [selfMsgs, setSelfMsgs] = useState([ ]);
  // const [isSelfMsgs, setIsSelfMsgs] = useState(null);
  const [otherMsgs, setOtherMsgs] = useState([ ]);
  const inputRef = useRef(null);
  const scrollToBottomRef = useRef(null);
 
  // Random Color
  const genRandomBgColor = e => {
    let hex = Math.floor( Math.random() * 0xFFFFFF );
    return "#" + hex.toString(16);
  };

  // Random id
  const genRandomAvatar = e => {
    if (socket.connected === true) {
      let randomIndexA = Math.floor( Math.random() * socket.id.length );
      let randomIndexB = Math.floor( Math.random() * socket.id.length );
      return socket.id.charAt(randomIndexA).toUpperCase() + socket.id.charAt(randomIndexB).toUpperCase();
    }
  };

  // Send message to Server
  const sendMsg = e => {
    e.preventDefault();
    
    const msg = { 
      sender: genRandomAvatar(),
      senderColor: genRandomBgColor(),  
      message: inputRef.current.value,
      time: new Date().toLocaleString('en-GB', { month: 'short', day: '2-digit', hour12: false, hour: '2-digit', minute: '2-digit' })
    };

    // Send to Socket io
    socket.emit('clientMsg', msg); 
     
    // POST to mongodb
    fetch(`${SERVER_URL}/msg`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg)
    })
    .then( result => console.log('New Message Added', result))
    .catch( err => console.log(err));
    
    e.target.firstChild.firstChild.value = "";
  };

  // Listen to Server message
  useEffect( () => {
    socket.on('serverMsg', data => {
      setOtherMsgs([ ...otherMsgs, {  
        sender: data.sender,
        senderColor: data.senderColor,
        message: data.message,
        time: data.time
      }]);
    });
  }, [ otherMsgs ])

  // Scroll to bottom
  useEffect( () => {
    scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  })

  // Get from DB
  const { data: msgs, isLoading, error } = useGetReq( `${SERVER_URL}/msg` );


  return (
    <ThemeProvider theme={ darkTheme }>
      <Container maxWidth="sm" align="center" sx={{ mt: 4 }}>
      
        <Grid container spacing={2} sx={{ borderRadius: 3 }}>
          <Grid item xs={12} sx={{ height: '80vh', overflow: 'hidden', overflowY : 'auto'}}> 
            <List sx={{ ml: 2 }} className="upperInput"> 
          
              { msgs && msgs.map( (msg, index) => (
                <ListItem key={ index } sx={{ mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: msg.senderColor }}>
                    { msg.sender }
                  </Avatar>
                  
                  <Typography variant="span"
                    sx={{ 
                      whiteSpace: "unset", 
                      wordBreak: "break-all",
                      border: '1px solid grey',
                      padding: 2,
                      borderRadius: 2,
                      maxWidth: 360
                    }}
                  >
                    { msg.message } 
                  </Typography>

                    <Typography variant="span"
                      sx={{
                        ml: 1,
                        alignSelf: 'flex-end',
                        fontSize: '0.5rem',
                        lineHeight: 3,
                        userSelect: 'none'
                      }}
                    >
                    { msg.time }
                  </Typography>
                </ListItem>
              ))} 


              { otherMsgs && otherMsgs.map( (msg, index) => (
                <ListItem key={ index } sx={{ mb: 1 }}>
                  <Avatar sx={{ mr: 2, bgcolor: msg.senderColor }}>
                    { msg.sender.slice(0, 2).toUpperCase() }
                  </Avatar>
                  
                  <Typography variant="span"
                    sx={{ 
                      whiteSpace: "unset", 
                      wordBreak: "break-all",
                      border: '1px solid grey',
                      padding: 2,
                      borderRadius: 2,
                      maxWidth: 360
                    }}
                  >
                    { msg.message }
                  </Typography>

                  <Typography variant="span"
                    sx={{
                      ml: 1,
                      alignSelf: 'flex-end',
                      fontSize: '0.5rem',
                      lineHeight: 3,
                      userSelect: 'none'
                    }}
                  >
                    { msg.time }
                  </Typography>
                </ListItem>
              ))} 

              <span ref={ scrollToBottomRef }> </span>  

            </List>
          </Grid>

          <Divider variant="middle" sx={{ my: 1, ml: 5, width: 500 }} />

          <Grid item xs={12} sx={{ mb: 5 }}>

            <Paper
              component="form"
              onSubmit={ sendMsg }
              sx={{ p: '4px 8px', display: 'flex', alignItems: 'center', width: 500, height: 60, borderRadius: 5 }}
            >
              <InputBase
                ref={ inputRef }
                onChange={ e => inputRef.current.value = e.target.value} 
                required
                autoFocus
                placeholder="Type here..."
                inputProps={{ maxLength: 150,  }}
                sx={{ ml: 1, flex: 1 }} 
              />

              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical"/>
              
              <IconButton
                type="submit"
                children={<SendIcon />}
                color="primary"
                sx={{ p: '10px' }}
              />
            </Paper>
          </Grid>
          
        </Grid>
      </Container>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
