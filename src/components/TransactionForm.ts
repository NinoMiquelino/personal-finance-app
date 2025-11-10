import { Transaction, TransactionType, CategoryType } from '../types';

export class TransactionForm {
  private onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;

  constructor(onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void) {
    this.onSubmit = onSubmit;
  }

  render(): string {
    return `
      <div class="transaction-form bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold mb-4">Nova Transação</h3>
        <form id="transactionForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select name="type" class="w-full p-2 border border-gray-300 rounded-md" required>
                <option value="${TransactionType.INCOME}">Receita</option>
                <option value="${TransactionType.EXPENSE}">Despesa</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select name="category" class="w-full p-2 border border-gray-300 rounded-md" required>
                ${this.renderCategoryOptions()}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
              <input type="number" name="amount" step="0.01" min="0" 
                     class="w-full p-2 border border-gray-300 rounded-md" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input type="date" name="date" 
                     class="w-full p-2 border border-gray-300 rounded-md" required>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <input type="text" name="description" 
                   class="w-full p-2 border border-gray-300 rounded-md" required>
          </div>
          <button type="submit" 
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
            Adicionar Transação
          </button>
        </form>
      </div>
    `;
  }

  private renderCategoryOptions(): string {
    const categories = [
      { value: CategoryType.FOOD, label: '🍕 Alimentação' },
      { value: CategoryType.TRANSPORT, label: '🚗 Transporte' },
      { value: CategoryType.HOUSING, label: '🏠 Moradia' },
      { value: CategoryType.ENTERTAINMENT, label: '🎬 Entretenimento' },
      { value: CategoryType.HEALTH, label: '🏥 Saúde' },
      { value: CategoryType.EDUCATION, label: '📚 Educação' },
      { value: CategoryType.SALARY, label: '💰 Salário' },
      { value: CategoryType.INVESTMENT, label: '📈 Investimentos' },
      { value: CategoryType.OTHER, label: '📦 Outros' }
    ];

    return categories.map(cat => 
      `<option value="${cat.value}">${cat.label}</option>`
    ).join('');
  }

  attachEvents(): void {
    const form = document.getElementById('transactionForm') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      
      const transaction: Omit<Transaction, 'id' | 'createdAt'> = {
        type: formData.get('type') as TransactionType,
        category: formData.get('category') as CategoryType,
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: new Date(formData.get('date') as string)
      };

      this.onSubmit(transaction);
      form.reset();
    });
  }
}