import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Budget, BudgetItem } from '../types';
import { removeBudgetItem } from '../services/api';

interface TransactionListProps {
  budget: Budget;
  onItemRemoved: (updatedBudget: Budget) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ budget, onItemRemoved }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const updatedBudget = await removeBudgetItem(budget.id, itemId);
      onItemRemoved(updatedBudget);
    } catch (error) {
      console.error('Error removing budget item:', error);
    }
  };

  // Sort items by date (most recent first)
  const sortedItems = [...budget.items].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Transactions
      </Typography>
      
      {sortedItems.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={item.isIncome ? 'Income' : 'Expense'} 
                      color={item.isIncome ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      aria-label="delete" 
                      size="small" 
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No transactions found.
        </Typography>
      )}
    </Paper>
  );
};

export default TransactionList;