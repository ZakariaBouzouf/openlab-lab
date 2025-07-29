import React, { useState, useEffect, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Box,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { ISCContext } from '../../indicator-specification-card';
import { v4 as uuidv4 } from "uuid"
import { enqueueSnackbar } from 'notistack';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[50],
  fontWeight: 600,
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-underline:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:hover:before': {
    borderBottom: 'none',
  },
  '& .MuiInput-underline:after': {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
  },
  '& .MuiInputBase-input': {
    padding: '4px 0',
  },
}));

// Mock UUID generator
// const generateUUID = () => {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     const r = Math.random() * 16 | 0;
//     const v = c === 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// };

const Tables = ({ initialColumns = [], initialRows = [], onColumnsChange, onRowsChange,addColumn }) => {
  // Default data if no props provided
  const { dataset, setDataset } = useContext(ISCContext)
  const defaultColumns = [
    {
      "field": "9adf092a-feed-47a7-abd2-0d156e9e8e88",
      "headerName": "subject",
      "sortable": false,
      "editable": true,
      "width": 200,
      "type": "string",
      "dataType": {
        "value": "Categorical",
        "type": "string",
        "description": "Groups information into specific categories or labels without any order or ranking."
      }
    },
    {
      "field": "27a0a60a-4207-434d-a678-f44f56109021",
      "headerName": "grades",
      "sortable": false,
      "editable": true,
      "width": 200,
      "type": "number",
      "dataType": {
        "value": "Numerical",
        "type": "number",
        "description": "Uses numbers to describe things like age, height, or income that can be counted or measured."
      },
      "align": "left",
      "headerAlign": "left"
    }
  ];

  const defaultRows = [
    {
      "id": "8ebc1af9-8e6e-4c3b-ad80-ed83378843f2",
      "9adf092a-feed-47a7-abd2-0d156e9e8e88": "subject 1",
      "27a0a60a-4207-434d-a678-f44f56109021": 0
    },
    {
      "id": "781d7dc4-fa0a-416d-87f8-98789da62ee0",
      "9adf092a-feed-47a7-abd2-0d156e9e8e88": "subject 2",
      "27a0a60a-4207-434d-a678-f44f56109021": 0
    },
    {
      "id": "f0836f39-b256-4b94-977e-fcfe59983c53",
      "9adf092a-feed-47a7-abd2-0d156e9e8e88": "subject 3",
      "27a0a60a-4207-434d-a678-f44f56109021": 0
    }
  ];

  const [columns, setColumns] = useState(initialColumns.length > 0 ? initialColumns : defaultColumns);
  const [rows, setRows] = useState(initialRows.length > 0 ? initialRows : defaultRows);
  const [editingCell, setEditingCell] = useState(null);

  // Update parent when columns or rows change
  useEffect(() => {
    if (onColumnsChange) {
      onColumnsChange(columns);
    }
  }, [columns, onColumnsChange]);

  // useEffect(() => {
  //     onRowsChange(rows);
  // }, [rows ]);
  //
    const addRow = () => {
    let tempColumnData = dataset.columns;
    const newRow = { id: uuidv4() };
      tempColumnData.forEach((column) => {
        newRow[column.field] = column.type === "number" ? 0 : "";
    });

    setDataset((prevState) => ({
      ...prevState,
      rows: [...prevState.rows, newRow],
    }));

    const updatedRows = [...rows, newRow];
    setRows(updatedRows);

    enqueueSnackbar("New row(s) added successfully", {
      variant: "success",
    });
  };

  const handleAddNewColumn2 = () => {
    let fieldUUID = uuidv4();
    const newColumnData = [
      ...dataset.columns,
      {
        field: fieldUUID,
        headerName: state.columnName.value,
        sortable: false,
        editable: true,
        width: 200,
        type: state.typeSelected.type,
      },
    ];
    let newRows = [];
    if (Boolean(dataset.rows.length)) {
      newRows = dataset.rows.map((row, index) => ({
        ...row,
        [fieldUUID]:
          state.typeSelected.type === "string"
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
    setColumns(newColumnData)

    setDataset((prevState) => ({
      ...prevState,
      rows: newRows,
      columns: newColumnData,
    }));

    enqueueSnackbar("New column added successfully", {
      variant: "success",
    });
    toggleOpen();
    console.log("Col" , newRows,newColumnData)
  };

  const updateCell = (rowId, field, value) => {
    const column = columns.find(col => col.field === field);
    let processedValue = value;

    // Type conversion based on column type
    if (column && column.type === 'number') {
      processedValue = value === '' ? 0 :  parseInt(value, 10)|| 0;
    }

    const updatedRows = rows.map(row =>
      row.id === rowId ? { ...row, [field]: processedValue } : row
    );
    setRows(updatedRows);
    setDataset(prev => ({
      ...prev,
      rows: prev.rows.map(row  => 
      row.id === rowId ? { ...row, [field]: value } : row
      )
    }));

  };

  const updateColumnName = (field, newName) => {
    const updatedColumns = columns.map(col =>
      col.field === field ? { ...col, headerName: newName } : col
    );
    setColumns(updatedColumns);

    setDataset(prev => ({
      ...prev,
      columns: updatedColumns
    }));

  };

  const handleCellClick = (rowId, field) => {
    const column = columns.find(col => col.field === field);
    if (column && column.editable) {
      setEditingCell(`${rowId}-${field}`);
    }
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleColumnHeaderClick = (field) => {
    setEditingCell(`header-${field}`);
  };

  const handleKeyDown = (e, rowId, field) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
    }
  };

  const getCellValue = (row, field) => {
    return row[field] !== undefined ? row[field] : '';
  };

  const getDataTypeColor = (dataType) => {
    switch (dataType?.type) {
      case 'number':
        return 'primary';
      case 'string':
        return 'secondary';
      default:
        return 'default';
    }
  };

  console.log("Data-TAble | column", initialColumns)
  console.log("Data-TAble | row", initialRows)
  return (
    <Box sx={{ p: 2, position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          '&:hover .add-column-zone': {
            opacity: 1
          },
          '&:hover .add-row-zone': {
            opacity: 1
          }
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 'fit-content',
            border: '1px solid #e0e0e0',
            borderRadius: 1
          }}
        >
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableHeaderCell
                    key={column.field}
                    sx={{
                      width: column.width || 200,
                      textAlign: column.headerAlign || 'left'
                    }}
                    onClick={() => handleColumnHeaderClick(column.field)}
                  >
                    {editingCell === `header-${column.field}` ? (
                      <StyledTextField
                        value={column.headerName}
                        onChange={(e) => updateColumnName(column.field, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => handleKeyDown(e, null, column.field)}
                        variant="standard"
                        size="small"
                        autoFocus
                        fullWidth
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {column.headerName}
                        </Typography>
                        <Tooltip title={column.dataType?.description || ''}>
                          <Chip
                            label={column.dataType?.value || column.type}
                            size="small"
                            variant="outlined"
                            color={getDataTypeColor(column.dataType)}
                            sx={{ fontSize: '0.75rem', height: '20px' }}
                          />
                        </Tooltip>
                      </Box>
                    )}
                  </StyledTableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={`${row.id}-${column.field}`}
                      sx={{
                        width: column.width || 200,
                        textAlign: column.align || 'left'
                      }}
                      onClick={() => handleCellClick(row.id, column.field)}
                    >
                      {editingCell === `${row.id}-${column.field}` ? (
                        <StyledTextField
                          type={column.type === 'number' ? 'number' : 'text'}
                          value={getCellValue(row, column.field)}
                          onChange={(e) => updateCell(row.id, column.field, e.target.value)}
                          onBlur={handleCellBlur}
                          onKeyDown={(e) => handleKeyDown(e, row.id, column.field)}
                          variant="standard"
                          size="small"
                          autoFocus
                          fullWidth
                        />
                      ) : (
                        <Typography variant="body2">
                          {getCellValue(row, column.field)}
                        </Typography>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      {/* Add Column Button */}
      <Box
        className="add-column-zone"
        sx={{
          position: 'absolute',
          top: 0,
          right: -40,
          height: '100%',
          width: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          zIndex: 10
        }}
      >
        <IconButton
          onClick={addColumn}
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>

      {/* Add Row Button */}
      <Box
        className="add-row-zone"
        sx={{
          position: 'absolute',
          bottom: -40,
          left: 0,
          width: '100%',
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.2s ease',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 1,
          zIndex: 10
        }}
      >
        <IconButton
          onClick={addRow}
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            width: 28,
            height: 28,
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
      </Box>
    </Box>
  );
};

export default Tables;
