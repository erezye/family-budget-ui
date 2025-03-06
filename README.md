# Family Budget UI

A React-based user interface for the Family Budget application, built with TypeScript, Material UI, and Recharts. This UI provides a comprehensive view of family budgets with interactive charts, transaction management, and budget summaries for a household with a 30,000 ILS monthly income.

## Description

The Family Budget UI provides an intuitive interface for managing household finances, including:

- Dashboard with visual representation of budget data
- Income and expense tracking
- Transaction management (add/remove)
- Category-based expense analysis
- Monthly budget selection and comparison

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **UI Library**: Material UI
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Build Tool**: Create React App

## Project Structure

```
family-budget-ui/
├── public/                  # Static files
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── App.tsx          # Main application component
│   │   ├── Dashboard.tsx    # Budget dashboard with charts
│   │   ├── BudgetPage.tsx   # Budget detail page
│   │   ├── BudgetForm.tsx   # Form for adding transactions
│   │   ├── BudgetSelector.tsx # Dropdown for selecting budgets
│   │   └── TransactionList.tsx # List of budget transactions
│   ├── services/            # API service layer
│   │   └── api.ts           # API client and functions
│   ├── types/               # Type definitions
│   │   └── index.ts         # Type interfaces for the application
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles
├── node_modules/            # Dependencies
├── .env                     # Environment variables
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## Features

### Dashboard
- Income vs. expenses bar chart
- Expense categories pie chart
- Budget summary with total income, expenses, and balance

### Transactions
- Add new income and expense transactions
- Categorize transactions
- View transactions in a sortable list
- Delete transactions

### Budget Management
- Select from different monthly budgets
- View current month's budget by default
- Track changes across different months

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- Family Budget API running on http://localhost:3000

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/family-budget-ui.git
   cd family-budget-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
   This will start the application on http://localhost:3001

2. Build for production:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Usage

1. Select a budget from the dropdown menu
2. View budget summary and charts on the Dashboard tab
3. Add new transactions on the Add Transaction tab
4. View and manage all transactions on the Transactions tab

## Dependencies

Main dependencies:

```
"dependencies": {
  "@mui/material": "^5.x",
  "@mui/icons-material": "^5.x",
  "@emotion/react": "^11.x",
  "@emotion/styled": "^11.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "recharts": "^2.x",
  "axios": "^1.x",
  "typescript": "^4.x"
}
```

## API Integration

The UI integrates with the Family Budget API, which should be running at http://localhost:3000. Configuration can be changed via the `.env` file.

## License

MIT
