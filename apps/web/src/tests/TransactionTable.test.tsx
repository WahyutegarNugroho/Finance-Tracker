import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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

import TransactionTable from '../components/transactions/TransactionTable';
import { LanguageProvider } from '../context/LanguageContext';

describe('TransactionTable Error Handling & Empty States', () => {
  const defaultProps = {
    transactions: [],
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    formatDate: vi.fn(() => '2026-09-05'),
  };

  it('renders loading spinner when isLoading is true', () => {
    const { container } = render(
      <LanguageProvider>
        <TransactionTable {...defaultProps} isLoading={true} />
      </LanguageProvider>
    );
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders zero state with create_first button when no search and no filter', () => {
    const onAddNew = vi.fn();
    render(
      <LanguageProvider>
        <TransactionTable {...defaultProps} onAddNew={onAddNew} />
      </LanguageProvider>
    );

    const addNewButton = screen.getByRole('button', { name: /Add your first transaction|Tambah transaksi pertama/i });
    expect(addNewButton).toBeInTheDocument();
    fireEvent.click(addNewButton);
    expect(onAddNew).toHaveBeenCalledTimes(1);
  });

  it('renders empty search state with clear search button when searching', () => {
    const onClearSearch = vi.fn();
    render(
      <LanguageProvider>
        <TransactionTable
          {...defaultProps}
          searchQuery="NonExistent123"
          onClearSearch={onClearSearch}
        />
      </LanguageProvider>
    );

    expect(screen.getByText(/NonExistent123/)).toBeInTheDocument();
    const clearButton = screen.getByRole('button', { name: /Reset Search|Reset Pencarian/i });
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    expect(onClearSearch).toHaveBeenCalledTimes(1);
  });

  it('renders empty filter state with clear filter button when type filter active', () => {
    const onClearFilter = vi.fn();
    render(
      <LanguageProvider>
        <TransactionTable
          {...defaultProps}
          typeFilter="income"
          onClearFilter={onClearFilter}
        />
      </LanguageProvider>
    );

    const clearFilterBtn = screen.getByRole('button', { name: /Show All Transactions|Tampilkan Semua Transaksi/i });
    expect(clearFilterBtn).toBeInTheDocument();
    fireEvent.click(clearFilterBtn);
    expect(onClearFilter).toHaveBeenCalledTimes(1);
  });
});
