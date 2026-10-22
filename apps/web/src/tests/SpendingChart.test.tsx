import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/firebase', () => ({
  auth: { currentUser: null, onAuthStateChanged: vi.fn() },
  googleProvider: {},
  default: {},
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'demo-user', email: 'demo@fintrack.com' },
    formatCurrency: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
    currency: 'IDR',
    currencySymbol: 'Rp',
  }),
}));

vi.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut" />,
  Line: () => <div data-testid="mock-line" />,
}));

vi.mock('@/lib/register-doughnut', () => ({}));

import SpendingChart from '../components/dashboard/SpendingChart';
import { LanguageProvider } from '../context/LanguageContext';

describe('SpendingChart more categories badge translation', () => {
  const dummyCategories = [
    { name: 'Food & Dining', percentage: 30, color: '#f00' },
    { name: 'Rent & Utilities', percentage: 25, color: '#0f0' },
    { name: 'Transportation', percentage: 15, color: '#00f' },
    { name: 'Entertainment', percentage: 10, color: '#ff0' },
    { name: 'Shopping', percentage: 10, color: '#0ff' },
    { name: 'Healthcare', percentage: 5, color: '#f0f' },
    { name: 'Education', percentage: 5, color: '#fff' },
  ];

  it('renders badge with correct localized text when categories > 5', () => {
    render(
      <LanguageProvider>
        <SpendingChart expenseByCategory={dummyCategories} totalExpense={5000000} />
      </LanguageProvider>
    );

    expect(screen.queryByText(/analytics_page\.more_categories/i)).not.toBeInTheDocument();
    expect(screen.getByText(/\+2 (more categories|kategori lainnya)/i)).toBeInTheDocument();
  });

  it('does not render more categories badge when categories <= 5', () => {
    render(
      <LanguageProvider>
        <SpendingChart expenseByCategory={dummyCategories.slice(0, 5)} totalExpense={4000000} />
      </LanguageProvider>
    );

    expect(screen.queryByText(/\+/i)).not.toBeInTheDocument();
  });
});
