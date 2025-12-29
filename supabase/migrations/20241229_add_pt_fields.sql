-- Migration: Add Portuguese-specific fields to properties table
-- Created: 2024-12-29
-- Description: Adds PT market-specific fields including tipologia, certificates, taxes, and location data

-- Add Portuguese-specific columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS
  -- Tipologia Portuguesa (T0, T1, T2, etc.)
  tipologia TEXT CHECK (tipologia IN ('T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+', 'Loft', 'Duplex', 'Fração')),
  
  -- Licenças e Certificações
  licenca_habitacao TEXT,
  certificado_energetico TEXT CHECK (certificado_energetico IN ('A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F')),
  al_license TEXT, -- Licença Alojamento Local
  al_numero_registo TEXT, -- Número de registo AL
  
  -- Condomínio
  condominio_mensal DECIMAL(10,2),
  condominio_inclui TEXT[], -- Ex: ARRAY['água', 'gás', 'limpeza']
  
  -- IMI/Impostos PT
  imi_anual DECIMAL(10,2),
  imt_estimado DECIMAL(10,2),
  imposto_selo DECIMAL(10,2),
  
  -- Características PT
  orientacao TEXT CHECK (orientacao IN ('Norte', 'Sul', 'Este', 'Oeste', 'Nascente', 'Poente')),
  vista TEXT[], -- Ex: ARRAY['mar', 'cidade', 'serra', 'rio']
  elevador BOOLEAN DEFAULT false,
  lugar_garagem INTEGER DEFAULT 0,
  arrecadacao BOOLEAN DEFAULT false,
  varanda BOOLEAN DEFAULT false,
  varanda_area DECIMAL(6,2),
  
  -- Zonamento PT
  freguesia TEXT,
  distrito TEXT,
  concelho TEXT;

-- Create indexes for performance on PT-specific searches
CREATE INDEX IF NOT EXISTS idx_properties_tipologia ON properties(tipologia);
CREATE INDEX IF NOT EXISTS idx_properties_distrito ON properties(distrito);
CREATE INDEX IF NOT EXISTS idx_properties_concelho ON properties(concelho);
CREATE INDEX IF NOT EXISTS idx_properties_certificado ON properties(certificado_energetico);
CREATE INDEX IF NOT EXISTS idx_properties_al_license ON properties(al_license) WHERE al_license IS NOT NULL;

-- Create composite index for common PT searches
CREATE INDEX IF NOT EXISTS idx_properties_pt_search 
ON properties(distrito, concelho, tipologia, certificado_energetico) 
WHERE distrito IS NOT NULL;

-- Add comment to table
COMMENT ON COLUMN properties.tipologia IS 'Tipologia portuguesa (T0, T1, T2, T3, T4, T5, T6+, Loft, Duplex, Fração)';
COMMENT ON COLUMN properties.certificado_energetico IS 'Certificado Energético (A+ a F)';
COMMENT ON COLUMN properties.al_license IS 'Licença de Alojamento Local';
COMMENT ON COLUMN properties.imi_anual IS 'Imposto Municipal sobre Imóveis (anual)';
COMMENT ON COLUMN properties.imt_estimado IS 'Imposto Municipal sobre Transmissões (estimado)';
COMMENT ON COLUMN properties.distrito IS 'Distrito de Portugal';
COMMENT ON COLUMN properties.concelho IS 'Concelho (município)';
COMMENT ON COLUMN properties.freguesia IS 'Freguesia (parish)';
