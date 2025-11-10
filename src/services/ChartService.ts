import { Chart, registerables } from 'chart.js';
import { FinanceService } from './FinanceService';
import { CategoryType } from '../types';

Chart.register(...registerables);

export class ChartService {
  private financeService: FinanceService;

  constructor(financeService: FinanceService) {
    this.financeService = financeService;
  }

  renderExpensesChart(): void {
    const ctx = document.getElementById('expensesChart') as HTMLCanvasElement;
    if (!ctx) return;

    const summary = this.financeService.getFinancialSummary();
    const categories = Object.keys(summary.expensesByCategory) as CategoryType[];
    const amounts = Object.values(summary.expensesByCategory);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories.map(this.getCategoryName),
        datasets: [{
          data: amounts,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  renderTrendChart(): void {
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (!ctx) return;

    const summary = this.financeService.getFinancialSummary();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: summary.monthlyTrend.map(t => t.month),
        datasets: [
          {
            label: 'Receitas',
            data: summary.monthlyTrend.map(t => t.income),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          },
          {
            label: 'Despesas',
            data: summary.monthlyTrend.map(t => t.expenses),
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private getCategoryName(category: CategoryType): string {
    const names: Record<CategoryType, string> = {
      [CategoryType.FOOD]: 'Alimentação',
      [CategoryType.TRANSPORT]: 'Transporte',
      [CategoryType.HOUSING]: 'Moradia',
      [CategoryType.ENTERTAINMENT]: 'Entretenimento',
      [CategoryType.HEALTH]: 'Saúde',
      [CategoryType.EDUCATION]: 'Educação',
      [CategoryType.SALARY]: 'Salário',
      [CategoryType.INVESTMENT]: 'Investimentos',
      [CategoryType.OTHER]: 'Outros'
    };

    return names[category];
  }
}