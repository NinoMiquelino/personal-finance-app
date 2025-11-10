import { FinanceService } from '../services/FinanceService';
import { ChartService } from '../services/ChartService';

export class Dashboard {
  private financeService: FinanceService;
  private chartService: ChartService;

  constructor(financeService: FinanceService, chartService: ChartService) {
    this.financeService = financeService;
    this.chartService = chartService;
  }

  render(): string {
    const summary = this.financeService.getFinancialSummary();
    
    return `
      <div class="dashboard">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Card Receitas -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-100 rounded-lg">
                <span class="text-green-600 text-xl">💰</span>
              </div>
              <div class="ml-4">
                <p class="text-sm text-green-600 font-medium">Receitas</p>
                <p class="text-2xl font-bold text-green-700">R$ ${summary.totalIncome.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <!-- Card Despesas -->
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <div class="flex items-center">
              <div class="p-2 bg-red-100 rounded-lg">
                <span class="text-red-600 text-xl">💸</span>
              </div>
              <div class="ml-4">
                <p class="text-sm text-red-600 font-medium">Despesas</p>
                <p class="text-2xl font-bold text-red-700">R$ ${summary.totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <!-- Card Saldo -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-100 rounded-lg">
                <span class="text-blue-600 text-xl">⚖️</span>
              </div>
              <div class="ml-4">
                <p class="text-sm text-blue-600 font-medium">Saldo</p>
                <p class="text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-700' : 'text-red-700'}">
                  R$ ${summary.balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Despesas por Categoria</h3>
            <canvas id="expensesChart"></canvas>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4">Evolução Mensal</h3>
            <canvas id="trendChart"></canvas>
          </div>
        </div>

        <div class="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-4">Metas Financeiras</h3>
          <div id="goalsList">
            ${this.renderGoals()}
          </div>
        </div>
      </div>
    `;
  }

  private renderGoals(): string {
    const goals = this.financeService.getGoals();
    
    if (goals.length === 0) {
      return '<p class="text-gray-500">Nenhuma meta definida.</p>';
    }

    return goals.map(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      return `
        <div class="border border-gray-200 rounded-lg p-4 mb-4">
          <div class="flex justify-between items-center mb-2">
            <h4 class="font-semibold">${goal.title}</h4>
            <span class="text-sm ${daysLeft < 0 ? 'text-red-600' : 'text-gray-600'}">
              ${daysLeft >= 0 ? `${daysLeft} dias restantes` : 'Expirado'}
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div class="bg-green-600 h-2 rounded-full" 
                 style="width: ${Math.min(progress, 100)}%"></div>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>R$ ${goal.currentAmount.toFixed(2)}</span>
            <span>R$ ${goal.targetAmount.toFixed(2)}</span>
          </div>
          ${goal.completed ? 
            '<span class="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Concluída</span>' : 
            ''
          }
        </div>
      `;
    }).join('');
  }

  attachEvents(): void {
    this.chartService.renderExpensesChart();
    this.chartService.renderTrendChart();
  }
}