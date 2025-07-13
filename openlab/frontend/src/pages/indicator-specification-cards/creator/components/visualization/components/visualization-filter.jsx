import React, { useContext, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Grow,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataTypes, visualizations } from "../../../utils/data/config.js";
import { ISCContext } from "../../../indicator-specification-card.jsx";
import VisualizationDescription from "./visualization-description.jsx";
import { Recommend } from "@mui/icons-material";

const VisualizationFilter = () => {
  const { dataset, visRef, setVisRef } = useContext(ISCContext);
  const [warning, setWarning] = React.useState("");
  const [state, setState] = React.useState({
    openFilters: false,
    visualizationList: [],
    recommendation: false,
  });

  const handleSelectVisualization = (chart) => {
    // TODO: Recheck this
    localStorage.removeItem("categories");
    localStorage.removeItem("series");
    if (visRef.chart.type !== chart.type) {
      setVisRef((prevState) => ({
        ...prevState,
        chart: chart,
      }));
    } else {
      setVisRef((prevState) => ({
        ...prevState,
        chart: {
          type: "",
        },
      }));
    }
    // Display the description directly after selecting the chart
    // ...existing code...
  };

  useEffect(() => {
    if (visRef.filter.type === "") {
      setState((prevState) => ({
        ...prevState,
        visualizationList: visualizations,
      }));
    } else {
      let tempVisualizationList = [];
      visualizations.forEach((visualization) => {
        if (visualization.filters.includes(visRef.filter.type)) {
          tempVisualizationList.push(visualization);
        }
      });
      setState((prevState) => ({
        ...prevState,
        visualizationList: tempVisualizationList,
      }));
    }
  }, [visRef.filter.type]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      recommendation: checkRecommendation(prevState.visualizationList),
    }));
  }, [dataset.columns]);

  const columnTypes = dataset.columns.map((col) => col.type);

  const checkRecommendation = (visualizations) => {
    for (let viz of visualizations) {
      if (checkVisualizationRecommendation(viz, columnTypes)) {
        return true;
      }
    }
    return false;
  };

  const getColumnTypeCounts = (visualization, columnTypes) => {
    // Count the total required columns for each type
    let requiredCategorical = 0;
    let requiredNumerical = 0;
    let requiredCatOrdered = 0;

    visualization.dataTypes.forEach((dataType) => {
      if (dataType.type === DataTypes.categorical) {
        requiredCategorical += dataType.required;
      } else if (dataType.type === DataTypes.numerical) {
        requiredNumerical += dataType.required;
      } else if (dataType.type === DataTypes.catOrdered) {
        requiredCatOrdered += dataType.required;
      }
    });

    // Count the available columns of each type in the dataset
    const availableStrings = columnTypes.filter(
      (type) => type === "string"
    ).length;
    const availableNumbers = columnTypes.filter(
      (type) => type === "number"
    ).length;
    const availableCatOrdered = columnTypes.filter(
      (type) => type === "catOrdered"
    ).length;

    return {
      requiredCategorical,
      requiredNumerical,
      requiredCatOrdered,
      availableStrings,
      availableNumbers,
      availableCatOrdered,
    };
  };

  const checkVisualizationRecommendation = (visualization, columnTypes) => {
    const {
      requiredCategorical,
      requiredNumerical,
      requiredCatOrdered,
      availableStrings,
      availableNumbers,
      availableCatOrdered,
    } = getColumnTypeCounts(visualization, columnTypes);

    const hasCategorical = availableStrings >= requiredCategorical;
    const hasNumerical = availableNumbers >= requiredNumerical;
    const hasCatOrdered = availableCatOrdered >= requiredCatOrdered;

    return hasCategorical && hasNumerical && hasCatOrdered;
  };

  // Missing data types
  const getMissingDataTypes = (visualization, columnTypes) => {
    const {
      requiredCategorical,
      requiredNumerical,
      requiredCatOrdered,
      availableStrings,
      availableNumbers, 
      availableCatOrdered,
    } = getColumnTypeCounts(visualization, columnTypes);

    const missing = [];

    if (availableStrings < requiredCategorical) {
      const count = requiredCategorical - availableStrings;
      missing.push(`${count} categorical column${count > 1 ? "s" : ""}`);
    }

    if (availableCatOrdered < requiredCatOrdered) {
      const count = requiredCatOrdered - availableCatOrdered;
      missing.push(`${count} ordinal column${count > 1 ? "s" : ""}`);
    }

    if (availableNumbers < requiredNumerical) {
      const count = requiredNumerical - availableNumbers;
      missing.push(`${count} numerical column${count > 1 ? "s" : ""}`);
    }

    return missing;
  };

   // Warning for missing data types
  const onChartClick = (visualization) => {
    handleSelectVisualization(visualization);
    const meetsRequirements = checkVisualizationRecommendation(visualization, columnTypes);
    if (!meetsRequirements) {
      const missing = getMissingDataTypes(visualization, columnTypes);
      setWarning(`Missing data: Please add ${missing.join(" and ")} to your dataset.`);
    } else {
      setWarning("");
    }
  };
  
  const handleToggleShowDescription = () => {
    setState((prevState) => ({
      ...prevState,
      showDescription: !prevState.showDescription,
    }));
  };

  return (
    <>
      <Accordion variant="outlined" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <b>Available charts</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="center">
                {visRef.filter.type && (
                  <Grid item xs={12}>
                    <Typography align="center" variant="body2">
                      Chart(s) recommended based on chart type:{" "}
                      <b>{visRef.filter.type}</b>
                    </Typography>
                  </Grid>
                )}

                {state.visualizationList
                  .sort((a, b) => a.type.localeCompare(b.type))
                  .map((visualization, index) => {
                    if (visualization.enable) {
                      return (
                        <Grid
                          key={index}
                          item
                          xs={6}
                          sm={4}
                          md={2}
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            onChartClick(visualization)
                          }
                        >
                          <Grid container spacing={2}>
                            <Grid item xs>
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <Tooltip
                                    arrow
                                    title={
                                      <Typography
                                        variant="body2"
                                        sx={{ p: 1, whiteSpace: "pre-line" }}
                                      >
                                        {visualization.description}
                                      </Typography>
                                    }
                                  >
                                    <Paper
                                      variant="outlined"
                                      sx={{
                                        pb: 1,
                                        pt: 2,
                                        "&:hover": {
                                          boxShadow: 5,
                                        },
                                        border:
                                          visRef.chart.type ===
                                          visualization.type
                                            ? "2px solid #F57C00"
                                            : "",
                                      }}
                                    >
                                      <Grid
                                        container
                                        direction="column"
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          <Box
                                            component="img"
                                            src={visualization.image}
                                            height="48px"
                                          />
                                        </Grid>
                                        <Grid item xs={12}>
                                          <Grid container alignItems="center">
                                            {checkVisualizationRecommendation(
                                              visualization,
                                              columnTypes
                                            ) && (
                                              <Grid item>
                                                <Recommend color="success" />
                                              </Grid>
                                            )}
                                            <Grid item xs>
                                              <Typography
                                                variant="body2"
                                                gutterBottom
                                              >
                                                {visualization.type}
                                              </Typography>
                                            </Grid>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    </Paper>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Grid>
                            {visRef.chart.type === visualization.type && warning && (
                              <Grid item xs={12}>
                                <Typography
                                  variant="body2"
                                  color="error"
                                  sx={{ mt: 1, textAlign: "center" }}
                                >
                                  {warning}
                                </Typography>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      );
                    }
                  })}
                {state.recommendation && (
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Recommend color="success" />
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="body2">
                          Recommendations are based on your dataset
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {Boolean(visRef.chart.type) && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <VisualizationDescription />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default VisualizationFilter;
