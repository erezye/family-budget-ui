import React, { useState, useEffect } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent 
} from '@mui/material';
import { Budget } from '../types';
import { getBudgets } from '../services/api';

interface BudgetSelectorProps {
  onBudgetSelect: (budgetId: string) => void;
}

const BudgetSelector: React.FC<BudgetSelectorProps> = ({ onBudgetSelect }) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgetsData = await getBudgets();
        setBudgets(budgetsData);
        
        if (budgetsData.length > 0) {
          // Get the current month's budget
          const now = new Date();
          const currentMonthBudget = budgetsData.find(
            (budget) => budget.month === now.getMonth() + 1 && budget.year === now.getFullYear()
          ) || budgetsData[0];
          
          // Check if the budget has a valid ID before setting it
          if (currentMonthBudget && currentMonthBudget.id) {
            setSelectedBudgetId(currentMonthBudget.id);
            onBudgetSelect(currentMonthBudget.id);
          }
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };
    
    fetchBudgets();
  }, [onBudgetSelect]);

  const handleChange = (event: SelectChangeEvent) => {
    const budgetId = event.target.value;
    if (budgetId && budgetId.trim() !== '') {
      setSelectedBudgetId(budgetId);
      onBudgetSelect(budgetId);
    }
  };

  return (
    <Box sx={{ minWidth: 200, mt: 2, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="budget-select-label">Budget</InputLabel>
        <Select
          labelId="budget-select-label"
          id="budget-select"
          value={selectedBudgetId}
          label="Budget"
          onChange={handleChange}
        >
          {budgets.map((budget, index) => (
            <MenuItem key={budget.id || `budget-${index}`} value={budget.id || ''}>
              {new Date(budget.year, budget.month - 1).toLocaleString('default', { month: 'long' })} {budget.year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default BudgetSelector;