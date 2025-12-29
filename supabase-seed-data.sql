-- ============================================================================
-- SEED DATA FOR TESTING - Luxury Properties in Portugal
-- ============================================================================
-- This script creates sample luxury properties for testing the API
-- Run this AFTER applying the RLS fix (supabase-rls-fix.sql)
-- ============================================================================

-- Insert sample luxury properties
INSERT INTO properties (
    title,
    description,
    property_type,
    address,
    city,
    district,
    postal_code,
    country,
    latitude,
    longitude,
    price,
    bedrooms,
    bathrooms,
    gross_area,
    net_area,
    features,
    amenities,
    images,
    main_image,
    status
) VALUES
-- Property 1: Luxury Villa in Cascais
(
    'Villa Cascais - Vista Mar Espetacular',
    'Moradia de luxo com 5 quartos, piscina infinita e vista deslumbrante para o mar. Acabamentos premium, sistema domótica completo, jardim tropical com 2000m². Localização privilegiada a 5 minutos da praia.',
    'Villa',
    'Avenida Marginal, 123',
    'Cascais',
    'Lisboa',
    '2750-001',
    'Portugal',
    38.6979,
    -9.4215,
    2850000.00,
    5,
    6,
    650.00,
    550.00,
    '["Piscina Infinita", "Jardim Tropical", "Garagem para 4 carros", "Ginásio", "Spa", "Wine Cellar", "Home Cinema", "Smart Home", "Painéis Solares", "Sistema de Segurança 24h"]'::jsonb,
    '["Vista para o Mar", "Praia a 5min", "Campos de Golf Próximos", "Restaurantes Michelin", "Escola Internacional"]'::jsonb,
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'active'
),

-- Property 2: Penthouse in Lisbon
(
    'Penthouse Avenida da Liberdade - Luxo Absoluto',
    'Penthouse exclusiva de 380m² no coração de Lisboa. 4 suites, terraço de 200m² com jacuzzi, vista 360° sobre a cidade. Design de interiores assinado por arquiteto renomado. Condomínio com concierge 24h.',
    'Apartment',
    'Avenida da Liberdade, 250 - 10º Piso',
    'Lisboa',
    'Lisboa',
    '1250-001',
    'Portugal',
    38.7223,
    -9.1439,
    1950000.00,
    4,
    5,
    380.00,
    350.00,
    '["Terraço 200m²", "Jacuzzi", "Vista 360°", "Garagem Privada", "Ar Condicionado Central", "Piso Radiante", "Cozinha Bulthaup", "Electrodomésticos Gaggenau", "Roupeiros Walk-in", "Lareira"]'::jsonb,
    '["Centro Histórico", "Metro a 2min", "Restaurantes", "Teatros", "Museus", "Comércio de Luxo", "Parques"]'::jsonb,
    '["https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800',
    'active'
),

-- Property 3: Luxury Farm in Alentejo
(
    'Herdade de Luxo no Alentejo - 50 Hectares',
    'Propriedade rural de luxo com 50 hectares, casa principal com 8 quartos, casa de hóspedes, piscina olímpica, vinha própria, olival e lago natural. Ideal para turismo rural de alto padrão ou residência permanente.',
    'Farm',
    'Estrada Municipal 520',
    'Évora',
    'Évora',
    '7000-001',
    'Portugal',
    38.5667,
    -7.9000,
    3500000.00,
    8,
    7,
    850.00,
    750.00,
    '["50 Hectares", "Vinha", "Olival", "Lago Natural", "Piscina Olímpica", "Casa de Hóspedes", "Cavalariça", "Adega", "Capela Privada", "Gerador de Energia"]'::jsonb,
    '["Tranquilidade", "Natureza", "Produção de Vinho", "Azeite Premium", "Enoturismo", "Évora a 15km", "Património UNESCO"]'::jsonb,
    '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'active'
),

-- Property 4: Modern Villa in Porto
(
    'Villa Moderna Foz do Douro - Arquitetura Premiada',
    'Moradia contemporânea de arquitetura premiada, 4 quartos en-suite, piscina interior e exterior, elevador privativo. Design minimalista com materiais de primeira linha. Localização premium junto ao mar.',
    'Villa',
    'Rua do Molhe, 88',
    'Porto',
    'Porto',
    '4150-001',
    'Portugal',
    41.1496,
    -8.6756,
    2200000.00,
    4,
    5,
    480.00,
    420.00,
    '["Piscina Interior e Exterior", "Elevador Privativo", "Garagem 3 carros", "Ginásio", "Sauna", "Jardim Vertical", "Domótica Completa", "Isolamento Térmico e Acústico", "Vidros Duplos", "Alarme"]'::jsonb,
    '["Praia a 100m", "Parque da Cidade", "Restaurantes", "Golf Clube", "Marina", "Escola Privada", "Zona Nobre do Porto"]'::jsonb,
    '["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    'active'
),

-- Property 5: Beachfront Apartment in Algarve
(
    'Apartamento Frente Mar - Vilamoura Marina',
    'Apartamento T3 de luxo em primeira linha de mar, com acesso direto à praia. Totalmente mobilado e equipado com design de interiores exclusivo. Condomínio fechado com segurança 24h, piscinas e spa.',
    'Apartment',
    'Marina de Vilamoura, Edifício Atlântico',
    'Vilamoura',
    'Faro',
    '8125-001',
    'Portugal',
    37.0769,
    -8.1175,
    890000.00,
    3,
    3,
    180.00,
    160.00,
    '["Frente Mar", "Totalmente Mobilado", "Ar Condicionado", "Piso Radiante", "Varanda 40m²", "Garagem Fechada", "Arrecadação", "Cozinha Equipada", "Roupeiros Embutidos"]'::jsonb,
    '["Praia Privada", "Marina", "Golf Courses", "Casino", "Restaurantes", "Lojas de Luxo", "Beach Clubs", "Centro de Saúde"]'::jsonb,
    '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'active'
),

-- Property 6: Historic Palace in Sintra
(
    'Palácio Histórico Restaurado - Sintra',
    'Palácio do século XVIII completamente restaurado, 12 quartos, capelas privadas, jardins franceses com 5 hectares, lago ornamental. Classificado como património histórico. Perfeito para hotel boutique ou residência de prestígio.',
    'Palace',
    'Estrada da Pena',
    'Sintra',
    'Lisboa',
    '2710-001',
    'Portugal',
    38.7879,
    -9.3896,
    5800000.00,
    12,
    10,
    1200.00,
    1000.00,
    '["Património Histórico", "Capela Privada", "Jardins Franceses 5ha", "Lago Ornamental", "Biblioteca", "Salão de Festas", "Adega", "Casa do Caseiro", "Estábulos", "Garagem 6 carros"]'::jsonb,
    '["Zona UNESCO", "Castelos Próximos", "Praia a 15min", "Lisboa a 30min", "Restaurantes", "Comércio Local", "Tranquilidade"]'::jsonb,
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'active'
),

-- Property 7: Contemporary Apartment in Lisbon
(
    'Apartamento Contemporâneo - Parque das Nações',
    'T2 moderno com 120m², varanda com vista rio, em condomínio privado com piscina, ginásio e jardins. Proximidade ao Centro Vasco da Gama e estação de metro. Ideal para jovens profissionais.',
    'Apartment',
    'Rua do Mar Vermelho, 15',
    'Lisboa',
    'Lisboa',
    '1990-001',
    'Portugal',
    38.7684,
    -9.0944,
    420000.00,
    2,
    2,
    120.00,
    110.00,
    '["Vista Rio", "Piscina Comum", "Ginásio", "Jardins", "Garagem Box", "Arrecadação", "Ar Condicionado", "Cozinha Equipada", "Varanda 20m²"]'::jsonb,
    '["Metro a 5min", "Shopping Vasco da Gama", "Oceanário", "Pavilhão do Conhecimento", "Restaurantes", "Marina", "Zona Moderna"]'::jsonb,
    '["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
    'active'
),

-- Property 8: Luxury Townhouse in Porto
(
    'Townhouse de Luxo - Ribeira do Porto',
    'Moradia geminada de 4 pisos no centro histórico do Porto, totalmente renovada. 3 suites, terraço panorâmico, garagem. Vista para o rio Douro e Ponte Luis I. Combinação perfeita entre charme histórico e conforto moderno.',
    'Townhouse',
    'Rua dos Mercadores, 42',
    'Porto',
    'Porto',
    '4050-001',
    'Portugal',
    41.1413,
    -8.6140,
    950000.00,
    3,
    4,
    280.00,
    250.00,
    '["Centro Histórico", "Vista Rio Douro", "Terraço Panorâmico", "4 Pisos", "Totalmente Renovado", "Garagem", "Ar Condicionado", "Piso Radiante", "Cozinha Moderna"]'::jsonb,
    '["UNESCO", "Restaurantes", "Caves de Vinho do Porto", "Rio Douro", "Comércio Local", "Vida Noturna", "Cultura"]'::jsonb,
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"]'::jsonb,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'active'
);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify the data was inserted successfully:
-- SELECT id, title, city, price, status FROM properties ORDER BY created_at DESC;

-- ============================================================================
-- INSTRUCTIONS FOR DEPLOYMENT
-- ============================================================================
-- 1. First, apply the RLS fix: supabase-rls-fix.sql
-- 2. Then, run this seed data file
-- 3. Test the API endpoint: https://luxeagent.netlify.app/api/properties
-- 4. You should see 8 luxury properties in the response
-- ============================================================================
