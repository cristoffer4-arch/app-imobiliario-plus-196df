import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import PricingPage from '@/app/pricing/page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Pricing Page', () => {
  const mockPush = jest.fn();
  const mockFetch = global.fetch as jest.Mock;

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    mockFetch.mockClear();
    mockPush.mockClear();
  });

  it('should render all pricing plans', () => {
    render(<PricingPage />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('should display correct prices', () => {
    render(<PricingPage />);
    
    expect(screen.getByText('€0')).toBeInTheDocument();
    expect(screen.getByText('€29')).toBeInTheDocument();
    expect(screen.getByText('€79')).toBeInTheDocument();
    expect(screen.getByText('€149')).toBeInTheDocument();
    expect(screen.getByText('€497')).toBeInTheDocument();
  });

  it('should mark PRO plan as popular', () => {
    render(<PricingPage />);
    
    expect(screen.getByText('MAIS POPULAR')).toBeInTheDocument();
  });

  it('should navigate to dashboard for free plan', async () => {
    render(<PricingPage />);
    
    const freeButton = screen.getAllByRole('button')[0];
    fireEvent.click(freeButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should call checkout API for paid plans', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/test' }),
    });

    // Mock window.location
    delete (window as any).location;
    window.location = { href: '' } as any;

    render(<PricingPage />);
    
    const starterButton = screen.getAllByRole('button')[1];
    fireEvent.click(starterButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: 'starter' }),
      });
    });
  });

  it('should display FAQ section', () => {
    render(<PricingPage />);
    
    expect(screen.getByText('Perguntas Frequentes')).toBeInTheDocument();
    expect(screen.getByText('Posso cancelar a qualquer momento?')).toBeInTheDocument();
  });
});
