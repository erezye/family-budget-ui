import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Stack 
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getBudgets, getBudgetSummary } from '../services/api';
import { Budget, BudgetSummary } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6A7FDB'];

interface DashboardProps {
  budget?: Budget;
  budgetSummary?: BudgetSummary;
}

const Dashboard: React.FC<DashboardProps> = ({ budget, budgetSummary }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(budget || null);
  const [currentBudgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(budgetSummary || null);
  const [loading, setLoading] = useState(!budget);

  useEffect(() => {
    // If props are provided, use them
    if (budget && budgetSummary) {
      setCurrentBudget(budget);
      setBudgetSummary(budgetSummary);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch data
    const fetchData = async () => {
      try {
        setLoading(true);
        const budgetsData = await getBudgets();
        setBudgets(budgetsData);
        
        if (budgetsData.length > 0) {
          // Get the current month's budget
          const now = new Date();
          const currentMonthBudget = budgetsData.find(
            (budget) => budget.month === now.getMonth() + 1 && budget.year === now.getFullYear()
          ) || budgetsData[0];
          
          setCurrentBudget(currentMonthBudget);
          
          // Get the budget summary only if we have a valid budget ID
          if (currentMonthBudget && currentMonthBudget.id) {
            try {
              const summary = await getBudgetSummary(currentMonthBudget.id);
              setBudgetSummary(summary);
            } catch (summaryError) {
              console.error('Error fetching budget summary:', summaryError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [budget, budgetSummary]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };

  // Prepare pie chart data
  const preparePieChartData = () => {
    if (!currentBudgetSummary) return [];
    
    return Object.entries(currentBudgetSummary.expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };

  // Prepare bar chart data
  const prepareBarChartData = () => {
    if (!currentBudget) return [];
    
    const incomeItem = {
      name: 'Income',
      amount: currentBudget.income
    };
    
    const expenseItems = Object.entries(currentBudgetSummary?.expensesByCategory || {}).map(([category, amount]) => ({
      name: category,
      amount: amount
    }));
    
    return [incomeItem, ...expenseItems];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Family Budget Dashboard
      </Typography>
      
      {currentBudget ? (
        <>
          <Typography variant="h6" component="h2" gutterBottom>
            Budget for {new Date(currentBudget.year, currentBudget.month - 1).toLocaleString('default', { month: 'long' })} {currentBudget.year}
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Summary
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Income
                    </Typography>
                    <Typography variant="h5" component="p" color="primary.main">
                      {formatCurrency(currentBudgetSummary?.totalIncome || 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Expenses
                    </Typography>
                    <Typography variant="h5" component="p" color="error.main">
                      {formatCurrency(currentBudgetSummary?.totalExpenses || 0)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Balance
                    </Typography>
                    <Typography 
                      variant="h5" 
                      component="p" 
                      color={(currentBudgetSummary?.balance || 0) >= 0 ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(currentBudgetSummary?.balance || 0)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareBarChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Expenses by Category
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={preparePieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {preparePieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body1">No budget data available.</Typography>
      )}
    </Container>
  );
};

export default Dashboard;