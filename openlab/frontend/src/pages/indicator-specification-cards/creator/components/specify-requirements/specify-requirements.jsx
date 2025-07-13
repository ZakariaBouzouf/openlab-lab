import React, { useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Grid,
  Grow,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ISCContext } from "../../indicator-specification-card.jsx";
import GoalList from "./components/goal-list.jsx";
import DataList from "./components/data-list.jsx";
import { v4 as uuidv4 } from "uuid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const SpecifyRequirements = () => {
  const [open, setOpen] = useState(false);
  const [permissionToChange, setPermissionToChange] = useState(false);
  const {
    requirements,
    setRequirements,
    lockedStep,
    setLockedStep,
    dataset,
    setDataset,
  } = useContext(ISCContext);
  const [state, setState] = useState({
    showSelections: true,
    showGoalCheckmarkTip: false,
  });

  useEffect(()=>{
    if(permissionToChange){
      addNewColumnsMethod();
      setPermissionToChange(false);
    }
  },[permissionToChange])

  // Automatically refresh the dataset when requirements.data changes (recommendation charts will automatically refresh with changes in dataset.columns)
  useEffect(() => {
    addNewColumnsMethod();
    // ...existing code...
  }, [requirements.data]);


  // pop up prompt after user stops typing for a while
  React.useEffect(() => {
    let timer;
    if (
      requirements.edit.goal &&
      requirements.goalType.verb.length > 0 &&
      requirements.goal.length > 0
    ) {
      timer = setTimeout(() => {
        setState((prev) => ({ ...prev, showGoalCheckmarkTip: true }));
      }, 2500); // pop up after 2.5 seconds
    } else {
      setState((prev) => ({ ...prev, showGoalCheckmarkTip: false }));
    }
    return () => {
      clearTimeout(timer);
    };
  }, [requirements.edit.goal, requirements.goalType.verb, requirements.goal]);
  const handleTogglePanel = () => {
    setLockedStep((prevState) => ({
      ...prevState,
      requirements: {
        ...prevState.requirements,
        openPanel: !prevState.requirements.openPanel,
      },
    }));
  };

  const handleToggleShowSelection = () => {
    setState((prevState) => ({
      ...prevState,
      showSelections: !prevState.showSelections,
    }));
  };

  const handleFormData = (event) => {
    const { name, value } = event.target;
    setRequirements((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmChange = () => {
    setPermissionToChange(true);
    handleClose();
    handleTogglePanel()
  }

 const handleDeclineChange = () => {
   handleClose();
   handleTogglePanel()
 }
   
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("Dataset",dataset)
  console.log("Requirement",requirements)
  const handleUnlockPath = () => {
    handleTogglePanel();
    // Regardless of whether lockedStep.path.locked is true or false, 
    // forcibly refresh columns/rows every time to ensure recommendations and the table are refreshed.
    addNewColumnsMethod();
    setLockedStep((prevState) => ({
      ...prevState,
      path: {
        ...prevState.path,
        locked: false,
        openPanel: true,
      },
    }));
  };


  const addNewColumnsMethod = () => {
    let tempColumnData = [];
    let tempRows = [];
    // Only include data items where both value and type are valid.
    const validData = requirements.data.filter(item => item.value && item.type && Object.values(item.type).length !== 0);
    validData.forEach((item) => {
      let fieldUUID = uuidv4();
      tempColumnData.push({
        field: fieldUUID,
        headerName: item.value,
        sortable: false,
        editable: true,
        width: 200,
        type: item.type.type,
        dataType: item.type, // Custom field
      });
      if (Boolean(tempRows.length)) {
        tempRows = tempRows.map((row, index) => ({
          ...row,
          [fieldUUID]:
            item.type.type === "string" ? `${item.value} ${index + 1}` : 0,
        }));
      } else {
        for (let i = 0; i < 3; i++) {
          tempRows.push({
            id: uuidv4(),
            [fieldUUID]:
              item.type.type === "string" ? `${item.value} ${i + 1}` : 0,
          });
        }
      }
    });
    // Set the dataset only if there is valid data.
    if (validData.length > 0) {
      setDataset((prevState) => ({
        ...prevState,
        rows: tempRows,
        columns: tempColumnData,
      }));
    }
  };

  const handleToggleGoalEdit = () => {
    setRequirements((prevState) => ({
      ...prevState,
      edit: {
        ...prevState.edit,
        goal: !prevState.edit.goal,
      },
      show: {
        ...prevState.show,
        question: true,
      },
    }));
    // close the prompt
    setState((prev) => ({ ...prev, showGoalCheckmarkTip: false }));
  };

  const handleToggleQuestionEdit = () => {
    setRequirements((prevState) => ({
      ...prevState,
      edit: {
        ...prevState.edit,
        question: !prevState.edit.question,
      },
      show: {
        ...prevState.show,
        indicatorName: true,
      },
    }));
  };

  return (
    <>


      {/* Snackbar prompt */}
      <Snackbar
        open={state.showGoalCheckmarkTip}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={4000}
        onClose={() => setState((prev) => ({ ...prev, showGoalCheckmarkTip: false }))}
      >


        <MuiAlert severity="info" sx={{ width: '100%' }}>
          Please click the checkmark on the right to confirm.
        </MuiAlert>
      </Snackbar>
      <Accordion expanded={lockedStep.requirements.openPanel}>
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
                      <Chip
                        label={lockedStep.requirements.step}
                        color="primary"
                      />
                    </Grid>
                    <Grid item>
                      <Typography>
                        Specify your goal, question, and indicator
                      </Typography>
                    </Grid>
                    {!lockedStep.requirements.openPanel && (
                      <>
                        <Grid item>
                          <Tooltip title="Edit requirements">
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
                {lockedStep.requirements.openPanel && (
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
              in={!lockedStep.requirements.openPanel && state.showSelections}
              timeout={{ enter: 500, exit: 0 }}
              unmountOnExit
            >
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {requirements.goal !== "" &&
                    requirements.goalType.name !== "" && (
                      <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography>I want to</Typography>
                          </Grid>
                          <Grid item>
                            <Chip label={requirements.goalType.verb} />
                          </Grid>
                          <Grid item>
                            <Chip label={requirements.goal} />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  {requirements.question !== "" && (
                    <Grid item xs={12}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography>I am interested in</Typography>
                        </Grid>
                        <Grid item>
                          <Chip label={requirements.question} />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {requirements.question !== "" && (
                    <Grid item xs={12}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography>I need an indicator showing</Typography>
                        </Grid>
                        <Grid item>
                          <Chip label={requirements.indicatorName} />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  {requirements.data.length !== 0 &&
                    (requirements.data[0].value !== "" ||
                      requirements.data[1].value !== "") && (
                      <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <Typography>I need the following data</Typography>
                          </Grid>
                          {requirements.data.map((item, index) => {
                            if (item.value !== "") {
                              return (
                                <Grid item key={index}>
                                  <Chip label={item.value} />
                                </Grid>
                              );
                            }
                            return undefined;
                          })}
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              </Grid>
            </Grow>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {requirements.edit.goal ? (
              <>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="body2">Specify your goal</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs sm={4}>
                          <GoalList addButtonClassName="goallist-add-btn" />
                        </Grid>
                        <Grid item xs={12} sm>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                              <TextField
                                fullWidth
                                required
                                name="goal"
                                value={requirements.goal}
                                label="Describe your goal"
                                placeholder="e.g., the usage of the learning materials in my course."
                                onChange={handleFormData}
                              />
                            </Grid>
                            <Grid item>
                            
                              <style>
                              {`
                              @keyframes checkmark-bounce {
                                0% { transform: scale(1);}
                                30% { transform: scale(1.18);}
                                60% { transform: scale(0.95);}
                                100% { transform: scale(1.15);}
                              }
                              .custom-checkmark-btn {
                                background-color: #1976d2 !important;
                                color: #fff !important;
                                transition: background 0.2s, color 0.2s;
                              }
                              .custom-checkmark-btn:hover:not(:disabled) {
                                background-color: #fff !important;
                                color: #1976d2 !important;
                                border: 1.5px solid #1976d2 !important;
                              }
                              `}
                              </style>
                              <Tooltip
                                title={state.showGoalCheckmarkTip ? "Confirm" : "Confirm"}
                                open={state.showGoalCheckmarkTip || undefined}
                                placement="top"
                                arrow
                              >
                                <span>
                                  <IconButton
                                    className={
                                      requirements.goal.length > 0 &&
                                      requirements.goalType.verb.length > 0 &&
                                      requirements.edit.goal
                                        ? 'custom-checkmark-btn'
                                        : ''
                                    }
                                    onClick={handleToggleGoalEdit}
                                    disabled={
                                      requirements.goal.length < 1 ||
                                      requirements.goalType.verb.length < 1
                                    }
                                    sx={
                                      requirements.goal.length > 0 &&
                                      requirements.goalType.verb.length > 0 &&
                                      requirements.edit.goal
                                        ? {
                                            animation: 'checkmark-bounce 0.7s',
                                            transform: 'scale(1.15)',
                                            boxShadow: '0 0 8px #1976d2',
                                          }
                                        : undefined
                                    }
                                  >
                                    <DoneIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item>
                          <Typography>
                            <i>Your goal:</i> I want to{" "}
                            <b>{requirements.goalType.verb}</b> the{" "}
                            <b>{requirements.goal}</b>
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Tooltip title="Edit your goal">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={handleToggleGoalEdit}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {requirements.show.question && (
              <>
                {requirements.edit.question ? (
                  <>
                    <Grid item xs={12}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                          <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} md={8}>
                              <Typography variant="body2">
                                Specify your question
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs>
                              <TextField
                                fullWidth
                                required
                                name="question"
                                value={requirements.question}
                                label="I am interested in"
                                placeholder="e.g., knowing how often these learning materials are viewed by my students."
                                onChange={handleFormData}
                              />
                            </Grid>

                            <Grid item>
                              <style>
                              {`
                              @keyframes checkmark-bounce {
                                0% { transform: scale(1);}
                                30% { transform: scale(1.18);}
                                60% { transform: scale(0.95);}
                                100% { transform: scale(1.15);}
                              }
                              .custom-checkmark-btn {
                                background-color: #1976d2 !important;
                                color: #fff !important;
                                transition: background 0.2s, color 0.2s;
                              }
                              .custom-checkmark-btn:hover:not(:disabled) {
                                background-color: #fff !important;
                                color: #1976d2 !important;
                                border: 1.5px solid #1976d2 !important;
                              }
                              `}
                              </style>
                              <Tooltip title="Confirm">
                                <span>
                                  <IconButton
                                    className={
                                      requirements.question.length > 0 && requirements.edit.question
                                        ? 'custom-checkmark-btn'
                                        : ''
                                    }
                                    onClick={handleToggleQuestionEdit}
                                    disabled={requirements.question.length < 1}
                                    sx={
                                      requirements.question.length > 0 && requirements.edit.question
                                        ? {
                                            animation: 'checkmark-bounce 0.7s',
                                            transform: 'scale(1.15)',
                                            boxShadow: '0 0 8px #1976d2',
                                          }
                                        : undefined
                                    }
                                  >
                                    <DoneIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={8}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                              <Typography>
                                <i>Your question:</i> I am interested in{" "}
                                <b>{requirements.question}</b>
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Edit your question">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={handleToggleQuestionEdit}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </>
            )}

            {requirements.show.indicatorName && (
              <>
                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={8}>
                          <Typography variant="body2">
                            Specify your indicator
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                          <TextField
                            fullWidth
                            required
                            name="indicatorName"
                            value={requirements.indicatorName}
                            label="I need an indicator showing"
                            placeholder="e.g., the number of views of learning materials and sort by the most viewed ones."
                            onChange={handleFormData}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <DataList />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
        <AccordionActions sx={{ py: 2 }}>
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={
                    requirements.goalType.verb === "" ||
                    requirements.goal === "" ||
                    requirements.question === "" ||
                    requirements.indicatorName === ""
                  }
                  onClick={handleUnlockPath}
                >
                NEXT
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Do you want to update the changes in the following steps</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeclineChange}>Disagree</Button>
              <Button onClick={handleConfirmChange} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </AccordionActions>
      </Accordion>
    </>
  );
};

export default SpecifyRequirements;
