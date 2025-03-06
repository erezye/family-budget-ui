import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormControlLabel, 
  Switch 
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { addBudgetItem } from '../services/api';
import { Budget, BudgetItem } from '../types';

interface BudgetFormProps {
  budget: Budget;
  onItemAdded: (updatedBudget: Budget) => void;
}

const EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Personal',
  'Debt',
  'Savings',
  'Other'
];

const INCOME_CATEGORIES = [
  'Salary',
  'Bonus',
  'Gift',
  'Investment',
  'Other'
];

const BudgetForm: React.FC<BudgetFormProps> = ({ budget, onItemAdded }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'A valid amount is required';
    }
    
    if (!category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    try {
      const newItem: Partial<BudgetItem> = {
        name,
        amount: Number(amount),
        category,
        isIncome,
        date: new Date().toISOString()
      };
      
      const updatedBudget = await addBudgetItem(budget.id, newItem);
      
      // Reset form
      setName('');
      setAmount('');
      setCategory('');
      setIsIncome(false);
      
      // Notify parent component
      onItemAdded(updatedBudget);
    } catch (error) {
      console.error('Error adding budget item:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Transaction
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount (ILS)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={!!errors.amount}
              helperText={errors.amount}
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
                required
              >
                {(isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography variant="caption" color="error">
                  {errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={isIncome}
                  onChange={(e) => setIsIncome(e.target.checked)}
                  color="primary"
                />
              }
              label={isIncome ? "Income" : "Expense"}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutline />}
            >
              Add Transaction
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default BudgetForm;