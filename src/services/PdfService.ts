import jsPDF from 'jspdf';
import { FinanceService } from './FinanceService';
import { TransactionType, CategoryType } from '../types';

export class PdfService {
  private financeService: FinanceService;

  constructor(financeService: FinanceService) {
    this.financeService = financeService;
  }

  async generateFinancialReport(startDate: Date, endDate: Date): Promise<jsPDF> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Relatório Financeiro', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Período: ${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );

    yPosition += 20;

    // Resumo Financeiro
    const summary = this.financeService.getFinancialSummary();
    
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Resumo Financeiro', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const summaryData = [
      [`Receitas: R$ ${summary.totalIncome.toFixed(2)}`, `Despesas: R$ ${summary.totalExpenses.toFixed(2)}`],
      [`Saldo: R$ ${summary.balance.toFixed(2)}`, `Situação: ${summary.balance >= 0 ? 'Positiva' : 'Negativa'}`]
    ];

    summaryData.forEach(([left, right]) => {
      doc.text(left, 25, yPosition);
      doc.text(right, 120, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Transações
    const transactions = this.financeService.getTransactions({ startDate, endDate });
    
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('Transações', 20, yPosition);
    yPosition += 15;

    if (transactions.length === 0) {
      doc.setFontSize(12);
      doc.text('Nenhuma transação no período', 25, yPosition);
    } else {
      doc.setFontSize(10);
      transactions.forEach((transaction, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        const typeColor = transaction.type === TransactionType.INCOME ? [34, 197, 94] : [239, 68, 68];
        doc.setTextColor(typeColor[0], typeColor[1], typeColor[2]);
        
        const typeText = transaction.type === TransactionType.INCOME ? 'Receita' : 'Despesa';
        doc.text(
          `${transaction.date.toLocaleDateString('pt-BR')} - ${transaction.description}`,
          25,
          yPosition
        );
        
        doc.text(
          `R$ ${transaction.amount.toFixed(2)} (${typeText} - ${this.getCategoryName(transaction.category)})`,
          150,
          yPosition
        );

        yPosition += 6;
      });
    }

    return doc;
  }

  async generateBudgetReport(): Promise<jsPDF> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Cabeçalho
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Relatório de Orçamentos', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    const budgets = this.financeService.getBudgets();
    
    if (budgets.length === 0) {
      doc.setFontSize(12);
      doc.text('Nenhum orçamento configurado', pageWidth / 2, yPosition, { align: 'center' });
      return doc;
    }

    doc.setFontSize(12);
    budgets.forEach(budget => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      const usagePercentage = (budget.currentSpent / budget.limit) * 100;
      const statusColor = usagePercentage > 100 ? [239, 68, 68] : 
                         usagePercentage > 80 ? [234, 179, 8] : 
                         [34, 197, 94];

      doc.setTextColor(0, 0, 0);
      doc.text(this.getCategoryName(budget.category), 25, yPosition);
      
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(
        `R$ ${budget.currentSpent.toFixed(2)} / R$ ${budget.limit.toFixed(2)} (${usagePercentage.toFixed(1)}%)`,
        120,
        yPosition
      );

      yPosition += 8;
    });

    return doc;
  }

  private getCategoryName(category: CategoryType): string {
    const categoryNames: Record<CategoryType, string> = {
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

    return categoryNames[category];
  }
}