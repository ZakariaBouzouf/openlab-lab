import React from 'react';
import { Typography, Paper, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging with more context
    console.error('Chart Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      timestamp: new Date().toISOString()
    });
    
    // You could also send this to an error reporting service
    // ErrorReportingService.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            minHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid>
              <ErrorOutlineIcon 
                color="error" 
                sx={{ fontSize: 48 }} 
              />
            </Grid>
            <Grid>
              <Typography variant="h6" color="error" gutterBottom>
                Chart Rendering Error
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1" color="textSecondary" paragraph>
                There was an error displaying this chart. This might be due to:
              </Typography>
              <Typography variant="body2" color="textSecondary" component="ul" sx={{ textAlign: 'left', maxWidth: 400 }}>
                <li>Invalid or missing data</li>
                <li>Incompatible data types for the selected chart</li>
                <li>Missing required chart configuration</li>
              </Typography>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </Grid>
          </Grid>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
