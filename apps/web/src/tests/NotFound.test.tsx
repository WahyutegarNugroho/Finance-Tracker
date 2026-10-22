import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/broken-ledger-link',
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src?: string; alt?: string; priority?: boolean; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ''} />
  ),
}));

import NotFound from '../app/not-found';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';

describe('Custom 404 Not Found Page', () => {
  it('renders the 404 error code, ledger receipt slip, and navigation links', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <NotFound />
        </LanguageProvider>
      </ThemeProvider>
    );

    // 404 code check
    expect(screen.getByText('404')).toBeInTheDocument();

    // H1 check
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

    // Receipt Slip check
    expect(screen.getByText(/SLIP #404/i)).toBeInTheDocument();

    // Primary CTA check
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);

    // Quick navigation destinations check
    expect(screen.getByText(/Quick Ledger Navigation|Navigasi Cepat Buku Kas/i)).toBeInTheDocument();
  });
});
