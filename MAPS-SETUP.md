# Mapas Interativos - Guia de Setup

## 📦 Dependências Necessárias

Para utilizar todas as funcionalidades de mapas, adicione ao `package.json`:

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "leaflet.markercluster": "^1.5.3",
    "leaflet.heat": "^0.2.0",
    "leaflet-draw": "^1.0.4",
    "leaflet-routing-machine": "^3.2.12",
    "@types/leaflet": "^1.9.8",
    "@types/leaflet.markercluster": "^1.5.4",
    "@types/leaflet.heat": "^0.2.3",
    "@types/leaflet-draw": "^1.0.11"
  }
}
```

## 🚀 Instalação

```bash
npm install leaflet leaflet.markercluster leaflet.heat leaflet-draw leaflet-routing-machine
npm install -D @types/leaflet @types/leaflet.markercluster @types/leaflet.heat @types/leaflet-draw
```

## 🗺️ Componentes Disponíveis

### 1. PropertyMap (Básico)
**Arquivo**: `src/components/PropertyMap.tsx`

**Uso**:
```tsx
import PropertyMap from '@/components/PropertyMap'

<PropertyMap 
  properties={properties}
  center={{ lat: 38.7223, lng: -9.1393 }}
  zoom={12}
  onPropertyClick={(id) => console.log(id)}
/>
```

### 2. PropertyMapAdvanced (Avançado)
**Arquivo**: `src/components/PropertyMapAdvanced.tsx`

**Features**:
- ✅ **Clustering**: Agrupa marcadores próximos
- ✅ **Heatmap**: Visualiza densidade por preço
- ✅ **Polygon Drawing**: Desenhar áreas de interesse
- ✅ **Routing**: Calcular rotas entre propriedades
- ✅ **Filtros**: Preço, tipo, raio

**Uso**:
```tsx
import PropertyMapAdvanced from '@/components/PropertyMapAdvanced'

<PropertyMapAdvanced 
  center={{ lat: 38.7223, lng: -9.1393 }}
  zoom={12}
  filters={{
    minPrice: 200000,
    maxPrice: 500000,
    propertyType: 'apartment',
    radiusKm: 10
  }}
  onPropertyClick={(id) => console.log(id)}
/>
```

## 🔧 API Routes

### GET /api/properties/nearby

**Parâmetros**:
- `lat` (required): Latitude
- `lng` (required): Longitude  
- `radiusKm` (optional, default: 5): Raio em km
- `limit` (optional, default: 50): Limite de resultados
- `minPrice` (optional): Preço mínimo
- `maxPrice` (optional): Preço máximo
- `type` (optional): Tipo de propriedade

**Exemplo**:
```bash
GET /api/properties/nearby?lat=38.7223&lng=-9.1393&radiusKm=10&minPrice=200000
```

**Resposta**:
```json
{
  "success": true,
  "count": 25,
  "radius": 10,
  "center": { "lat": 38.7223, "lng": -9.1393 },
  "properties": [
    {
      "id": "uuid",
      "title": "Apartamento T2 Lisboa",
      "price": 350000,
      "latitude": 38.7223,
      "longitude": -9.1393,
      "distance": 1234.56,
      "distanceKm": "1.23"
    }
  ]
}
```

## 🗄️ Database - PostGIS

### Funções Disponíveis

#### 1. properties_within_radius()
Busca propriedades dentro de um raio:

```sql
SELECT * FROM properties_within_radius(
  38.7223,  -- latitude
  -9.1393,  -- longitude
  5000      -- raio em metros
);
```

#### 2. update_property_location()
Trigger automático que atualiza `location` quando `latitude/longitude` mudam.

### Queries Úteis

**Propriedades mais próximas**:
```sql
SELECT 
  title,
  ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(-9.1393, 38.7223), 4326)::geography
  ) / 1000 as distance_km
FROM properties
WHERE location IS NOT NULL
ORDER BY location <-> ST_SetSRID(ST_MakePoint(-9.1393, 38.7223), 4326)::geography
LIMIT 10;
```

## 📍 Lib Functions

**Arquivo**: `src/lib/maps.ts`

### getPropertiesWithinRadius()
```typescript
import { getPropertiesWithinRadius } from '@/lib/maps'

const { properties } = await getPropertiesWithinRadius(
  38.7223,  // lat
  -9.1393,  // lng
  5000      // raio em metros
)
```

### getPropertiesInBounds()
```typescript
import { getPropertiesInBounds } from '@/lib/maps'

const { properties } = await getPropertiesInBounds({
  northEast: { lat: 38.8, lng: -9.0 },
  southWest: { lat: 38.6, lng: -9.3 }
})
```

### calculateDistance()
```typescript
import { calculateDistance, formatDistance } from '@/lib/maps'

const meters = calculateDistance(38.7223, -9.1393, 38.7500, -9.1500)
const formatted = formatDistance(meters) // "2.5 km"
```

## 🎨 Modos de Visualização

### 1. Markers (Marcadores)
- Marcadores individuais
- Popups com informações
- Click handler customizado

### 2. Clusters (Agrupamento)
- Agrupa marcadores próximos
- Auto-ajuste no zoom
- Melhor performance com muitos pontos

### 3. Heatmap (Mapa de Calor)
- Visualiza densidade
- Cor baseada no preço
- Gradiente azul → verde → vermelho

## 🎯 Próximas Features

- [ ] Routing entre múltiplas propriedades
- [ ] Filtros avançados no mapa
- [ ] Exportar áreas desenhadas
- [ ] Clustering customizado por preço
- [ ] Animações de transição

## 🔒 Segurança

- API protegida com validação de parâmetros
- RLS (Row Level Security) no Supabase
- Rate limiting recomendado
- CORS configurado

## 📱 Next.js 15 Compatibility

Todos os componentes usam:
- `'use client'` directive
- Dynamic imports com `ssr: false`
- Compatible com App Router
- TypeScript 100%

## 🐛 Troubleshooting

### Erro: "window is not defined"
**Solução**: Usar dynamic import:
```tsx
import dynamic from 'next/dynamic'

const PropertyMap = dynamic(
  () => import('@/components/PropertyMap'),
  { ssr: false }
)
```

### Markers não aparecem
**Solução**: Verificar se os dados têm `latitude` e `longitude`.

### PostGIS não funciona
**Solução**: Executar migration:
```bash
psql -d your_database -f supabase/migrations/enable_postgis.sql
```

## 📚 Documentação

- [Leaflet Docs](https://leafletjs.com/)
- [PostGIS Docs](https://postgis.net/)
- [Supabase PostGIS](https://supabase.com/docs/guides/database/extensions/postgis)

---

**Última atualização**: 28 Dezembro 2025  
**Versão**: 1.0.0
