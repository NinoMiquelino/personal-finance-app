import { FinanceService } from './services/FinanceService';
import { ChartService } from './services/ChartService';
import { PdfService } from './services/PdfService';
import { TransactionForm } from './components/TransactionForm';
import { Dashboard } from './components/Dashboard';
import { Transaction, TransactionType } from './types';
import './styles/main.css';

class FinanceApp {
  private financeService: FinanceService;
  private chartService: ChartService;
  private pdfService: PdfService;
  private currentView: string = 'dashboard';

  constructor() {
    this.financeService = new FinanceService();
    this.chartService = new ChartService(this.financeService);
    this.pdfService = new PdfService(this.financeService);
    this.initializeApp();
  }

  private initializeApp(): void {
    this.renderNavigation();
    this.showDashboard();
    this.attachGlobalEvents();
  }

  private renderNavigation(): void {
    const nav = document.getElementById('app-nav');
    if (!nav) return;

    nav.innerHTML = `
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-800">💰 Finanças Pessoais</h1>
            </div>
            <div class="flex space-x-4 items-center">
              <button class="nav-btn ${this.currentView === 'dashboard' ? 'active' : ''}" 
                      data-view="dashboard">
                📊 Dashboard
              </button>
              <button class="nav-btn ${this.currentView === 'transactions' ? 'active' : ''}" 
                      data-view="transactions">
                💳 Transações
              </button>
              <button class="nav-btn ${this.currentView === 'reports' ? 'active' : ''}" 
                      data-view="reports">
                📈 Relatórios
              </button>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  private showDashboard(): void {
    this.currentView = 'dashboard';
    this.renderNavigation();
    
    const app = document.getElementById('app');
    if (!app) return;

    const dashboard = new Dashboard(this.financeService, this.chartService);
    app.innerHTML = dashboard.render();
    dashboard.attachEvents();
  }

  private showTransactions(): void {
    this.currentView = 'transactions';
    this.renderNavigation();
    
    const app = document.getElementById('app');
    if (!app) return;

    const transactionForm = new TransactionForm((transaction) => {
      this.financeService.addTransaction(transaction);
      this.showTransactions(); // Refresh view
    });

    app.innerHTML = `
      <div class="max-w-7xl mx-auto py-6 px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1">
            ${transactionForm.render()}
          </div>
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-xl font-semibold mb-4">Últimas Transações</h3>
              <div id="transactionsList">
                ${this.renderTransactionsList()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    transactionForm.attachEvents();
  }

  private renderTransactionsList(): string {
    const transactions = this.financeService.getTransactions().slice(0, 10);
    
    if (transactions.length === 0) {
      return '<p class="text-gray-500">Nenhuma transação cadastrada.</p>';
    }

    return transactions.map(transaction => {
      const typeClass = transaction.type === TransactionType.INCOME ? 
        'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
      const typeIcon = transaction.type === TransactionType.INCOME ? '⬆️' : '⬇️';
      
      return `
        <div class="flex items-center justify-between py-3 border-b border-gray-200">
          <div class="flex items-center">
            <span class="mr-3">${typeIcon}</span>
            <div>
              <p class="font-medium">${transaction.description}</p>
              <p class="text-sm text-gray-500">
                ${transaction.date.toLocaleDateString('pt-BR')} • 
                ${this.getCategoryName(transaction.category)}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold ${typeClass} px-2 py-1 rounded">
              R$ ${transaction.amount.toFixed(2)}
            </p>
          </div>
        </div>
      `;
    }).join('');
  }

  private showReports(): void {
    this.currentView = 'reports';
    this.renderNavigation();
    
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="max-w-7xl mx-auto py-6 px-4">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-6">Relatórios e Exportação</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-4">Relatório Financeiro</h3>
              <p class="text-gray-600 mb-4">Gere um relatório completo com todas as transações e análises.</p>
              <button id="generateFinancialReport" 
                      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                📊 Gerar Relatório PDF
              </button>
            </div>
            
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold mb-4">Relatório de Orçamentos</h3>
              <p class="text-gray-600 mb-4">Visualize o status dos seus orçamentos e metas.</p>
              <button id="generateBudgetReport" 
                      class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                💰 Gerar Relatório de Orçamentos
              </button>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Exportar Dados</h3>
            <div class="flex space-x-4">
              <button id="exportData" 
                      class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                📥 Exportar JSON
              </button>
              <button id="importData" 
                      class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                📤 Importar JSON
              </button>
              <button id="clearData" 
                      class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                🗑️ Limpar Dados
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachReportEvents();
  }

  private attachReportEvents(): void {
    // Relatório Financeiro
    document.getElementById('generateFinancialReport')?.addEventListener('click', async () => {
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endDate = new Date();
      
      const pdf = await this.pdfService.generateFinancialReport(startDate, endDate);
      pdf.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
    });

    // Relatório de Orçamentos
    document.getElementById('generateBudgetReport')?.addEventListener('click', async () => {
      const pdf = await this.pdfService.generateBudgetReport();
      pdf.save(`relatorio-orcamentos-${new Date().toISOString().split('T')[0]}.pdf`);
    });

    // Exportar dados
    document.getElementById('exportData')?.addEventListener('click', () => {
      this.exportData();
    });

    // Importar dados
    document.getElementById('importData')?.addEventListener('click', () => {
      this.importData();
    });

    // Limpar dados
    document.getElementById('clearData')?.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  private exportData(): void {
    const data = {
      transactions: this.financeService.getTransactions(),
      budgets: this.financeService.getBudgets(),
      goals: this.financeService.getGoals(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-financas-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private importData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          
          if (data.transactions) {
            localStorage.setItem('finance_transactions', JSON.stringify(data.transactions));
          }
          if (data.budgets) {
            localStorage.setItem('finance_budgets', JSON.stringify(data.budgets));
          }
          if (data.goals) {
            localStorage.setItem('finance_goals', JSON.stringify(data.goals));
          }

          alert('Dados importados com sucesso!');
          location.reload();
        } catch (error) {
          alert('Erro ao importar dados. Verifique o arquivo.');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }

  private attachGlobalEvents(): void {
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('nav-btn')) {
        const view = target.getAttribute('data-view');
        switch (view) {
          case 'dashboard':
            this.showDashboard();
            break;
          case 'transactions':
            this.showTransactions();
            break;
          case 'reports':
            this.showReports();
            break;
        }
      }
    });
  }

  private getCategoryName(category: string): string {
    const names: Record<string, string> = {
      'food': 'Alimentação',
      'transport': 'Transporte',
      'housing': 'Moradia',
      'entertainment': 'Entretenimento',
      'health': 'Saúde',
      'education': 'Educação',
      'salary': 'Salário',
      'investment': 'Investimentos',
      'other': 'Outros'
    };

    return names[category] || category;
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new FinanceApp();
});