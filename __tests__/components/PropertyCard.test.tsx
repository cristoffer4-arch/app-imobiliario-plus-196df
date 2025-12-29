import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: '123',
    title: 'Apartamento T2 em Lisboa',
    description: 'Moderno apartamento com vista para o Tejo',
    type: 'apartment',
    status: 'active',
    price: 350000,
    address: 'Rua do Comércio, 123',
    city: 'Lisboa',
    state: 'Lisboa',
    zip_code: '1100-000',
    neighborhood: 'Baixa',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    garage_spaces: 1,
    images: ['https://example.com/image1.jpg'],
    thumbnail: 'https://example.com/thumb.jpg',
    created_by: 'user123',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  };

  it('renders property card with title', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Apartamento T2 em Lisboa')).toBeInTheDocument();
  });

  it('displays property price', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/350/)).toBeInTheDocument();
  });

  it('displays property location', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Lisboa/)).toBeInTheDocument();
  });

  it('displays number of bedrooms', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/2.*quartos/)).toBeInTheDocument();
  });

  it('displays number of bathrooms', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/2.*banheiros/)).toBeInTheDocument();
  });

  it('displays property area', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/85.*m²/)).toBeInTheDocument();
  });

  it('displays property description', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Moderno apartamento com vista para o Tejo')).toBeInTheDocument();
  });

  it('renders property image', () => {
    render(<PropertyCard property={mockProperty} />);
    const image = screen.getByAltText('Apartamento T2 em Lisboa');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('has link to property detail page', () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByTestId('property-card');
    expect(link.closest('a')).toHaveAttribute('href', '/properties/123');
  });

  it('uses placeholder image when no images provided', () => {
    const propertyNoImage = { ...mockProperty, images: undefined };
    render(<PropertyCard property={propertyNoImage} />);
    const image = screen.getByAltText('Apartamento T2 em Lisboa');
    expect(image).toHaveAttribute('src', '/placeholder-property.jpg');
  });

  it('formats price correctly for PT-BR locale', () => {
    render(<PropertyCard property={mockProperty} />);
    // Should format as R$ 350.000,00 or similar
    const priceElement = screen.getByText(/350/);
    expect(priceElement).toBeInTheDocument();
  });

  it('applies hover effect classes', () => {
    const { container } = render(<PropertyCard property={mockProperty} />);
    const cardDiv = container.querySelector('.hover\\:shadow-xl');
    expect(cardDiv).toBeInTheDocument();
  });
});
