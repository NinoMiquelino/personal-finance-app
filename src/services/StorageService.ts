import { Transaction, Budget, FinancialGoal } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  BUDGETS: 'finance_budgets',
  GOALS: 'finance_goals',
  SETTINGS: 'finance_settings'
};

export class StorageService {
  static getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) return [];
    
    const transactions = JSON.parse(data);
    return transactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
      createdAt: new Date(t.createdAt)
    }));
  }

  static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  static getBudgets(): Budget[] {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!data) return [];
    
    const budgets = JSON.parse(data);
    return budgets.map((b: any) => ({
      ...b,
      startDate: new Date(b.startDate),
      endDate: new Date(b.endDate)
    }));
  }

  static saveBudgets(budgets: Budget[]): void {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }

  static getGoals(): FinancialGoal[] {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!data) return [];
    
    const goals = JSON.parse(data);
    return goals.map((g: any) => ({
      ...g,
      deadline: new Date(g.deadline)
    }));
  }

  static saveGoals(goals: FinancialGoal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
  }
}