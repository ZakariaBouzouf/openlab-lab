import React, { useContext, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  Button,
  Chip,
  Grow,
  IconButton,
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
import DataTableManager from "../dataset/data-table-manager/data-table-manager.jsx";
import UploadCSV from "../dataset/upload-csv/uploadCSV.jsx";

const Method = () =>{
  const { requirements, lockedStep, setLockedStep,dataset } =
    useContext(ISCContext);
  const [state, setState] = useState({
    showSelections: true,
  });

  const handleTogglePanel = () => {
    setLockedStep((prevState) => ({
      ...prevState,
      method: {
        ...prevState.method,
        openPanel: !prevState.method.openPanel,
      },
    }));
  };

  const handleToggleShowSelection = () => {
    setState((prevState) => ({
      ...prevState,
      showSelections: !prevState.showSelections,
    }));
  };

  const handleUnlockVisualization = () => {
    handleTogglePanel();
    setLockedStep((prevState) => ({
      ...prevState,
      visualization: {
        ...prevState.visualization,
        locked: false,
        openPanel: true,
        step: "5",
      },
    }));
  };

  const handleUnlockFinalize = () => {
    handleTogglePanel();
    setLockedStep((prevState) => ({
      ...prevState,
      finalize: {
        ...prevState.finalize,
        locked: false,
        openPanel: true,
      },
    }));
  };

  return (
    <>
      <Accordion
        expanded={lockedStep.method.openPanel}
        disabled={lockedStep.method.locked}
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
                      {!lockedStep.method.locked ? (
                        <Chip label={lockedStep.method.step} color="primary" />
                      ) : (
                        <IconButton size="small">
                          <LockIcon />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid item>
                      <Typography>Method</Typography>
                    </Grid>

                    {!lockedStep.method.openPanel && (
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
                {lockedStep.method.openPanel && (
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
              in={!lockedStep.method.openPanel && state.showSelections}
              timeout={{ enter: 500, exit: 0 }}
              unmountOnExit
            >
              <Grid item xs={12}>
                {requirements.selectedPath !== "" && (
                  <Grid item xs={12} spacing={4}>
                    {requirements.selectedMethod !== "" &&(
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography>Selected method:</Typography>
                        </Grid>
                        <Grid item>
                          <Chip label={requirements.selectedMethod} />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grow>
          </Grid>
        </AccordionSummary>

        <Grid item spacing={2} sx={{ pl: 1 }}>
          {lockedStep.method.type=="Manual" && (
            <Grid item xs={12}>
              <DataTableManager/>
            </Grid>
          )}
          {lockedStep.method.type=="Upload" && (
            <Grid item xs={12}>
              <UploadCSV/>
            </Grid>
          )}
        </Grid>
         
        <AccordionActions sx={{ py: 2 }}>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={
                    dataset.rows.length === 0 && dataset.columns.length === 0
                  }
                  onClick={
                    lockedStep.dataset.step === "3"
                      ? handleUnlockVisualization
                      : lockedStep.dataset.step === "4"
                      ? handleUnlockFinalize
                      : undefined
                  }
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </AccordionActions>
      </Accordion>
    </>
  );
}


export default Method;
