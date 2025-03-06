import React, { useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme, Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import Dashboard from './Dashboard';
import BudgetSelector from './BudgetSelector';
import BudgetPage from './BudgetPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App: React.FC = () => {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const handleBudgetSelect = (budgetId: string) => {
    setSelectedBudgetId(budgetId);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Family Budget Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          <BudgetSelector onBudgetSelect={handleBudgetSelect} />
          
          {selectedBudgetId && selectedBudgetId.trim() !== '' ? (
            <BudgetPage budgetId={selectedBudgetId} />
          ) : (
            <Typography variant="h5" sx={{ mt: 4, textAlign: 'center' }}>
              Select a budget to view details
            </Typography>
          )}
        </Container>
        
        <Box component="footer" sx={{ py: 2, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant="body2" align="center">
            Family Budget Tracker &copy; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;