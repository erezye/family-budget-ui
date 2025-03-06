import axios from 'axios';
import { Budget, BudgetItem, BudgetSummary, User } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Budget API calls
export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get('/budgets');
  // Transform the data to ensure all budget items have an id
  return response.data.map((budget: any) => ({
    ...budget,
    id: budget.id || budget._id  // Ensure we always have an id (API might return _id)
  }));
};

export const getBudget = async (id: string): Promise<Budget> => {
  if (!id || id.trim() === '') {
    throw new Error('Budget ID is required');
  }
  const response = await api.get(`/budgets/${id}`);
  const budget = response.data;
  return {
    ...budget,
    id: budget.id || budget._id  // Ensure we have an id field
  };
};

export const getBudgetSummary = async (id: string): Promise<BudgetSummary> => {
  if (!id || id.trim() === '') {
    throw new Error('Budget ID is required');
  }
  const response = await api.get(`/budgets/summary/${id}`);
  return response.data;
};

export const createBudget = async (budget: Partial<Budget>): Promise<Budget> => {
  const response = await api.post('/budgets', budget);
  return response.data;
};

export const updateBudget = async (id: string, budget: Partial<Budget>): Promise<Budget> => {
  const response = await api.put(`/budgets/${id}`, budget);
  return response.data;
};

export const deleteBudget = async (id: string): Promise<Budget> => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

export const addBudgetItem = async (budgetId: string, item: Partial<BudgetItem>): Promise<Budget> => {
  const response = await api.post(`/budgets/${budgetId}/items`, item);
  return response.data;
};

export const removeBudgetItem = async (budgetId: string, itemId: string): Promise<Budget> => {
  const response = await api.delete(`/budgets/${budgetId}/items/${itemId}`);
  return response.data;
};

// User API calls
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (id: string): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: Partial<User>): Promise<User> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<User> => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};