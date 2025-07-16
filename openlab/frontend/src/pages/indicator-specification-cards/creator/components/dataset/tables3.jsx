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
  Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';

const Tables = ({col,rowws}) => {
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

  const handleCellClick = (rowId, columnId) => {
    setEditingCell(`${rowId}-${columnId}`);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleColumnHeaderClick = (columnId) => {
    setEditingCell(`header-${columnId}`);
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
                  <TableCell
                    key={column.id}
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#eeeeee'
                      }
                    }}
                    onClick={() => handleColumnHeaderClick(column.id)}
                  >
                    {editingCell === `header-${column.id}` ? (
                      <TextField
                        value={column.name}
                        onChange={(e) => updateColumnName(column.id, e.target.value)}
                        onBlur={handleCellBlur}
                        variant="standard"
                        size="small"
                        autoFocus
                        sx={{
                          '& .MuiInput-underline:before': { borderBottom: 'none' },
                          '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
                          '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' }
                        }}
                      />
                    ) : (
                      column.name
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowws.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f9f9f9'
                    }
                  }}
                >
                  {col.map((column) => (
                    <TableCell
                      key={`${row.id}-${column.id}`}
                      sx={{
                        border: '1px solid #e0e0e0',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                      onClick={() => handleCellClick(row.id, column.id)}
                    >
                      {editingCell === `${row.id}-${column.id}` ? (
                        <TextField
                          value={row[column.id] || ''}
                          onChange={(e) => updateCell(row.id, column.id, e.target.value)}
                          onBlur={handleCellBlur}
                          variant="standard"
                          size="small"
                          autoFocus
                          sx={{
                            width: '100%',
                            '& .MuiInput-underline:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
                            '& .MuiInput-underline:after': { borderBottom: '2px solid #1976d2' }
                          }}
                        />
                      ) : (
                        <Typography variant="body2">
                          {row[column.id] || ''}
                        </Typography>
                      )}
                    </TableCell>
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
