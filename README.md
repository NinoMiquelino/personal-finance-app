## 🙋‍♂️ Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/ninomiquelino" width="100" height="100" style="border-radius: 50%">
  <br>
  <strong>Onivaldo Miquelino</strong>
  <br>
  <a href="https://github.com/ninomiquelino">@ninomiquelino</a>
</div>

---

# 💰 Finanças Pessoais - TypeScript

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0+-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-Enabled-green?style=for-the-badge)
![PDF Generation](https://img.shields.io/badge/PDF-JSPDF-red?style=for-the-badge)
![License MIT](https://img.shields.io/badge/License-MIT-green)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue)

Um aplicativo completo de finanças pessoais desenvolvido em TypeScript com controle de gastos, categorias, relatórios e metas financeiras.

## ✨ Funcionalidades

### 💳 Gestão de Transações
- **Adicionar receitas e despesas**
- **Categorização automática**
- **Filtros por data e categoria**
- **Edição e exclusão de transações**

### 📊 Dashboard Interativo
- **Resumo financeiro mensal**
- **Gráficos de despesas por categoria**
- **Evolução mensal de receitas vs despesas**
- **Metas financeiras com progresso**

### 🎯 Metas Financeiras
- **Definir objetivos financeiros**
- **Acompanhamento de progresso**
- **Alertas de prazo**
- **Contribuições regulares**

### 📈 Relatórios Avançados
- **Relatórios PDF completos**
- **Análise de orçamentos**
- **Exportação de dados (JSON)**
- **Importação de backup**

### 🔒 Armazenamento
- **LocalStorage para persistência**
- **Backup automático**
- **Recuperação de dados**

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/financas-pessoais.git
cd financas-pessoais

# Instale as dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build
```

Execução

```bash
# Desenvolvimento (com hot reload)
npm start

# Build de produção
npm run build
# Servir arquivos da pasta dist/
```

🛠️ Tecnologias Utilizadas

· TypeScript - Linguagem principal<br>
· Chart.js - Gráficos e visualizações<br>
· jsPDF - Geração de relatórios PDF<br>
· Webpack - Bundling e build<br>
· Tailwind CSS - Estilização<br>
· LocalStorage API - Armazenamento local

📁 Estrutura do Projeto

```
src/
├── components/     # Componentes da UI
├── services/       # Lógica de negócio
├── types/          # Definições TypeScript
├── utils/          # Utilitários
├── styles/         # Estilos CSS
└── index.ts        # Entrada da aplicação
```

🎯 Como Usar

1. Adicione transações na aba "Transações"
2. Acompanhe o dashboard para ver resumos
3. Defina metas financeiras
4. Gere relatórios em PDF
5. Exporte seus dados para backup

📊 Categorias Disponíveis

· 🍕 Alimentação<br>
· 🚗 Transporte<br>
· 🏠 Moradia<br>
· 🎬 Entretenimento<br>
· 🏥 Saúde<br>
· 📚 Educação<br>
· 💰 Salário<br>
· 📈 Investimentos<br>
· 📦 Outros

🔧 Desenvolvimento

Adicionando Nova Categoria

```typescript
// Em src/types/index.ts
export enum CategoryType {
  NOVA_CATEGORIA = 'nova_categoria'
}
```

Customizando Relatórios

```typescript
// Em src/services/PdfService.ts
const pdf = await pdfService.generateFinancialReport(startDate, endDate);
pdf.save('meu-relatorio.pdf');
```

🐛 Reportar Bugs

Encontrou um bug? Abra uma issue com:

· Descrição detalhada<br>
· Passos para reproduzir<br>
· Comportamento esperado vs atual

🌟 Próximas Funcionalidades

· Sincronização em nuvem<br>
· App mobile<br>
· Notificações push<br>
· Integração com bancos<br>
· Orçamentos flexíveis

---

Desenvolvido com ❤️ usando TypeScript

Se este projeto te ajudou, considere dar uma ⭐ no repositório!

```

## 🚀 12. Comandos para Executar

```bash
# Instalação e execução
npm install
npm run dev

# Ou para desenvolvimento
npm start

# Build para produção
npm run build
```

---

## 🤝 Contribuições
Contribuições são sempre bem-vindas!  
Sinta-se à vontade para abrir uma [*issue*](https://github.com/NinoMiquelino/personal-finance-app/issues) com sugestões ou enviar um [*pull request*](https://github.com/NinoMiquelino/personal-finance-app/pulls) com melhorias.

---

## 💬 Contato
📧 [Entre em contato pelo LinkedIn](https://www.linkedin.com/in/onivaldomiquelino/)  
💻 Desenvolvido por **Onivaldo Miquelino**

---
