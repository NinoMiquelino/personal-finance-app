export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum CategoryType {
  FOOD = 'food',
  TRANSPORT = 'transport',
  HOUSING = 'housing',
  ENTERTAINMENT = 'entertainment',
  HEALTH = 'health',
  EDUCATION = 'education',
  SALARY = 'salary',
  INVESTMENT = 'investment',
  OTHER = 'other'
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: CategoryType;
  date: Date;
  createdAt: Date;
}

export interface Budget {
  id: string;
  category: CategoryType;
  limit: number;
  period: 'monthly' | 'weekly';
  currentSpent: number;
  startDate: Date;
  endDate: Date;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: CategoryType;
  completed: boolean;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<CategoryType, number>;
  monthlyTrend: MonthlyTrend[];
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface ReportFilters {
  startDate: Date;
  endDate: Date;
  categories: CategoryType[];
  type?: TransactionType;
}