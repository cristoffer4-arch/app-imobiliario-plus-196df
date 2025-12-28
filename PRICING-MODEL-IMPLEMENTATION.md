# Novo Modelo de Pricing - Implementação

**Data:** 28 Dezembro 2024, 21:00 WET  
**Status:** ✅ Em Implementação

---

## 🎯 MUDANÇAS IMPLEMENTADAS

### ✅ 1. Criado `src/lib/entitlements.ts`

**Funcionalidade completa de Feature Gating:**
- 5 planos definidos (free, starter, pro, premium, enterprise)
- Limites específicos por feature
- Funções helper para verificar acesso
- Sistema de sugestão de upgrade automático

**Destaques:**
```typescript
// Verificar se usuário pode adicionar mais propriedades
const check = await checkLimit('max_comparison_properties', currentCount)
if (!check.allowed) {
  alert(getUpgradeMessage('Comparação', check.suggested_plan))
}
```

---

## 📊 NOVO MODELO DE PREÇOS

| Feature | Free | Starter (€47) | Pro (€97) ⭐ | Premium (€197) | Enterprise (€497) |
|---------|------|---------------|-------------|----------------|------------------|
| **Comparação** | 0 imóveis | 2 imóveis | 4 imóveis | Ilimitado | Ilimitado |
| **Áreas Salvas** | 0 | 1-2 | 5-10 | Ilimitado | Ilimitado |
| **Favoritos** | 10 | 50 | Ilimitado | Ilimitado | Ilimitado |
| **IA/Dia** | 1 | Ilimitado | Ilimitado | Ilimitado | Ilimitado |
| **IA/Mês** | 30 | 10 | 100 | 500 | Ilimitado |
| **Clusters Map** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Heatmap** | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Email Alerts** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **API Access** | ❌ | ❌ | ✅ Básico | ✅ Completo | ✅ Custom |
| **Suporte** | 48h | 24h | 12h Priority | 6h | 24/7 |

---

## 🔧 PRÓXIMOS PASSOS (MANUAL)

### 2. Atualizar `src/lib/property-comparison.ts`

**Adicionar no início:**
```typescript
import { checkLimit, getUpgradeMessage } from './entitlements'
```

**Modificar função `addToComparison`:**
```typescript
export async function addToComparison(propertyId: string): Promise<boolean> {
  const comparison = getComparisonFromStorage()
  
  if (comparison.includes(propertyId)) {
    return false
  }
  
  // NOVO: Verificar limite do plano
  const limitCheck = await checkLimit('max_comparison_properties', comparison.length)
  
  if (!limitCheck.allowed) {
    throw new Error(getUpgradeMessage('Comparação de Imóveis', limitCheck.suggested_plan))
  }
  
  comparison.push(propertyId)
  saveComparisonToStorage(comparison)
  return true
}
```

---

### 3. Atualizar `src/lib/saved-areas.ts`

**Adicionar verificação:**
```typescript
import { checkLimit, getUpgradeMessage } from './entitlements'

export async function saveArea(
  name: string,
  coordinates: [number, number][],
  color?: string
): Promise<string | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Utilizador não autenticado')
  }
  
  // NOVO: Verificar limite de áreas
  const { count } = await supabase
    .from('saved_areas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
  
  const limitCheck = await checkLimit('max_saved_areas', count || 0)
  
  if (!limitCheck.allowed) {
    throw new Error(getUpgradeMessage('Áreas Salvas', limitCheck.suggested_plan))
  }
  
  // ... resto do código existente
}
```

---

### 4. Atualizar `src/lib/notifications.ts`

**Verificar preferências de email/push por plano:**
```typescript
import { getUserPlanLimits } from './entitlements'

export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return false
  
  // NOVO: Verificar se plano permite email/push
  const limits = await getUserPlanLimits()
  
  // Bloquear email se plano não permite
  if (preferences.emailNotifications && !limits.email_notifications) {
    throw new Error('Email notifications disponíveis apenas nos planos Premium e Enterprise')
  }
  
  // Bloquear push se plano não permite
  if (preferences.pushNotifications && !limits.push_notifications) {
    throw new Error('Push notifications disponíveis apenas nos planos Premium e Enterprise')
  }
  
  // ... resto do código
}
```

---

### 5. Atualizar Componentes UI

**PropertyMapAdvanced.tsx - Condicionar Heatmap:**
```typescript
import { hasFeatureAccess } from '@/lib/entitlements'

// No componente:
const [canUseHeatmap, setCanUseHeatmap] = useState(false)

useEffect(() => {
  hasFeatureAccess('heatmap').then(setCanUseHeatmap)
}, [])

// No render:
{canUseHeatmap && (
  <button onClick={toggleHeatmap}>
    Heatmap
  </button>
)}
```

**PropertyCard - Botão de Comparação:**
```typescript
import { checkLimit } from '@/lib/entitlements'

const handleAddToComparison = async () => {
  try {
    await addToComparison(property.id)
    toast.success('Adicionado à comparação!')
  } catch (error) {
    // Erro já contém mensagem de upgrade
    toast.error(error.message)
    // Opcional: abrir modal de upgrade
    openUpgradeModal()
  }
}
```

---

## 🎯 TRIGGERS DE UPGRADE

### Free → Starter
**Momento:** Tentativa de comparar 2 imóveis  
**Mensagem:** "Comparação de Imóveis atingiu o limite do seu plano. Faça upgrade para Starter para continuar."  
**CTA:** "Upgrade para Starter (€47/mês)"

### Starter → Pro ⭐
**Momento:** Tentativa de salvar 3ª área ou comparar 3º imóvel  
**Mensagem:** "Desbloquei
