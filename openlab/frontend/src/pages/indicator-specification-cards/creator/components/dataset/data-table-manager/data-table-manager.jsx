import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { ISCContext } from "../../../indicator-specification-card.jsx";
import { ClearAll as ClearAllIcon } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Grid, Grid2, IconButton, MenuItem, Paper, Table, TableContainer, TextField, Typography } from "@mui/material";
import Footer from "./components/footer.jsx";
import NoRowsOverlay from "./components/no-rows-overlay.jsx";
import ColumnMenu from "./column-menu/column-menu.jsx";
import TableHeaderBar from "./components/table-header-bar.jsx";
import { enqueueSnackbar } from "notistack";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TableRows as TableRowsIcon,
  ViewColumn as ViewColumnIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from "uuid"
import { DataTypes } from "../../../utils/data/config.js";
import AddRowDialog from "../components/add-row-dialog.jsx";
import Tables3 from "../tables3.jsx";
import Tables from "../tables.jsx";
import AddColumnDialog from "../components/add-column-dialog.jsx";


const DataTableManager = () => {
  const [rowModesModel, setRowModesModel] = useState({});
  const [showAddRowHover, setShowAddRowHover] = useState(false);
  const [showAddRowDialog, setShowAddRowDialog] = useState(false);
  const [showAddColumnHover, setShowAddColumnHover] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('string');

  const { dataset, setDataset } = useContext(ISCContext);
  const [state, setState] = useState({
    cellModesModel: {},
    selectionModel: [],
    value: "",
    anchorEl: null,
    page: 1,
    pageSize: 5,
    gridHeight: 1650,
    openAddColumn:false,
    //   typeSelected: Object.values(DataTypes)[0],
  });

  // const [state, setState] = useState({
  //   columnName: {
  //     value: "",
  //     exists: false,
  //   },
  //   numberOfRows: dataset.rows.length,
  // });

  console.log(dataset)

  const style = {
    dataGrid: {
      "& .MuiDataGrid-columnHeaders": {
        cursor: "pointer",
        fontSize: "17px",
        textDecorationLine: "underline",
      },
      "& .MuiDataGrid-cell:hover": {
        color: "primary.main",
      },
      height: state.gridHeight,
    },
  };

  useEffect(() => {
    const calculateGridHeight = () => {
      const rowHeight = 50;
      const footerHeight = 60;
      const padding = 20;

      const numRows = state.pageSize;
      const calculatedHeight = numRows * rowHeight + footerHeight + padding;
      setState((prevState) => ({
        ...prevState,
        gridHeight: calculatedHeight,
      }));
    };
    calculateGridHeight();
  }, [state.pageSize, dataset.rows]);

  const apiRef = useGridApiRef();
  const popperRef = useRef();

  const handleCellModesModelChange = useCallback((newModel) => {
    setState((prevState) => ({
      ...prevState,
      cellModesModel: newModel,
    }));
  }, [dataset]);

  const handleCellClick = useCallback((params) => {
    setState((prevState) => ({
      ...prevState,
      cellModesModel: {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevState.cellModesModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevState.cellModesModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: "view" },
              }),
              {},
            ),
          }),
          {},
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevState.cellModesModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: "view" } }),
            {},
          ),
          [params.field]: { mode: "edit" },
        },
      },
    }));
  }, []);

  const handleRowSelectionModelChange = (newSelectionModel) => {
    setState((prevState) => ({
      ...prevState,
      selectionModel: newSelectionModel,
    }));
  };

  const handleProcessRowUpdate = (updatedRow) => {
    // toggleEditPanel("", false);
    const rowIndex = dataset.rows.findIndex((row) => row.id === updatedRow.id);
    const updatedRows = [...dataset.rows];
    updatedRows[rowIndex] = updatedRow;
    setDataset((prevState) => ({
      ...prevState,
      rows: updatedRows,
    }));
    return updatedRow;
  };

  const handleColumnHeaderClick = (params) => {
    apiRef.current.showColumnMenu(params.field);
  };

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = dataset.rows.find((r) => r.id === id);
    setState((prevState) => ({
      ...prevState,
      value: row,
      anchorEl: event.currentTarget,
    }));
  };

  const handlePopperClose = (event) => {
    if (
      state.anchorEl == null ||
      popperRef.current.contains(event.nativeEvent.relatedTarget)
    ) {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      anchorEl: null,
    }));
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };



  const handleAddRow = () => {
    const id = Math.max(...dataset.rows.map((row) => row.id), 0) + 1;
    const newRow = {
      id,
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'Active',
      isNew: true,
    };
    setRows([...rows, newRow]);
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    });
    setShowAddRowHover(false);
  };

  const paginatedRows = dataset.rows.slice(
    (state.page - 1) * state.pageSize,
    state.page * state.pageSize,
  );

  const columnTypes = [
    {
      value: "Categorical",
      type: "string",
      description:
        "Groups information into specific categories or labels without any order or ranking. For example, colors like red, blue, and green are categories.",
    },
    {
      value: "Numerical",
      type: "number",
      description:
        "Uses numbers to describe things like age, height, or income that can be counted or measured.",
    },
    {
      value: "Categorical (ordinal)",
      type: "string",
      description:
        "Groups information into categories that have a specific order. For example, temperature can be categorized as low, medium, or high.",
    },
  ];

  const handleAddColumn = () => {
    let fieldUUID = uuidv4();
    console.log("dv4", fieldUUID)
    const newColumnData = [
      ...dataset.columns,
      {
        field: fieldUUID,
        headerName: newColumnName,
        sortable: false,
        editable: true,
        width: 200,
        type: newColumnType
      },
    ];
    let newRows = [];
    if (Boolean(dataset.rows.length)) {
      newRows = dataset.rows.map((row, index) => ({
        ...row,
        [fieldUUID]:
          newColumnType === "string"
            ? `${state.columnName.value} ${index + 1}`
            : 0,
      }));
    } else {
      for (let i = 0; i < state.numberOfRows; i++) {
        newRows.push({
          id: uuidv4(),
          [fieldUUID]:
            state.typeSelected.type === "string"
              ? `${state.columnName.value} ${i + 1}`
              : 0,
        });
      }
    }

    setState((prevState) => ({
      ...prevState,
      columnName: {
        ...prevState.columnName,
        value: "",
        exists: false,
      },
      typeSelected: {},
      numberOfRows: 0,
    }));

    setDataset((prevState) => ({
      ...prevState,
      rows: newRows,
      columns: newColumnData,
    }));

    enqueueSnackbar("New column added successfully", {
      variant: "success",
    });
    toggleOpen();
  };

  const handleAddOneRow = () => {
    let tempColumnData = dataset.columns
    const newRow = { id: uuidv4() }
    tempColumnData.forEach((column) => {
      newRow[column.field] = column.type === "number" ? 0 : "";
    });

    setDataset((prevState) => ({
      ...prevState,
      rows: [...prevState.rows, newRow]
    }))

    enqueueSnackbar("New row added successfully", {
      variant: "success",
    });
  }

  const dataTypeLabel = {
      string: "Categorical",
      number: "Numerical",
      catOrdered: "Categorical (ordinal)",
  };

  const columnTypeLabel = dataset.columns.map((col) => {
    const headerLabel = dataTypeLabel[col.type] || "No Column Type Selected";
    const isNumber = col.type === "number";
    return {
      ...col,
      ...(isNumber ? { align: "left", headerAlign: "left" } : {}),
      renderHeader: (params) => (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ textDecorationLine: "underline" }}>{params.colDef.headerName}</span>
          <small style={{ fontSize: "0.7rem", color: "#999" }}>{headerLabel}</small>
        </div>
      ),
    };
  });

  const handleOpenAddColumn = () => {
    setState((prevState) => ({
      ...prevState,
      openAddColumn: !prevState.openAddColumn,
    }));
  };

  return (
    <>
      <Grid spacing={2}>
        <Grid item xs={12}>
          <TableHeaderBar />
        </Grid>
        <Grid item xs={12}>
        </Grid>
        <Grid2 item justifyItems='center'>
          {/* <Tables3 col={columnTypeLabel} rowws={paginatedRows}/> */}
          <Tables  initialColumns={columnTypeLabel} initialRows={paginatedRows} addColumn={handleOpenAddColumn} />
          <AddColumnDialog
            open={state.openAddColumn}
            toggleOpen={handleOpenAddColumn}
          />
        </Grid2>
      </Grid>
    </>
  );
};

export default DataTableManager;
