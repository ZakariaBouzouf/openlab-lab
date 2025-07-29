import React, { useState } from 'react';
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
  styled,
  Tooltip,
  Chip
} from '@mui/material';
import { Add } from '@mui/icons-material';

const Tables = ({ col, rowws }) => {
  const [columns, setColumns] = useState([
    { id: 'col1', name: 'Name', type: 'text' },
    { id: 'col2', name: 'Status', type: 'text' },
    { id: 'col3', name: 'Priority', type: 'text' }
  ]);

  const [rows, setRows] = useState([
    { id: 'row1', col1: 'Task 1', col2: 'In Progress', col3: 'High' },
    { id: 'row2', col1: 'Task 2', col2: 'Completed', col3: 'Medium' },
    { id: 'row3', col1: 'Task 3', col2: 'Not Started', col3: 'Low' }
  ]);

  const [hoveredCell, setHoveredCell] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [editingCell, setEditingCell] = useState(null);

  const addColumn = () => {
    const newColumnId = `col${columns.length + 1}`;
    const newColumn = {
      id: newColumnId,
      name: `Column ${columns.length + 1}`,
      type: 'text'
    };

    setColumns([...columns, newColumn]);

    // Add empty values for the new column in all existing rows
    setRows(rows.map(row => ({
      ...row,
      [newColumnId]: ''
    })));
  };

  const addRow = () => {
    const newRowId = `row${rows.length + 1}`;
    const newRow = { id: newRowId };

    // Initialize all column values as empty strings
    columns.forEach(col => {
      newRow[col.id] = '';
    });

    setRows([...rows, newRow]);
  };

  const updateCell = (rowId, columnId, value) => {
    setRows(rows.map(row =>
      row.id === rowId ? { ...row, [columnId]: value } : row
    ));
  };

  const updateColumnName = (columnId, newName) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, name: newName } : col
    ));
  };

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
  console.log("Data-TAble | column", col)
  console.log("Data-TAble | row", rowws)
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


  return (
    <Box sx={{ position: 'relative', p: 2 }}>
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
                {col.map((column) => (
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
              {rowws.map((row) => (
                <TableRow key={row.id}>
                  {col.map((column) => (
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
