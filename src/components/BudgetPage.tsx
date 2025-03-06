import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, CircularProgress, Tabs, Tab } from '@mui/material';
import { getBudget, getBudgetSummary } from '../services/api';
import { Budget, BudgetSummary } from '../types';
import Dashboard from './Dashboard';
import BudgetForm from './BudgetForm';
import TransactionList from './TransactionList';

interface BudgetPageProps {
  budgetId: string;
}

const BudgetPage: React.FC<BudgetPageProps> = ({ budgetId }) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Only proceed if we have a valid budgetId
        if (!budgetId) {
          setLoading(false);
          return;
        }
        
        const budgetData = await getBudget(budgetId);
        setBudget(budgetData);
        
        // Get the summary only if we have a valid budget
        if (budgetData) {
          const summaryData = await getBudgetSummary(budgetId);
          setBudgetSummary(summaryData);
        }
      } catch (error) {
        console.error('Error fetching budget data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [budgetId]);

  const handleItemAdded = async (updatedBudget: Budget) => {
    setBudget(updatedBudget);
    // Refresh summary data only if we have a valid budgetId
    if (budgetId) {
      try {
        const summaryData = await getBudgetSummary(budgetId);
        setBudgetSummary(summaryData);
      } catch (error) {
        console.error('Error refreshing budget summary:', error);
      }
    }
  };

  const handleItemRemoved = async (updatedBudget: Budget) => {
    setBudget(updatedBudget);
    // Refresh summary data only if we have a valid budgetId
    if (budgetId) {
      try {
        const summaryData = await getBudgetSummary(budgetId);
        setBudgetSummary(summaryData);
      } catch (error) {
        console.error('Error refreshing budget summary:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!budget) {
    return (
      <Container>
        <Typography variant="h5" component="h1" sx={{ mt: 4 }}>
          Budget not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Budget for {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Dashboard" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Add Transaction" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Transactions" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
      >
        {activeTab === 0 && budget && budgetSummary && (
          <Dashboard budget={budget} budgetSummary={budgetSummary} />
        )}
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
      >
        {activeTab === 1 && budget && (
          <BudgetForm budget={budget} onItemAdded={handleItemAdded} />
        )}
      </Box>
      
      <Box
        role="tabpanel"
        hidden={activeTab !== 2}
        id="tabpanel-2"
        aria-labelledby="tab-2"
      >
        {activeTab === 2 && budget && (
          <TransactionList budget={budget} onItemRemoved={handleItemRemoved} />
        )}
      </Box>
    </Container>
  );
};

export default BudgetPage;