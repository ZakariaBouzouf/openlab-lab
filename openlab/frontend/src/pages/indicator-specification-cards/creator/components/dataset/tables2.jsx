import React, { useState } from 'react';
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Fade,
  Grid2
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  TableRows as TableRowsIcon,
  ViewColumn as ViewColumnIcon,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-main': {
            borderRadius: 12,
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #e2e8f0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f1f5f9',
            borderBottom: '2px solid #e2e8f0',
            borderRadius: '12px 12px 0 0',
          },
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#475569',
          },
        },
      },
    },
  },
});

const initialRows = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    department: 'Engineering',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Product Manager',
    department: 'Product',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Designer',
    department: 'Design',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'Data Analyst',
    department: 'Analytics',
    status: 'Active',
  },
];

const columnTypes = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'singleSelect', label: 'Select' },
];

function Tables2() {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [showAddRowHover, setShowAddRowHover] = useState(false);
  const [showAddColumnHover, setShowAddColumnHover] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('string');
  const [columns, setColumns] = useState([
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      editable: true,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      editable: true,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Active', 'Inactive'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
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
    const id = Math.max(...rows.map((row) => row.id), 0) + 1;
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

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn = {
        field: newColumnName.toLowerCase().replace(/\s+/g, '_'),
        headerName: newColumnName,
        width: 150,
        editable: true,
        type: newColumnType === 'string' ? undefined : newColumnType,
        ...(newColumnType === 'singleSelect' && {
          valueOptions: ['Option 1', 'Option 2', 'Option 3'],
        }),
      };

      const actionsColumn = columns.find(col => col.field === 'actions');
      const otherColumns = columns.filter(col => col.field !== 'actions');
      
      setColumns([...otherColumns, newColumn, actionsColumn]);
      
      // Add default values for the new column to existing rows
      setRows(rows.map(row => ({
        ...row,
        [newColumn.field]: newColumnType === 'number' ? 0 : 
                          newColumnType === 'boolean' ? false : 
                          newColumnType === 'date' ? new Date() : '',
      })));
      
      setNewColumnName('');
      setNewColumnType('string');
      setOpenColumnDialog(false);
      setShowAddColumnHover(false);
    }
  };

  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary',
      }}
    >
      <TableRowsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        No data yet
      </Typography>
      <Typography variant="body2">
        Click the + button to add your first row
      </Typography>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: 'background.default',
        py: 4,
      }}>
        <Box sx={{ 
          maxWidth: '1200px', 
          mx: 'auto', 
          px: 3,
        }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ 
              mb: 1,
              color: 'text.primary',
              fontWeight: 600,
            }}>
              Data Table
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your data with inline editing and dynamic columns
            </Typography>
          </Box>

          <Paper 
            elevation={0} 
            sx={{ 
              position: 'relative',
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              overflow: 'visible',
            }}
          >
            <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 3 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                slots={{
                  noRowsOverlay: NoRowsOverlay,
                }}
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
                disableRowSelectionOnClick
                hideFooterPagination
                hideFooterSelectedRowCount
              />

              {/* Add Row Hover Area - Extended below the table */}
              <Grid2
                sx={{
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  right: 0,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  zIndex: 10,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setShowAddRowHover(true)}
                onMouseLeave={() => setShowAddRowHover(false)}
                onClick={handleAddRow}
              >
                <Fade in={showAddRowHover}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      border: '2px dashed #2563eb',
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                        boxShadow: 2,
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="primary.main" fontWeight={500}>
                      Add Row
                    </Typography>
                  </Box>
                </Fade>
              </Grid2>

              {/* Add Column Hover Area - Extended to the right of the table */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: -5,
                  width: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  zIndex: 10,
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setShowAddColumnHover(true)}
                onMouseLeave={() => setShowAddColumnHover(false)}
                onClick={() => setOpenColumnDialog(true)}
              >
                <Fade in={showAddColumnHover}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'rgba(100, 116, 139, 0.1)',
                      border: '2px dashed #64748b',
                      borderRadius: 2,
                      px: 2,
                      py: 3,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 116, 139, 0.15)',
                        transform: 'translateX(-2px)',
                      },
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        },
                        boxShadow: 2,
                      }}
                    >
                      <ViewColumnIcon fontSize="small" />
                    </IconButton>
                    <Typography 
                      variant="caption" 
                      color="secondary.main" 
                      fontWeight={500}
                      sx={{ 
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}
                    >
                      Add Column
                    </Typography>
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              sx={{ 
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.50',
                },
              }}
            >
              Add Row
            </Button>
            <Button
              variant="outlined"
              startIcon={<ViewColumnIcon />}
              onClick={() => setOpenColumnDialog(true)}
              sx={{ 
                borderColor: 'secondary.main',
                color: 'secondary.main',
                '&:hover': {
                  borderColor: 'secondary.dark',
                  backgroundColor: 'secondary.50',
                },
              }}
            >
              Add Column
            </Button>
          </Box>
        </Box>

        {/* Add dialog for adding new Column */}
        <Dialog 
          open={openColumnDialog} 
          onClose={() => setOpenColumnDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add New Column</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Column Name"
              fullWidth
              variant="outlined"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Column Type"
              fullWidth
              variant="outlined"
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
            >
              {columnTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenColumnDialog(false)}>Cancel</Button>
            <Button onClick={handleAddColumn} variant="contained">
              Add Column
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

export default Tables2;
