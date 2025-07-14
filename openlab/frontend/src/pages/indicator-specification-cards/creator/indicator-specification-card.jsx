import React, { createContext, useEffect, useRef, useState } from "react";
import { Divider, Typography, Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SpecifyRequirements from "./components/specify-requirements/specify-requirements.jsx";
import ChoosePath from "./components/choose-path/choose-path.jsx";
import Visualization from "./components/visualization/visualization.jsx";
import Dataset from "./components/dataset/dataset.jsx";
import Finalize from "./components/finalize/finalize.jsx";
import Method from "./components/method/method.jsx"
import { useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

export const ISCContext = createContext(undefined);

const IndicatorSpecificationCard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [id, setId] = useState(() => {
    const savedState = sessionStorage.getItem("session_isc");
    return savedState
      ? JSON.parse(savedState).id
        ? JSON.parse(savedState).id
        : null
      : null;
  });

  const [requirements, setRequirements] = useState(() => {
    const savedState = sessionStorage.getItem("session_isc");
    return savedState
      ? JSON.parse(savedState).requirements
      : {
          goalType: {
            verb: "",
          },
          goal: "",
          question: "",
          indicatorName: "",
          data: [
            {
              value: "",
              placeholder: "e.g., name of materials",
              type: {},
            },
            { value: "", placeholder: "e.g., number of downloads", type: {} },
          ],
          selectedPath: "",
          selectedMethod: "",
          edit: {
            goal: true,
            question: true,
            indicatorName: true,
          },
          show: {
            goal: false,
            question: false,
            indicatorName: false,
          },
        };
  });

  const [dataset, setDataset] = useState(() => {
    const savedState = sessionStorage.getItem("session_isc");
    return savedState
      ? JSON.parse(savedState).dataset
      : {
          file: { name: "",uploaded: false },
          rows: [],
          columns: [],
        };
  });

  const [visRef, setVisRef] = useState(() => {
    const savedState = sessionStorage.getItem("session_isc");
    return savedState
      ? JSON.parse(savedState).visRef
      : {
          filter: {
            type: "",
          },
          chart: {
            type: "",
          },
          data: {
            series: [],
            options: {},
            axisOptions: {
              selectedXAxis: "",
              selectedYAxis: "",
              selectedLabel: "",    // * StackedBar/Line
              selectedBarValue: "", // * StackedBar/Line
              selectedCategory: "", // * TreeMap
              selectedXValue: "",   // * TreeMap
              selectedValue: "",    // * TreeMap
              xAxisOptions: [],
              yAxisOptions: [],
              labelOptions: [],     // * StackedBar/Line
              barValueOptions: [],  // * StackedBar/Line
              categoryOptions: [],  // * TreeMap
              xValueOptions: [],    // * TreeMap
              valueOptions: [],     // * TreeMap
            },
          },
          edit: false,
        };
  });

  const [lockedStep, setLockedStep] = useState(() => {
    const savedState = sessionStorage.getItem("session_isc");
    return savedState
      ? JSON.parse(savedState).lockedStep
      : {
          requirements: {
            locked: false,
            openPanel: true,
            step: "1",
          },
          path: { locked: true, openPanel: false, step: "2" },
          visualization: {
            locked: true,
            openPanel: false,
            step: "0",
          },
          dataset: {
            locked: true,
            openPanel: false,
            step: "0",
          },
          finalize: {
            locked: true,
            openPanel: false,
            step: "6",
          },
          method:{
            locked: true,
            type:"",
            openPanel: false,
            step:"0"
          },
          manual:{
            locked:true,
            openPanel: false,
          },
          upload:{
            locked:true,
            openPanel: false,
          },
        };
  });

  const prevDependencies = useRef({
    requirements,
    dataset,
    visRef,
    lockedStep,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      let session_isc = {
        id,
        requirements,
        dataset,
        visRef,
        lockedStep,
      };
      // TODO: Add date to the session
      sessionStorage.setItem("session_isc", JSON.stringify(session_isc));

      // Check if any of the dependencies have changed
      if (
        prevDependencies.current.requirements !== requirements ||
        prevDependencies.current.dataset !== dataset ||
        prevDependencies.current.visRef !== visRef ||
        prevDependencies.current.lockedStep !== lockedStep
      ) {
        enqueueSnackbar("Indicator progress saved", {
          variant: "info",
          autoHideDuration: 2000,
        });
      }

      // Update the previous dependencies to the current ones
      prevDependencies.current = {
        requirements,
        dataset,
        visRef,
        lockedStep,
      };
    }, 10000);

    return () => clearInterval(intervalId);
  }, [requirements, dataset, visRef, lockedStep]);

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);

  // Reset Funktion
  const handleResetAll = () => {
    setId(null);
    setRequirements({
      goalType: { verb: "" },
      goal: "",
      question: "",
      indicatorName: "",
      data: [
        { value: "", placeholder: "e.g., name of materials", type: {} },
        { value: "", placeholder: "e.g., number of downloads", type: {} },
      ],
      selectedPath: "",
      edit: { goal: true, question: true, indicatorName: true },
      show: { goal: false, question: false, indicatorName: false },
    });
    setDataset({
      file: { name: "" },
      rows: [],
      columns: [],
    });
    setVisRef({
      filter: { type: "" },
      chart: { type: "" },
      data: {
        series: [],
        options: {},
        axisOptions: {
          selectedXAxis: "",
          selectedYAxis: "",
          selectedLabel: "",
          selectedBarValue: "",
          selectedCategory: "",
          selectedXValue: "",
          selectedValue: "",
          xAxisOptions: [],
          yAxisOptions: [],
          labelOptions: [],
          barValueOptions: [],
          categoryOptions: [],
          xValueOptions: [],
          valueOptions: [],
        },
      },
      edit: false,
    });
    setLockedStep({
      requirements: { locked: false, openPanel: true, step: "1" },
      path: { locked: true, openPanel: false, step: "2" },
      visualization: { locked: true, openPanel: false, step: "0" },
      dataset: { locked: true, openPanel: false, step: "0" },
      finalize: { locked: true, openPanel: false, step: "5" },
    });
    sessionStorage.removeItem("session_isc");
    enqueueSnackbar("All was reset.", { variant: "success" });
  };

  // Neue Handler für Dialog
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleConfirmDelete = () => {
    handleResetAll();
    setOpenDialog(false);
  };

  return (
    <>
      {/* Bestätigungsdialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Are you sure you want to delete all?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <ISCContext.Provider
        value={{
          id,
          requirements,
          setRequirements,
          lockedStep,
          setLockedStep,
          visRef,
          setVisRef,
          dataset,
          setDataset,
        }}
      >
        {/* Button und Titel in einer Zeile */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="primary"
              onClick={() => navigate("/isc")}
              sx={{ p: 0.5, mr: 1 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography>ISC Creator</Typography>
          </div>
          <Button
            variant="outlined"
            color="error"
            onClick={handleOpenDialog}
            sx={{
              ml: 2,
              minWidth: 0,
              borderRadius: "50%",
              padding: "10px",
              width: "40px",
              height: "40px",
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </div>
        <Grid container spacing={2} alignItems="center">
          {/* Delete all Button entfernt aus Grid */}
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Divider />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <SpecifyRequirements />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ChoosePath />
          </Grid>
          {lockedStep.visualization.step === "3" && (
            <Grid size={{ xs: 12 }}>
              <Visualization />
            </Grid>
          )}
          {lockedStep.dataset.step === "4" && (
            <Grid size={{ xs: 12 }}>
              <Dataset/>
            </Grid>
          )}
          {/* Adding the new step "Method" */}
          {lockedStep.dataset.step === '4' && lockedStep.method.type !== ""  &&(
            <Grid size={{ xs: 12 }}>
              <Method />
            </Grid>
          )}

          {lockedStep.dataset.step === "3" && (
            <Grid size={{ xs: 12 }}>
              <Dataset />
            </Grid>
          )}
          {lockedStep.dataset.step === '3' && lockedStep.method.type !== ""  &&(
            <Grid size={{ xs: 12 }}>
              <Method />
            </Grid>
          )}
          {lockedStep.visualization.step === "5" && (
            <Grid size={{ xs: 12 }}>
              <Visualization />
            </Grid>
          )}
          {lockedStep.visualization.step !== "0" &&
            lockedStep.dataset.step !== "0" && (
              <Grid size={{ xs: 12 }}>
                <Finalize />
              </Grid>
            )}
        </Grid>
      </ISCContext.Provider>
    </>
  );
};

export default IndicatorSpecificationCard;
