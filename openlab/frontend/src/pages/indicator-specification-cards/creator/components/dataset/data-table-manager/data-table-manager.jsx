import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { ISCContext } from "../../../indicator-specification-card.jsx";
import { Grid, Grid2 } from "@mui/material";
import TableHeaderBar from "./components/table-header-bar.jsx";
import Tables from "../tables.jsx";
import AddColumnDialog from "../components/add-column-dialog.jsx";


const DataTableManager = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([])

  const { dataset, setDataset } = useContext(ISCContext);

  const [state, setState] = useState({
    cellModesModel: {},
    selectionModel: [],
    value: "",
    anchorEl: null,
    page: 1,
    pageSize: 5,
    gridHeight: 1650,
    openAddColumn: false,
  });

  useEffect(() => {
    setColumns(columnTypeLabel)
    setRows(paginatedRows)
  }, [])

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

  const paginatedRows = dataset.rows.slice(
    (state.page - 1) * state.pageSize,
    state.page * state.pageSize,
  );

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
          <Tables columns={columns} setColumns={setColumns} rows={rows} setRows={setRows} addColumn={handleOpenAddColumn} />
          <AddColumnDialog
            setColumns={setColumns}
            open={state.openAddColumn}
            toggleOpen={handleOpenAddColumn}
          />
        </Grid2>
      </Grid>
    </>
  );
};

export default DataTableManager;
