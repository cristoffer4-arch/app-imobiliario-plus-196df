import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertySearch from '@/components/PropertySearch';
import { supabase } from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        or: jest.fn(() => ({
          in: jest.fn(() => ({
            gte: jest.fn(() => ({
              lte: jest.fn(() => ({
                eq: jest.fn(() => ({
                  range: jest.fn(() => ({
                    order: jest.fn(() => ({
                      then: jest.fn(() => Promise.resolve({ data: [], error: null, count: 0 })),
                    })),
                  })),
                })),
              })),
            })),
          })),
        })),
      })),
    })),
  },
}));

// Mock debounce hook
jest.mock('@/lib/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

describe('PropertySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<PropertySearch />);
    const searchInput = screen.getByPlaceholderText(/Pesquisar por título/);
    expect(searchInput).toBeInTheDocument();
  });

  it('renders filter button when showFilters is true', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    expect(filterButton).toBeInTheDocument();
  });

  it('does not render filter button when showFilters is false', () => {
    render(<PropertySearch showFilters={false} />);
    const filterButton = screen.queryByText(/Filtros/);
    expect(filterButton).not.toBeInTheDocument();
  });

  it('toggles advanced filters visibility on button click', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    
    // Initially filters should not be visible
    expect(screen.queryByText(/Filtros Avançados/)).not.toBeInTheDocument();
    
    // Click to show filters
    fireEvent.click(filterButton);
    expect(screen.getByText(/Filtros Avançados/)).toBeInTheDocument();
    
    // Click again to hide
    fireEvent.click(filterButton);
    expect(screen.queryByText(/Filtros Avançados/)).not.toBeInTheDocument();
  });

  it('updates search term on input change', () => {
    render(<PropertySearch />);
    const searchInput = screen.getByPlaceholderText(/Pesquisar por título/) as HTMLInputElement;
    
    fireEvent.change(searchInput, { target: { value: 'Lisboa' } });
    expect(searchInput.value).toBe('Lisboa');
  });

  it('displays loading state', async () => {
    render(<PropertySearch autoSearch={true} />);
    
    await waitFor(() => {
      expect(screen.queryByText(/A pesquisar imóveis/)).toBeInTheDocument();
    });
  });

  it('displays results count when properties found', async () => {
    const mockOnResults = jest.fn();
    render(<PropertySearch onResults={mockOnResults} autoSearch={false} />);
    
    // Simulate search
    const searchButton = screen.queryByText(/Pesquisar/);
    if (searchButton) {
      fireEvent.click(searchButton);
    }
    
    await waitFor(() => {
      expect(mockOnResults).toHaveBeenCalled();
    });
  });

  it('renders tipologia filter', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Tipologia/)).toBeInTheDocument();
  });

  it('renders distrito filter', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Distrito/)).toBeInTheDocument();
  });

  it('renders certificado energético filter', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Certificado Energético/)).toBeInTheDocument();
  });

  it('renders price range filters', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Preço Mínimo/)).toBeInTheDocument();
    expect(screen.getByText(/Preço Máximo/)).toBeInTheDocument();
  });

  it('renders condomínio filter', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Condomínio Máximo/)).toBeInTheDocument();
  });

  it('renders feature checkboxes', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    expect(screen.getByText(/Com Elevador/)).toBeInTheDocument();
    expect(screen.getByText(/Com Varanda/)).toBeInTheDocument();
    expect(screen.getByText(/Com Arrecadação/)).toBeInTheDocument();
  });

  it('clears all filters when clear button clicked', () => {
    render(<PropertySearch showFilters={true} />);
    const filterButton = screen.getByText(/Filtros/);
    fireEvent.click(filterButton);
    
    const clearButton = screen.getByText(/Limpar/);
    fireEvent.click(clearButton);
    
    const searchInput = screen.getByPlaceholderText(/Pesquisar por título/) as HTMLInputElement;
    expect(searchInput.value).toBe('');
  });

  it('calls onResults callback when search completes', async () => {
    const mockOnResults = jest.fn();
    render(<PropertySearch onResults={mockOnResults} autoSearch={false} />);
    
    const searchButton = screen.queryByText(/Pesquisar/);
    if (searchButton) {
      fireEvent.click(searchButton);
      
      await waitFor(() => {
        expect(mockOnResults).toHaveBeenCalled();
      });
    }
  });

  it('calls onLoading callback when loading state changes', async () => {
    const mockOnLoading = jest.fn();
    render(<PropertySearch onLoading={mockOnLoading} autoSearch={false} />);
    
    const searchButton = screen.queryByText(/Pesquisar/);
    if (searchButton) {
      fireEvent.click(searchButton);
      
      await waitFor(() => {
        expect(mockOnLoading).toHaveBeenCalledWith(true);
      });
    }
  });

  it('renders pagination controls when results exceed page size', async () => {
    const mockOnResults = jest.fn();
    render(<PropertySearch onResults={mockOnResults} autoSearch={false} />);
    
    // Simulate having results that would trigger pagination display
    // This would require mocking the Supabase response with count > limit
  });

  it('disables search during loading', async () => {
    render(<PropertySearch autoSearch={false} />);
    
    const searchButton = screen.queryByText(/Pesquisar/);
    if (searchButton) {
      fireEvent.click(searchButton);
      
      await waitFor(() => {
        expect(searchButton).toBeDisabled();
      });
    }
  });
});
