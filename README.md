# Bond Calculator Frontend

## Overview

This is a frontend application for calculating bond metrics, yield to maturity, and cashflow schedules. It was built as an interview assignment to demonstrate proficiency in React, TypeScript, and modern web development practices.

## Features

- **Bond Metrics Calculation**: Calculate key bond metrics including:
  - Current Yield
  - Yield to Maturity (YTM)
  - Bond Status (Premium, Discount, or Par)
  - Total Interest

- **Cashflow Schedule**: Generate detailed payment schedules showing:
  - Payment periods and dates
  - Coupon payments per period
  - Cumulative interest
  - Remaining principal

- **User Interface**:
  - Clean, responsive form for inputting bond parameters
  - Real-time validation and error handling
  - Loading states for async operations
  - Comprehensive error display with detailed messages

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing utilities

## Project Structure

```
src/
├── api/
│   ├── client.ts          # HTTP client configuration
│   ├── index.ts           # API exports
│   ├── routes/
│   │   └── bond.routes.ts # API endpoint definitions
│   └── services/
│       └── bond.service.ts# Bond calculation API calls
├── components/
│   ├── BondForm.tsx       # Input form for bond parameters
│   ├── CashflowTable.tsx  # Displays payment schedule
│   ├── ErrorBoundary.tsx  # Error handling wrapper
│   ├── ResultCard.tsx     # Displays calculation results
│   └── *.test.tsx         # Component unit tests
├── config/
│   └── api.ts             # API configuration
├── styles/                # CSS stylesheets
├── test/
│   └── setup.ts           # Test configuration
├── types/
│   └── bond.ts            # TypeScript interfaces
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (see `.env.example` for reference):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Running the Application

- **Development mode**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Testing

- **Run tests**: `npm test`
- **Run tests with UI**: `npm run test:ui`
- **Run tests with coverage**: `npm run test:coverage`

## API Integration

This frontend expects a backend API that provides a bond calculation endpoint. The API should accept:

```typescript
{
  faceValue: number
  couponRate: number
  marketPrice: number
  yearsToMaturity: number
  frequency?: number // Optional, defaults to 2 (semi-annual)
}
```

And return:
```typescript
{
  status: 'Premium' | 'Discount' | 'Par'
  currentYield: number
  yieldToMaturity: number
  totalInterest: number
  cashflows: Array<{
    period: number
    paymentDate: string
    couponPayment: number
    cumulativeInterest: number
    remainingPrincipal: number
  }>
}
```

## Error Handling

The application includes comprehensive error handling for:
- Validation errors (invalid input)
- API errors (server-side issues)
- Network errors (connectivity problems)

All errors are displayed to the user with clear, actionable messages.

## Built With

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/)
