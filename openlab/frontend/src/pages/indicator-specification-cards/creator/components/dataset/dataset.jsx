import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Grow,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import { ISCContext } from "../../indicator-specification-card.jsx";
import { blue, orange } from "@mui/material/colors";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

const Dataset = () => {
  const { requirements, setRequirements, lockedStep, setLockedStep,dataset } =
    useContext(ISCContext);
  const [state, setState] = useState({
    showSelections: true,
  });

  console.log("lockedStep ",lockedStep)
  console.log("dataset ",dataset)

  const handleChooseManualPath = () => {
    let vis = "Manual";
    handleTogglePanel();
    if (requirements.selectedMethod !== vis) {
      setLockedStep((prevState) => ({
        ...prevState,
        manual: {
          ...prevState.manual,
          locked: false,
          openPanel: true,
        },
        upload: {
          ...prevState.upload,
          locked: true,
          openedPanel: false,
        },
        method:{
          ...prevState.method,
          type: vis,
          locked:false,
          openPanel: true,
          step:prevState?.dataset.step =="3"?"4":"5",
        }
      }));
      setRequirements((prevState) => ({
        ...prevState,
        selectedMethod: vis,
      }));
    } else {
      setLockedStep((prevState) => ({
        ...prevState,
        manual: {
          ...prevState.manual,
          openedPanel: true,
        },
      }));
    }
  };

  const handleChooseUploadPath = () => {
    let vis = "Upload";
    handleTogglePanel();
    if (requirements.selectedMethod !== vis) {
      setLockedStep((prevState) => ({
        ...prevState,
        manual: {
          ...prevState.manual,
          locked: true,
          openPanel: false,
        },
        upload: {
          ...prevState.upload,
          locked: false,
          openedPanel: true,
        },
          method:{
          ...prevState.method,
          type: vis,
          locked:false,
          openPanel: true,
          step:"5",
        }
      }));
      setRequirements((prevState) => ({
        ...prevState,
        selectedMethod: vis,
      }));
    } else {
      setLockedStep((prevState) => ({
        ...prevState,
        upload: {
          ...prevState.upload,
          openedPanel: true,
        },
      }));
    }
  }

  const handleTogglePanel = () => {
    setLockedStep((prevState) => ({
      ...prevState,
      dataset: {
        ...prevState.dataset,
        openPanel: !prevState.dataset.openPanel,
      },
    }));
  };

  const handleToggleShowSelection = () => {
    setState((prevState) => ({
      ...prevState,
      showSelections: !prevState.showSelections,
    }));
  };

  const buttonStyle = (type = "visualization") => {
    return {
      height: 150,
      width: 150,
      border: "3px solid",
      borderColor: type === "dataset" ? blue[200] : orange[200],
      "&:hover": {
        boxShadow: 5,
        borderColor: type === "dataset" ? blue[900] : orange[800],
      },
      p: 2,
      borderRadius: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
    };
  };

  return (
    <>
      <Accordion
        expanded={lockedStep.dataset.openPanel}
        disabled={lockedStep.dataset.locked}
      >
        <AccordionSummary>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
              >
                <Grid item xs>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      {!lockedStep.dataset.locked ? (
                        <Chip label={lockedStep.dataset.step} color="primary" />
                      ) : (
                        <IconButton size="small">
                          <LockIcon />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid item>
                      <Typography>Dataset</Typography>
                    </Grid>
                    {!lockedStep.dataset.openPanel && (
                      <>
                        <Grid item>
                          <Tooltip title="Edit method">
                            <IconButton onClick={handleTogglePanel}>
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        </Grid>

                        <Grid item>
                          <Tooltip
                            title={
                              !state.showSelections
                                ? "Show summary"
                                : "Hide summary"
                            }
                          >
                            <IconButton onClick={handleToggleShowSelection}>
                              {!state.showSelections ? (
                                <VisibilityIcon color="primary" />
                              ) : (
                                <VisibilityOffIcon color="primary" />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                {lockedStep.dataset.openPanel && (
                  <Grid item>
                    <Tooltip title="Close panel">
                      <IconButton onClick={handleTogglePanel}>
                        <CloseIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grow
              in={!lockedStep.dataset.openPanel && state.showSelections}
              timeout={{ enter: 500, exit: 0 }}
              unmountOnExit
            >
              <Grid item xs={12}>
                {requirements.selectedPath !== "" && (
                  <Grid item xs={12} spacing={4}>
                    <Grid container alignItems="center" spacing={1}>
                      <Grid item>
                        <Typography>Selected path:</Typography>
                      </Grid>
                      <Grid item>
                        <Chip label={requirements.selectedPath} />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grow>
          </Grid>
        </AccordionSummary>

        {(<AccordionDetails>
          <Grid container justifyContent="center" spacing={4} sx={{ py: 2 }}>
            <Grid item>
              <Paper
                elevation={0}
                sx={buttonStyle()}
                onClick={handleChooseManualPath}
              >
                <Typography variant="h6" align="center">
                  Create you own data set 
                </Typography>
              </Paper>
            </Grid>

            <Grid item>
              <Paper
                elevation={0}
                sx={buttonStyle("dataset")}
                onClick={handleChooseUploadPath}
              >
                <Typography variant="h6" align="center">
                  Upload a CSV
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AccordionDetails>)}

      </Accordion>
    </>
  );
};

export default Dataset;

