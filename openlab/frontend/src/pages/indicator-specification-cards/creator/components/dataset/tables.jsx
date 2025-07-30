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
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, MoreVert, Edit, Delete } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from "uuid"
import { enqueueSnackbar } from 'notistack';
import { ISCContext } from '../../indicator-specification-card';

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


const Tables = ({ addColumn, columns, setColumns, rows, setRows }) => {
  const { dataset, setDataset } = useContext(ISCContext)
  const [editingCell, setEditingCell] = useState(null);
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

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

  const deleteRow = (rowId) => {
    const newRows = rows.filter(row => row.id !== rowId)
    setRows(newRows);

    setDataset((prevState) => ({
      ...prevState,
      rows: newRows,
    }));

    enqueueSnackbar("The row was removed successfully", {
      variant: "success",
    });

  };

  const updateCell = (rowId, field, value) => {
    const column = columns.find(col => col.field === field);
    let processedValue = value;

    // Type conversion based on column type
    if (column && column.type === 'number') {
      processedValue = value === '' ? 0 : parseInt(value, 10) || 0;
    }

    const updatedRows = rows.map(row =>
      row.id === rowId ? { ...row, [field]: processedValue } : row
    );
    setRows(updatedRows);
    setDataset(prev => ({
      ...prev,
      rows: prev.rows.map(row =>
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

  const deleteColumn = (field) => {
    const updatedColumns = columns.filter(col => col.field !== field);
    setColumns(updatedColumns);

    // Also remove the column data from all rows
    const updatedRows = rows.map(row => {
      const { [field]: removed, ...rest } = row;
      return rest;
    });
    setRows(updatedRows);

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

  const handleColumnHeaderClick = (event, field) => {
    event.stopPropagation();
    setHeaderMenuAnchor(event.currentTarget);
    setSelectedColumn(field);
  };

  const handleMenuClose = () => {
    setHeaderMenuAnchor(null);
    setSelectedColumn(null);
  };

  const handleRenameClick = () => {
    const column = columns.find(col => col.field === selectedColumn);
    setNewColumnName(column?.headerName || '');
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedColumn) {
      deleteColumn(selectedColumn);
    }
    handleMenuClose();
  };

  const handleRenameSubmit = () => {
    if (selectedColumn && newColumnName.trim()) {
      updateColumnName(selectedColumn, newColumnName.trim());
    }
    setRenameDialogOpen(false);
    setNewColumnName('');
  };

  const handleRenameCancel = () => {
    setRenameDialogOpen(false);
    setNewColumnName('');
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e, rowId, field) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
    }
  };

  const getCellValue = (row, field) => {
    return row[field] !== undefined ? row[field] : '';
  };

  // const getDataTypeColor = (dataType) => {
  //   switch (dataType?.type) {
  //     case 'number':
  //       return 'primary';
  //     case 'string':
  //       return 'secondary';
  //     default:
  //       return 'default';
  //   }
  // };

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
                <StyledTableHeaderCell sx={{ width: 15, textAlign: 'center' }}>
                </StyledTableHeaderCell>
                {columns.map((column) => (
                  <StyledTableHeaderCell
                    key={column.field}
                    sx={{
                      width: column.width || 200,
                      textAlign: column.headerAlign || 'left',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    onClick={(e) => handleColumnHeaderClick(e, column.field)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {column.headerName}
                        </Typography>
                        <Tooltip title={column.dataType?.description || ''}>
                          <Chip
                            label={column.dataType?.value || column.type}
                            size="small"
                            variant="outlined"
                            color='default'
                            sx={{ fontSize: '0.75rem', height: '20px' }}
                          />
                        </Tooltip>
                      </Box>
                      <MoreVert fontSize="small" sx={{ opacity: 0.5 }} />
                    </Box>
                  </StyledTableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover .delete-button': {
                      opacity: 1
                    }
                  }}
                >
                  {/* Actions cell with delete button */}
                  <StyledTableCell sx={{ width: 50, textAlign: 'center' }}>
                    <IconButton
                      className="delete-button"
                      onClick={() => deleteRow(row.id)}
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        color: '#d32f2f',
                        width: 24,
                        height: 24,
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.08)'
                        }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </StyledTableCell>
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

      {/* Header Context Menu */}
      <Menu
        anchorEl={headerMenuAnchor}
        open={Boolean(headerMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 150
          }
        }}
      >
        <MenuItem onClick={handleRenameClick}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Rename Column
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#d32f2f' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Column
        </MenuItem>
      </Menu>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={handleRenameCancel}>
        <DialogTitle>Rename Column</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Column Name"
            fullWidth
            variant="outlined"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameSubmit();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCancel}>Cancel</Button>
          <Button onClick={handleRenameSubmit} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </Box>);
};

export default Tables;
