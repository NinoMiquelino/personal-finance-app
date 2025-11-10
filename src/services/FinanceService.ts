import { Transaction, TransactionType, CategoryType, FinancialSummary, MonthlyTrend, Budget, FinancialGoal, ReportFilters } from '../types';
import { StorageService } from './StorageService';

export class FinanceService {
  private transactions: Transaction[];
  private budgets: Budget[];
  private goals: FinancialGoal[];

  constructor() {
    this.transactions = StorageService.getTransactions();
    this.budgets = StorageService.getBudgets();
    this.goals = StorageService.getGoals();
  }

  // Transações
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: this.generateId(),
      createdAt: new Date()
    };

    this.transactions.push(newTransaction);
    this.saveData();
    return newTransaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    this.transactions[index] = { ...this.transactions[index], ...updates };
    this.saveData();
    return this.transactions[index];
  }

  deleteTransaction(id: string): boolean {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.transactions.splice(index, 1);
    this.saveData();
    return true;
  }

  getTransactions(filters?: Partial<ReportFilters>): Transaction[] {
    let filtered = this.transactions;

    if (filters?.startDate) {
      filtered = filtered.filter(t => t.date >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter(t => t.date <= filters.endDate!);
    }

    if (filters?.categories && filters.categories.length > 0) {
      filtered = filtered.filter(t => filters.categories!.includes(t.category));
    }

    if (filters?.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Orçamentos
  createBudget(budget: Omit<Budget, 'id' | 'currentSpent'>): Budget {
    const newBudget: Budget = {
      ...budget,
      id: this.generateId(),
      currentSpent: this.calculateCurrentSpent(budget.category, budget.startDate, budget.endDate)
    };

    this.budgets.push(newBudget);
    this.saveData();
    return newBudget;
  }

  updateBudgetSpending(): void {
    this.budgets.forEach(budget => {
      budget.currentSpent = this.calculateCurrentSpent(
        budget.category,
        budget.startDate,
        budget.endDate
      );
    });
    this.saveData();
  }

  // Metas
  createGoal(goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'completed'>): FinancialGoal {
    const newGoal: FinancialGoal = {
      ...goal,
      id: this.generateId(),
      currentAmount: 0,
      completed: false
    };

    this.goals.push(newGoal);
    this.saveData();
    return newGoal;
  }

  contributeToGoal(goalId: string, amount: number): boolean {
    const goal = this.goals.find(g => g.id === goalId);
    if (!goal) return false;

    goal.currentAmount += amount;
    goal.completed = goal.currentAmount >= goal.targetAmount;
    this.saveData();
    return true;
  }

  // Relatórios e Analytics
  getFinancialSummary(): FinancialSummary {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthlyTransactions = this.getTransactions({
      startDate: startOfMonth,
      endDate: endOfMonth
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = {} as Record<CategoryType, number>;
    monthlyTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const monthlyTrend = this.calculateMonthlyTrend();

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      expensesByCategory,
      monthlyTrend
    };
  }

  private calculateMonthlyTrend(): MonthlyTrend[] {
    const trends: MonthlyTrend[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyTransactions = this.getTransactions({
        startDate: startOfMonth,
        endDate: endOfMonth
      });

      const income = monthlyTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthlyTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);

      trends.push({
        month: startOfMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        income,
        expenses,
        balance: income - expenses
      });
    }

    return trends;
  }

  private calculateCurrentSpent(category: CategoryType, startDate: Date, endDate: Date): number {
    const categoryExpenses = this.getTransactions({
      startDate,
      endDate,
      categories: [category],
      type: TransactionType.EXPENSE
    });

    return categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveData(): void {
    StorageService.saveTransactions(this.transactions);
    StorageService.saveBudgets(this.budgets);
    StorageService.saveGoals(this.goals);
  }

  getBudgets(): Budget[] {
    return this.budgets;
  }

  getGoals(): FinancialGoal[] {
    return this.goals;
  }
}