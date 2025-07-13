import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { CustomThemeContext } from "../../../../../../setup/theme-manager/theme-context-manager.jsx";
import {
  Button,
  FormControl,
  Grow,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import Grid from "@mui/material/Grid2";
import PaletteIcon from "@mui/icons-material/Palette";
import CloseIcon from "@mui/icons-material/Close";
import CustomizationPanel from "./customization-panel/customization-panel.jsx";
import { ISCContext } from "../../../indicator-specification-card.jsx";
import ChartErrorBoundary from "./chart-error-boundary.jsx";

const StackedBarChart = ({ customize = false, handleToggleCustomizePanel }) => {
  const { darkMode } = useContext(CustomThemeContext);
  const { visRef, setVisRef, dataset } = useContext(ISCContext);
  const chartRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [state, setState] = useState({
    series: [],
    configuration: {
      isShowHideLegendAvailable: true,
      isLegendPositionChangeable: true,
      isLegendPositionBottomAvailable: true,
      isLegendPositionTopAvailable: true,
      isLegendPositionLeftAvailable: true,
      isLegendPositionRightAvailable: true,
      isShowHideAxesAvailable: true,
      isShowHideXAxisAvailable: true,
      isShowHideYAxisAvailable: true,
      isChartTitleAvailable: true,
      isChartSubtitleAvailable: true,
      isTitleAndSubtitlePositionChangeable: true,
      isTitleAndSubtitlePositionCenterAvailable: true,
      isTitleAndSubtitlePositionLeftAvailable: true,
      isTitleAndSubtitlePositionRightAvailable: true,
      isShowHideLabelsAvailable: true,
      isShowHideLabelsBackgroundAvailable: true,
      isLabelsPositionChangeable: true,
      isLabelsPositionTopAvailable: true,
      isLabelsPositionCenterAvailable: true,
      isSeriesColorChangeable: true,
      isSeriesSingleColor: false,
      isSeriesMultipleColor: true,
      isSortingOrderChangeable: false,
      isLegendTextColorAvailable: true,
      isDataLabelsColorAvailable: true,
      isDataLabelsWithBackgroundColorAvailable: true,
      isShowHideXAxisTitleAvailable: true,
      isShowHideYAxisTitleAvailable: true,
      isShowHideAxesTitleAvailable: true,
      isSortingOrderAscendingAvailable: false,
      isSortingOrderDescendingAvailable: false,
      isCategoriesFilteringAvailable: true,
    },
    options: visRef?.edit
      ? visRef.data?.options || {}
      : {
          chart: {
            type: visRef?.chart?.code || "bar",
            id: visRef?.chart?.code || "bar",
            stacked: true,
            width: "100%",
            foreColor: darkMode ? "#ffffff" : "#000000",
            toolbar: {
              show: false,
              autoSelected: "zoom",
            },
          },
          labels: [],
          title: {
            text: "",
            align: "left",
            style: {
              fontSize: 18,
              cssClass: "x-y-axis-hide-title",
            },
          },
          subtitle: {
            text: "",
            align: "left",
            margin: 15,
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
              dataLabels: {
                position: "top",
              },
            },
          },
          xaxis: {
            categories: [],
            title: {
              text: "Group By",
              style: {
                cssClass: "x-y-axis-show-title",
              },
            },
            style: {
              cssClass: "x-y-axis-show-title",
            },
            labels: {
              show: true,
            },
          },
          yaxis: {
            title: {
              text: "Counts",
              style: {
                cssClass: "x-y-axis-show-title",
              },
            },
            style: {
              cssClass: "x-y-axis-show-title",
            },
            labels: {
              show: true,
              formatter: (value) => value.toLocaleString(),
            },
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            position: "bottom",
            horizontalAlign: "center",
            labels: {
              colors: undefined,
              useSeriesColors: false,
            },
            onItemClick: {
              toggleDataSeries: false,
            },
          },
          colors: [],
          dataLabels: {
            enabled: true,
            style: {
              colors: ["#000000"],
              fontWeight: 400,
            },
            background: {
              enabled: false,
              foreColor: "#ffffff",
              padding: 10,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: "#ffffff",
            },
          },
          tooltip: {
            enabled: true,
            followCursor: true,
            theme: darkMode ? "dark" : "light",
            onDatasetHover: {
              highlightDataSeries: true,
            },
          },
        },
    axisOptions: {
      xAxisOptions: [],
      yAxisOptions: [],
      barValueOptions: [],
      selectedXAxis: "",
      selectedBarValue: "",
      selectedYAxis: "",
    },
  });

  // * This effect is used to update the chart when the dark mode changes.
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        chart: {
          ...prevState.options.chart,
          foreColor: darkMode ? "#ffffff" : "#000000",
        },
        tooltip: {
          ...prevState.options.tooltip,
          theme: darkMode ? "dark" : "light",
        },
      },
    }));
  }, [darkMode]);

  useEffect(() => {
    // Add safety checks for dataset
    if (!dataset || !dataset.columns || dataset.columns.length === 0) {
      return;
    }
    
    const stringColumns = dataset.columns.filter(
      (col) => col.type === "string"
    );
    const numberColumns = dataset.columns.filter(
      (col) => col.type === "number"
    );
    
    setState((prevState) => ({
      ...prevState,
      axisOptions: {
        ...prevState.axisOptions,
        xAxisOptions: stringColumns,
        yAxisOptions: numberColumns,
        barValueOptions: stringColumns,
      },
    }));
    
    setVisRef((prevVisRef) => ({
      ...prevVisRef,
      data: {
        ...prevVisRef.data,
        axisOptions: {
          ...prevVisRef.data.axisOptions,
          xAxisOptions: stringColumns,
          barValueOptions: stringColumns,
          yAxisOptions: numberColumns,
        },
      },
      edit: false,
    }));
  }, [dataset?.columns?.length]); // Avoid errors by using optional chaining

  // * Executes only when dataset changes.
  // * This effect is used to populate the xAxis, yAxis, and groupBy options.
  // * If new dataset or new column is provided, it will set the xAxis and yAxis options based on the dataset columns.
  useEffect(() => {
    // Add safety checks
    if (!dataset || !dataset.columns || dataset.columns.length === 0) {
      return;
    }
    
    const selectedXAxis =
      visRef?.data?.axisOptions?.selectedXAxis || state.axisOptions.selectedXAxis;
    const selectedYAxis =
      visRef?.data?.axisOptions?.selectedYAxis || state.axisOptions.selectedYAxis;
    const selectedBarValue =
      visRef?.data?.axisOptions?.selectedBarValue ||
      state.axisOptions.selectedBarValue;
    const stringColumns =
      visRef?.data?.axisOptions?.xAxisOptions || state.axisOptions.xAxisOptions;
    const numberColumns =
      visRef?.data?.axisOptions?.yAxisOptions || state.axisOptions.yAxisOptions;

    // Ensure we have valid arrays
    if (!Array.isArray(stringColumns) || !Array.isArray(numberColumns)) {
      return;
    }

    let updatedSelectedXAxis = "";
    if (visRef?.edit && selectedXAxis && selectedXAxis.length !== 0)
      updatedSelectedXAxis = selectedXAxis;
    else if (selectedXAxis && selectedXAxis.length !== 0)
      updatedSelectedXAxis =
        stringColumns.find((col) => col.field === selectedXAxis)?.field ||
        (stringColumns.length > 0 ? stringColumns[0]?.field || "" : "");
    else
      updatedSelectedXAxis =
        stringColumns.length > 0 ? stringColumns[0]?.field || "" : "";

    let updatedSelectedYAxis = "";
    if (visRef?.edit && selectedYAxis && selectedYAxis.length !== 0)
      updatedSelectedYAxis = selectedYAxis;
    else if (selectedYAxis && selectedYAxis.length !== 0)
      updatedSelectedYAxis =
        numberColumns.find((col) => col.field === selectedYAxis)?.field ||
        (numberColumns.length > 1
          ? numberColumns[1]?.field || ""
          : numberColumns.length > 0 
          ? numberColumns[0]?.field || ""
          : "");
    else
      updatedSelectedYAxis =
        numberColumns.length > 0 ? numberColumns[0]?.field || "" : "";

    let updatedSelectedBarValue = "";
    if (visRef?.edit && selectedBarValue && selectedBarValue.length !== 0)
      updatedSelectedBarValue = selectedBarValue;
    else if (selectedBarValue && selectedBarValue.length !== 0)
      updatedSelectedBarValue =
        stringColumns.find((col) => col.field === selectedBarValue)?.field ||
        (stringColumns.length > 0 ? stringColumns[0]?.field || "" : "");
    else
      updatedSelectedBarValue =
        stringColumns.length > 1
          ? stringColumns[1]?.field || ""
          : stringColumns.length > 0
          ? stringColumns[0]?.field || ""
          : "";

    setState((prevState) => ({
      ...prevState,
      axisOptions: {
        ...prevState.axisOptions,
        selectedXAxis: updatedSelectedXAxis,
        selectedBarValue: updatedSelectedBarValue,
        selectedYAxis: updatedSelectedYAxis,
      },
    }));
  }, [
    visRef.data?.axisOptions?.xAxisOptions?.length,
    visRef.data?.axisOptions?.yAxisOptions?.length,
    visRef.data?.axisOptions?.barValueOptions?.length,
  ]);

  useEffect(() => {
    const { selectedXAxis, selectedBarValue, selectedYAxis } =
      state.axisOptions;
    
    // Add safety checks for dataset and columns
    if (!dataset || !dataset.columns || !dataset.rows || dataset.rows.length === 0) {
      setState((prevState) => ({
        ...prevState,
        series: [],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: [],
          },
        },
      }));
      return;
    }

    const xAxisColumn = dataset.columns.find(
      (col) => col.field === selectedXAxis
    );
    const yAxisColumn = dataset.columns.find(
      (col) => col.field === selectedYAxis
    );
    const barValueColumn = dataset.columns.find(
      (col) => col.field === selectedBarValue
    );
    
    // Enhanced validation
    if (!xAxisColumn || !yAxisColumn || !barValueColumn || 
        !selectedXAxis || !selectedYAxis || !selectedBarValue) {
      return;
    }

    try {
      // * Group and sum values by xAxis with enhanced error handling
      const aggregatedData = dataset.rows.reduce((acc, row, index) => {
        // Ensure row exists and has required fields
        if (!row || typeof row !== 'object') {
          console.warn(`Skipping invalid row at index ${index}:`, row);
          return acc;
        }
        
        // Get values with safe fallbacks
        const categoryValue = row[selectedXAxis];
        const numericValue = row[selectedYAxis];
        const barLabelValue = row[selectedBarValue];
        
        // Skip row if critical values are missing
        if (categoryValue == null || numericValue == null) {
          console.warn(`Skipping row ${index} due to missing values:`, {
            category: categoryValue,
            numeric: numericValue,
            barLabel: barLabelValue
          });
          return acc;
        }
        
        // Convert and validate values
        const category = String(categoryValue).trim();
        const value = Number(numericValue);
        const barLabel = String(barLabelValue || "Unknown").trim();
        
        // Skip if conversion failed
        if (!category || isNaN(value)) {
          console.warn(`Skipping row ${index} due to invalid conversion:`, {
            originalCategory: categoryValue,
            category,
            originalValue: numericValue,
            value,
            barLabel
          });
          return acc;
        }
        
        // Initialize category if it doesn't exist
        if (!acc[category]) {
          acc[category] = { name: category, data: {} };
        }
        
        // Initialize bar label if it doesn't exist
        if (!acc[category].data[barLabel]) {
          acc[category].data[barLabel] = 0;
        }
        
        // Add value safely
        acc[category].data[barLabel] += value;
        return acc;
      }, {});

      const categories = Object.keys(aggregatedData);
      
      // Get all unique bar labels with safe processing
      const barLabels = Array.from(
        new Set(
          dataset.rows
            .map((row) => {
              if (!row || typeof row !== 'object') return "Unknown";
              const value = row[selectedBarValue];
              return String(value || "Unknown").trim();
            })
            .filter(label => label && label !== "")
        )
      );

      // Create series with safe data access
      const series = barLabels.map((barLabel) => ({
        name: barLabel,
        data: categories.map(
          (category) => {
            const categoryData = aggregatedData[category];
            if (!categoryData || !categoryData.data) return 0;
            return categoryData.data[barLabel] || 0;
          }
        ),
      }));
    
      // Ensure we have valid data before updating state
      if (categories.length === 0 || series.length === 0) {
        if (isMountedRef.current) {
          setState((prevState) => ({
            ...prevState,
            series: [],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: [],
              },
            },
          }));
        }
        return;
      }

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setState((prevState) => {
          let tempState = {
            ...prevState,
            series: series,
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: categories,
                title: {
                  style: {
                    cssClass: "x-y-axis-show-title",
                  },
                  text:
                    dataset.columns.find((col) => col.field === selectedXAxis)
                      ?.headerName || "Group By",
                },
              },
              yaxis: {
                ...prevState.options.yaxis,
                title: {
                  style: {
                    cssClass: "x-y-axis-show-title",
                  },
                  text:
                    dataset.columns.find((col) => col.field === selectedYAxis)
                      ?.headerName || "Counts",
                },
              },
              plotOptions: {
                ...prevState.options.plotOptions,
                bar: {
                  ...prevState.options.plotOptions.bar,
                  stacked: true,
                },
              },
            },
          };
          
          // Also update visRef safely
          if (isMountedRef.current) {
            setVisRef((prevVisRef) => ({
              ...prevVisRef,
              data: {
                ...prevVisRef.data,
                series: tempState.series,
                options: tempState.options,
                axisOptions: {
                  ...prevVisRef.data.axisOptions,
                  selectedXAxis: state.axisOptions.selectedXAxis,
                  selectedBarValue: state.axisOptions.selectedBarValue,
                  selectedYAxis: state.axisOptions.selectedYAxis,
                },
              },
            }));
          }
          
          return tempState;
        });
      }
    } catch (error) {
      console.error("Error processing stacked bar chart data:", error);
      // Set empty state on error only if component is mounted
      if (isMountedRef.current) {
        setState((prevState) => ({
          ...prevState,
          series: [],
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: [],
            },
          },
        }));
      }
    }
  }, [
    dataset?.rows?.length,
    state.axisOptions.selectedXAxis,
    state.axisOptions.selectedYAxis,
    state.axisOptions.selectedBarValue,
  ]);

  useEffect(() => {
    if (isMountedRef.current) {
      setVisRef((prevVisRef) => ({
        ...prevVisRef,
        data: {
          ...prevVisRef.data,
          series: state.series,
          options: state.options,
          axisOptions: state.axisOptions,
        },
      }));
    }
  }, [state.series.length, state.axisOptions.selectedXAxis, state.axisOptions.selectedYAxis, state.axisOptions.selectedBarValue]); // 修改依赖项避免循环

  const handleXAxisChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      axisOptions: {
        ...prevState.axisOptions,
        selectedXAxis: event.target.value,
      },
    }));
  }, []);

  const handleBarValueChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      axisOptions: {
        ...prevState.axisOptions,
        selectedBarValue: event.target.value,
      },
    }));
  }, []);

  const handleYAxisChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      axisOptions: {
        ...prevState.axisOptions,
        selectedYAxis: event.target.value,
      },
    }));
  }, []);

  // Get selected column
  const selectedXAxisColumn = state.axisOptions.xAxisOptions.find(
    (col) => col.field === state.axisOptions.selectedXAxis
  );

  const selectedYAxisColumn = state.axisOptions.yAxisOptions.find(
    (col) => col.field === state.axisOptions.selectedYAxis
  );

  const selectedStackColumn = state.axisOptions.barValueOptions.find(
    (col) => col.field === state.axisOptions.selectedBarValue
  );

  // Determine the label to show based on the column type
  const xAxisColumnType = selectedXAxisColumn
    ? (selectedXAxisColumn.type === "string" ? "Categorical" : "Numerical")
    : "No Data"; // optional fallback if no column is selecte

  const yAxisColumnType = selectedYAxisColumn
    ? (selectedYAxisColumn.type === "string" ? "Categorical" : "Numerical")
    : "No Data"; // optional fallback if no column is selected

  const stackColumnType = selectedStackColumn
    ? (selectedStackColumn.type === "string" ? "Categorical" : "Numerical")
    : "No Data"; // optional fallback if no column is selected

  const xAxisLabel = `X-Axis: Group By (${xAxisColumnType})`;
  const yAxisLabel = `Y-Axis (${yAxisColumnType})`;
  const stackLabel = `Stack Label (${stackColumnType})`;

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="x-axis-select-label">{xAxisLabel}</InputLabel>
            <Select
              labelId="x-axis-select-label"
              id="x-axis-select"
              value={state.axisOptions.selectedXAxis}
              onChange={handleXAxisChange}
              label={xAxisLabel}
              variant="outlined"
            >
              {state.axisOptions.xAxisOptions.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  {col.headerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Warning for X-Axis */}
          {xAxisColumnType === "No Data" && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Missing categorical data
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="bar-value-select-label">{stackLabel}</InputLabel>
            <Select
              labelId="bar-value-select-label"
              id="bar-value-select"
              value={state.axisOptions.selectedBarValue}
              onChange={handleBarValueChange}
              label={stackLabel}
              variant="outlined"
            >
              {state.axisOptions.barValueOptions.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  {col.headerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Warning for stackColumnType */}
          {stackColumnType === "No Data" && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Missing categorical data
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="y-axis-select-label">{yAxisLabel}</InputLabel>
            <Select
              labelId="y-axis-select-label"
              id="y-axis-select"
              value={state.axisOptions.selectedYAxis}
              onChange={handleYAxisChange}
              label={yAxisLabel}
              variant="outlined"
            >
              {state.axisOptions.yAxisOptions.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  {col.headerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Warning for Y-Axis */}
          {yAxisColumnType === "No Data" && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Missing numerical data
            </Typography>
          )}
        </Grid>
        {!customize && (
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2} justifyContent="flex-end">
              <Button
                startIcon={<PaletteIcon />}
                variant="contained"
                onClick={handleToggleCustomizePanel}
              >
                Customize
              </Button>
            </Grid>
          </Grid>
        )}

        <Grow in={!customize} timeout={{ enter: 500, exit: 0 }} unmountOnExit>
          <Grid size={{ xs: 12 }} sx={{ minHeight: 600 }}>
            {state.series && 
             state.series.length > 0 && 
             state.options &&
             state.options.xaxis &&
             state.options.xaxis.categories &&
             visRef?.chart?.code ? (
              <ChartErrorBoundary>
                <Chart
                  ref={chartRef}
                  options={state.options}
                  series={state.series}
                  type={visRef?.chart?.code || "bar"}
                  height="100%"
                />
              </ChartErrorBoundary>
            ) : (
              <Typography 
                variant="body1" 
                align="center" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%' 
                }}
              >
                Please select all required fields and ensure data is available to display the chart.
              </Typography>
            )}
          </Grid>
        </Grow>

        <Grow in={customize} timeout={{ enter: 500, exit: 0 }} unmountOnExit>
          <Grid size={{ xs: 12, md: 8 }} sx={{ minHeight: 600 }}>
            {state.series && 
             state.series.length > 0 && 
             state.options &&
             state.options.xaxis &&
             state.options.xaxis.categories &&
             visRef?.chart?.code ? (
              <ChartErrorBoundary>
                <Chart
                  ref={chartRef}
                  options={state.options}
                  series={state.series}
                  type={visRef?.chart?.code || "bar"}
                  height="100%"
                />
              </ChartErrorBoundary>
            ) : (
              <Typography 
                variant="body1" 
                align="center" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%' 
                }}
              >
                Please select all required fields and ensure data is available to display the chart.
              </Typography>
            )}
          </Grid>
        </Grow>
        <Grow in={customize} timeout={{ enter: 500, exit: 0 }} unmountOnExit>
          <Grid size={{ xs: 12, md: 4 }} sx={{ minHeight: 600 }}>
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>Customization panel</Typography>
              <Tooltip title="Close">
                <IconButton onClick={handleToggleCustomizePanel}>
                  <CloseIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
            <CustomizationPanel state={state} setState={setState} />
          </Grid>
        </Grow>
      </Grid>
    </>
  );
};

export default StackedBarChart;
