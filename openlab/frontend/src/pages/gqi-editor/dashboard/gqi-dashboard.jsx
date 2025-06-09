import { Button, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";

const GQIDashboard = () => {

  const [myString,setMyString] = useState("Hello World")

  const consoleFunction = () => {
    console.log(`This is the state : ${myString}` )
  }


  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>GQI Dashboard</Typography>
          <Button variant="outlined" onClick={consoleFunction}>TEST</Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </>
  );
};
export default GQIDashboard;
