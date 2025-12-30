import { PropertyPT, TipologiaPT, CertificadoEnergetico } from '@/types/property-pt';

/**
 * Helpers para geração de metadados SEO para imóveis portugueses
 * Inclui Schema.org, Open Graph tags e formatos PT
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  ogUrl?: string;
  schema?: object;
}

/**
 * Formata preço em EUR para formato português
 */
export function formatPriceEUR(price: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formata área em m² para formato português
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('pt-PT')} m²`;
}

/**
 * Gera localização completa no formato PT (Distrito > Concelho > Freguesia)
 */
export function formatLocationPT(
  distrito?: string,
  concelho?: string,
  freguesia?: string
): string {
  const parts = [freguesia, concelho, distrito].filter(Boolean);
  return parts.join(', ');
}

/**
 * Gera descrição curta para SEO
 */
export function generateShortDescription(property: PropertyPT): string {
  const { tipologia, area, price, concelho, distrito } = property;
  const location = formatLocationPT(distrito, concelho);
  
  return `${tipologia} com ${formatArea(area)} por ${formatPriceEUR(price)} em ${location}. ${
    property.certificado_energetico ? `Certificado energético ${property.certificado_energetico}.` : ''
  }`;
}

/**
 * Gera keywords para SEO baseadas nas características do imóvel
 */
export function generateKeywords(property: PropertyPT): string[] {
  const keywords: string[] = [
    'imóvel',
    'imóvel portugal',
    property.tipologia,
    property.distrito || '',
    property.concelho || '',
  ];

  if (property.certificado_energetico) {
    keywords.push(`certificado energético ${property.certificado_energetico}`);
  }

  if (property.elevador) keywords.push('com elevador');
  if (property.lugar_garagem) keywords.push('com garagem');
  if (property.varanda) keywords.push('com varanda');
  if (property.vista?.length) keywords.push(...property.vista.map(v => `vista ${v}`));

  return keywords.filter(Boolean);
}

/**
 * Gera Schema.org estruturado para imóvel
 */
export function generatePropertySchema(property: PropertyPT, url: string): object {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description || generateShortDescription(property),
    url: url,
    image: property.images?.[0] || '',
    datePosted: property.created_at,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.concelho,
      addressRegion: property.distrito,
      postalCode: property.zip_code,
      addressCountry: 'PT',
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude,
    } : undefined,
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'MTK', // Square meters
    },
  };

  // Remove undefined fields
  return JSON.parse(JSON.stringify(schema));
}

/**
 * Gera metadados Open Graph para compartilhamento social
 */
export function generateOpenGraphTags(property: PropertyPT, url: string): Record<string, string> {
  return {
    'og:type': 'product',
    'og:title': property.title,
    'og:description': generateShortDescription(property),
    'og:url': url,
    'og:image': property.images?.[0] || property.thumbnail || '',
    'og:site_name': 'Imobiliário Plus',
    'og:locale': 'pt_PT',
    'product:price:amount': property.price.toString(),
    'product:price:currency': 'EUR',
  };
}

/**
 * Gera metadados Twitter Card
 */
export function generateTwitterCardTags(property: PropertyPT): Record<string, string> {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': property.title,
    'twitter:description': generateShortDescription(property),
    'twitter:image': property.images?.[0] || property.thumbnail || '',
  };
}

/**
 * Gera todos os metadados SEO para uma propriedade
 */
export function generatePropertySEO(property: PropertyPT, url: string): SEOMetadata {
  const shortDesc = generateShortDescription(property);
  
  return {
    title: `${property.title} - ${property.tipologia} em ${property.concelho || property.distrito}`,
    description: shortDesc,
    keywords: generateKeywords(property),
    canonical: url,
    ogType: 'product',
    ogImage: property.images?.[0] || property.thumbnail,
    ogUrl: url,
    schema: generatePropertySchema(property, url),
  };
}

/**
 * Gera breadcrumb schema para navegação
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Gera title tag otimizado para SEO
 */
export function generatePageTitle(
  propertyTitle: string,
  tipologia: TipologiaPT,
  location: string,
  suffix = 'Imobiliário Plus'
): string {
  return `${propertyTitle} - ${tipologia} em ${location} | ${suffix}`;
}

/**
 * Gera meta description otimizada
 */
export function generateMetaDescription(
  tipologia: TipologiaPT,
  area: number,
  price: number,
  location: string,
  features: string[] = []
): string {
  const featuresText = features.slice(0, 3).join(', ');
  return `${tipologia} de ${formatArea(area)} por ${formatPriceEUR(price)} em ${location}.${
    featuresText ? ` Com ${featuresText}.` : ''
  } Veja detalhes e agende visita.`;
}
