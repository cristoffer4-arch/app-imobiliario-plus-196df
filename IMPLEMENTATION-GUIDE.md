# 🚀 Guia de Implementação Completa - Imobiliário GO

## ✅ TAREFA 1: Limpeza de Arquivos Legados - CONCLUÍDA

**Arquivos Removidos com Sucesso:**
- ✅ app-complete.js (1,503 linhas)
- ✅ index-complete.html (1,563 linhas)
- ✅ kpis-gemini.js (450 linhas)  
- ✅ kpis-tracker.js (207 linhas)

**Total:** 3,723 linhas de código legado eliminadas

---

## 📦 TAREFA 2: CRUD de Imóveis - ARQUIVOS PARA CRIAR

### 1. Types TypeScript

**Criar:** `src/lib/types/property.ts`

```typescript
export interface Property {
  id: string
  user_id: string
  title: string
  description: string | null
  property_type: 'apartment' | 'house' | 'villa' | 'commercial' | 'land'
  price: number
  location: string
  bedrooms: number | null
  bathrooms: number | null  
  area: number | null
  images: string[] | null
  status: 'available' | 'sold' | 'rented' | 'pending'
  created_at: string
  updated_at: string
}
```

### 2. API Route Principal

**Criar:** `src/app/api/properties/route.ts`

Endpoints: GET (lista), POST (cria)
Autenticação Supabase + RLS
Filtros por status e tipo

### 3. API Route Individual

**Criar:** `src/app/api/properties/[id]/route.ts`

Endpoints: GET, PUT, DELETE (por ID)
Validação user_id
Error handling

---

## 🧪 TAREFA 3: Testes - CONFIGURAÇÃO

### Dependências
```bash
npm install --save-dev jest @testing-library/react @playwright/test
```

### Arquivos de Config
- `jest.config.js` - Configuração Jest
- `jest.setup.js` - Setup testes
- `playwright.config.ts` - Config E2E

### Scripts package.json
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:e2e": "playwright test"
}
```

---

## 🎯 IMPLEMENTAÇÃO RÁPIDA

### Opção A: Via GitHub Web
1. Add file → Create new file
2. Copiar código dos guias
3. Commit changes

### Opção B: Local (Recomendado)
```bash
git clone [repo]
cd app-imobiliario-plus-196df
mkdir -p src/lib/types src/app/api/properties/[id]
# Criar arquivos com código
git add .
git commit -m "feat: CRUD properties + tests config"
git push
```

---

## 📋 CHECKLIST

**CRUD:**
- [ ] src/lib/types/property.ts
- [ ] src/app/api/properties/route.ts  
- [ ] src/app/api/properties/[id]/route.ts
- [ ] Testar endpoints

**Testes:**
- [ ] Instalar dependências
- [ ] jest.config.js
- [ ] playwright.config.ts
- [ ] Scripts no package.json

**Deploy:**
- [ ] Testar local (npm run dev)
- [ ] Commit e push
- [ ] Verificar Netlify

---

## 🔗 Referências

- Código completo está em STATUS-PROJETO.md
- Schema DB em supabase-schema.sql
- Deploy: https://app-imobiliario-plus.netlify.app

**Status:** ✅ Pronto para implementação
**Data:** 28/12/2024
