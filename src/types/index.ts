export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  isIncome: boolean;
  date: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  income: number;
  expenses: number;
  items: BudgetItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<string, number>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  monthlyIncome: number;
}