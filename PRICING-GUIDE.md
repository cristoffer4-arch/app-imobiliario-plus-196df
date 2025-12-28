# 🎯 Guia de Integração: Sistema de Preços + Voucher + OAuth Gemini

## 📋 Visão Geral

Este guia explica como integrar **TODOS** os snippets criados nos arquivos existentes do LuxeAgent Pro.

---

## 🗂️ Arquivos Criados

1. ✅ **PRICING-SYSTEM-SNIPPETS.js** - JavaScript para app.js
2. ✅ **PRICING-SYSTEM-SNIPPETS.sql** - SQL para Supabase
3. ✅ **PRICING-SYSTEM-SNIPPETS.html** - HTML/CSS para index.html
4. ✅ **OAUTH-EDGE-FUNCTIONS.ts** - Edge Functions para OAuth
5. ✅ **PRICING-INTEGRATION-GUIDE.md** - Este guia

---

## 🔧 Passo 1: Atualizar Supabase Schema

### 1.1. Executar SQL no Supabase

```bash
# Acesse: https://app.supabase.com
# Vá para: SQL Editor
# Copie TODO o conteúdo de: PRICING-SYSTEM-SNIPPETS.sql
# Cole no editor e clique "Run"
```

### 1.2. Verificar Tabelas Criadas

```sql
-- Execute para verificar:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_oauth_tokens', 'subscription_usage', 'subscription_plans');

-- Deve retornar 3 tabelas
```

### 1.3. Verificar Colunas Adicionadas

```sql
-- Execute para verificar:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('subscription_plan', 'voucher_code', 'voucher_used');

-- Deve retornar 3 colunas
```

---

## 🔧 Passo 2: Atualizar app.js

### 2.1. Substituir CONFIG

**Localize** (linha ~20):
```javascript
const CONFIG = {
    SUPABASE_URL: '',
    // ...
```

**Substitua** por:
```javascript
// COPIE o novo CONFIG do PRICING-SYSTEM-SNIPPETS.js
const CONFIG = {
    // ... manter credenciais existentes ...
    
    // ADICIONAR toda a seção PLANS
    PLANS: {
        FREE: { /* ... */ },
        STARTER: { /* ... */ },
        // ... etc
    },
    
    VOUCHER_CODE: 'LUXAI-LAUNCH-3M-2025',
    // ... etc
```

### 2.2. Adicionar Novas Funções

**Após a função `executeAISearch()` (linha ~230), ADICIONE:**

```javascript
// Copie TODAS estas funções do PRICING-SYSTEM-SNIPPETS.js:

async function validateVoucher(voucherCode) { /* ... */ }
async function checkSubscriptionExpiry() { /* ... */ }
function showSubscriptionExpiredModal() { /* ... */ }
function generatePricingCards(compactMode) { /* ... */ }
async function selectPlan(planId) { /* ... */ }
async function continueWithFree() { /* ... */ }
async function checkFeatureAccess(featureName) { /* ... */ }
async function initiateGoogleOAuthForGemini() { /* ... */ }
async function handleOAuthCallback(event) { /* ... */ }
async function hasGeminiOAuth() { /* ... */ }
function updateGeminiConnectionStatus(connected) { /* ... */ }
function showVoucherModal() { /* ... */ }
async function activateVoucher() { /* ... */ }
function skipVoucher() { /* ... */ }
```

### 2.3. Substituir handleAuthSuccess()

**Localize** a função `handleAuthSuccess(user)` existente.

**Substitua** pela nova versão que inclui verificação de voucher:

```javascript
// COPIE a função handleAuthSuccess completa do PRICING-SYSTEM-SNIPPETS.js
async function handleAuthSuccess(user) {
    currentUser = user;
    
    // ... código existente ...
    
    // NOVO: Verificação de voucher
    const isFirstLogin = new Date(profile.created_at) > new Date(Date.now() - 60000);
    if (isFirstLogin && !profile.voucher_used) {
        setTimeout(() => showVoucherModal(), 1000);
    }
    
    // ... resto do código ...
}
```

### 2.4. Atualizar Objeto app

**No final do app.js**, localize:

```javascript
const app = {
    showDashboard: () => { /* ... */ },
    // ... propriedades existentes ...
};
```

**ADICIONE** as novas propriedades:

```javascript
const app = {
    // ... propriedades existentes ...
    
    // ADICIONAR:
    validateVoucher: validateVoucher,
    activateVoucher: activateVoucher,
    skipVoucher: skipVoucher,
    checkSubscriptionExpiry: checkSubscriptionExpiry,
    selectPlan: selectPlan,
    continueWithFree: continueWithFree,
    checkFeatureAccess: checkFeatureAccess,
    initiateGoogleOAuthForGemini: initiateGoogleOAuthForGemini,
    hasGeminiOAuth: hasGeminiOAuth,
    
    // ... resto das propriedades ...
};
```

---

## 🔧 Passo 3: Atualizar index.html

### 3.1. Adicionar CSS

**Dentro da tag `<style>`, ADICIONE no final:**

```html
<!-- COPIE toda a seção de CSS do PRICING-SYSTEM-SNIPPETS.html -->

/* Pricing Cards */
.pricing-section { /* ... */ }
.pricing-grid { /* ... */ }
.pricing-card { /* ... */ }
/* ... todo o resto do CSS ... */
```

### 3.2. Adicionar Plan Badge no Header

**Localize** no HTML:

```html
<div class="header-actions">
    <div class="header-icon-btn" onclick="app.toggleNotifications()">
        <!-- ... -->
    </div>
```

**ADICIONE** após o segundo header-icon-btn:

```html
<div class="header-actions">
    <div class="header-icon-btn" onclick="app.toggleNotifications()">
        <i class="fas fa-bell"></i>
        <span class="notification-badge" id="notification-count">3</span>
    </div>
    
    <div class="header-icon-btn" onclick="app.openModule('gamification')">
        <i class="fas fa-trophy"></i>
    </div>
    
    <!-- NOVO: Plan Badge -->
    <div id="plan-badge-header" class="plan-badge free" onclick="app.openModule('subscription')" style="cursor:pointer;margin:0 0.5rem">
        <i class="fas fa-gem"></i>
        <span id="plan-name-header">Free</span>
    </div>
    
    <!-- ... resto dos botões ... -->
</div>
```

### 3.3. Adicionar Gemini Status no Dashboard

**Localize** `<div id="dashboard-view">` e **ADICIONE** logo após:

```html
<div id="dashboard-view">
    <!-- NOVO: Gemini Connection Status -->
    <div id="gemini-status" class="gemini-status-card hidden">
        <div class="gemini-status-info">
            <div class="gemini-status-title">
                <i class="fas fa-robot"></i>
                IA Gemini
            </div>
            <div class="gemini-status-description">
                Conecte sua conta Google para usar IA gratuitamente
            </div>
        </div>
        <button class="gemini-connect-btn" onclick="app.initiateGoogleOAuthForGemini()">
            <i class="fab fa-google"></i>
            Conectar Google
        </button>
    </div>
    
    <!-- Existing Stats Grid -->
    <div class="stats-grid">
        <!-- ... -->
    </div>
</div>
```

---

## 🔧 Passo 4: Deploy Edge Functions

### 4.1. Criar oauth-exchange Function

```bash
# Crie a função
supabase functions new oauth-exchange

# Copie o código
# supabase/functions/oauth-exchange/index.ts
# <- COPIE o código de OAUTH-EDGE-FUNCTIONS.ts

# Deploy
supabase functions deploy oauth-exchange
```

### 4.2. Atualizar ai-search Function

```bash
# Edite a função existente
# supabase/functions/ai-search/index.ts

# ADICIONE as funções helper:
# - getUserGeminiToken()
# - decryptToken()
# - refreshGeminiToken()
# - deduplicateWithGemini() - versão atualizada

# MODIFIQUE a função principal para usar OAuth token

# Deploy
supabase functions deploy ai-search
```

### 4.3. Atualizar outras AI Functions

Repita o processo para:
- `ai-coaching`
- `ai-assistant`
- `ai-idealista`
- `ai-pricing`

**Em todas, adicione:**
```typescript
const geminiToken = await getUserGeminiToken(supabaseClient, user.id)
// Usar token nas chamadas Gemini
```

---

## 🔧 Passo 5: Configurar .env

### 5.1. Adicionar Variáveis

```bash
# Edite .env e ADICIONE:

# Google OAuth (NOVO)
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Encryption (NOVO)
ENCRYPTION_KEY=your-random-32-char-encryption-key

# Stripe Price IDs (NOVO)
STRIPE_PRICE_STARTER=price_1234_starter_47eur
STRIPE_PRICE_PRO=price_1234_pro_97eur
STRIPE_PRICE_PREMIUM=price_1234_premium_197eur
STRIPE_PRICE_ENTERPRISE=price_1234_enterprise_497eur
```

### 5.2. Criar Produtos Stripe

```bash
# Acesse: https://dashboard.stripe.com
# Products → Add Product

# Criar 4 produtos:
1. Starter - 47 EUR/mês recorrente
2. Pro - 97 EUR/mês recorrente
3. Premium - 197 EUR/mês recorrente
4. Enterprise - 497 EUR/mês recorrente

# Copiar Price IDs para .env
```

---

## 🧪 Passo 6: Testes

### Teste 1: Voucher ✅

```
1. Fazer logout (se logado)
2. Fazer login com Google
3. Modal de voucher deve aparecer
4. Digite: LUXAI-LAUNCH-3M-2025
5. Clicar "Ativar Voucher"
6. ✅ Deve mostrar: "3 meses de Premium grátis!"
7. ✅ Badge no header: "Premium"
8. ✅ Todos os módulos desbloqueados
```

### Teste 2: OAuth Gemini ✅

```
1. No dashboard, ver card "IA Gemini"
2. Clicar "Conectar Google"
3. Popup Google OAuth abre
4. Autorizar acesso
5. ✅ Status muda para "✓ IA Ativo"
6. Testar busca de imóveis
7. ✅ Deve funcionar usando SUA cota Gemini
```

### Teste 3: Expiração de Assinatura ✅

```
# Forçar expiração (via SQL):
UPDATE profiles 
SET subscription_end_date = NOW() - INTERVAL '1 day'
WHERE id = 'seu-user-id';

1. Refresh página
2. ✅ Deve mostrar modal "Assinatura Expirada"
3. ✅ Oferecer planos para upgrade
4. ✅ Opção "Continuar com Free"
5. Se escolher Free:
   - ✅ Badge muda para "Free"
   - ✅ Módulos Premium bloqueados
```

### Teste 4: Limites de Features ✅

```
# No plano FREE:
1. Tentar usar IA Coach
2. ✅ Deve bloquear: "Não disponível no plano Free"
3. ✅ Oferecer upgrade

# No plano STARTER (após upgrade):
1. Usar IA Coach 50x
2. Na 51ª tentativa:
3. ✅ Deve bloquear: "Limite mensal atingido"
4. ✅ Oferecer upgrade para PRO
```

### Teste 5: Pricing Cards ✅

```
1. Abrir módulo "Assinatura Premium"
2. ✅ Deve mostrar 5 cards (Free, Starter, Pro, Premium, Enterprise)
3. ✅ Card PRO tem badge "MAIS POPULAR"
4. ✅ Hover nos cards: animação e destaque
5. Clicar em qualquer plano pago
6. ✅ Redireciona para Stripe checkout
```

---

## 🐛 Debugging Comum

### Erro: "Voucher inválido"

**Causa:** Código digitado errado ou já usado

**Solução:**
```sql
-- Verificar voucher no DB
SELECT voucher_code, voucher_used 
FROM profiles 
WHERE id = 'seu-user-id';

-- Resetar (apenas teste):
UPDATE profiles 
SET voucher_used = false, voucher_code = null
WHERE id = 'seu-user-id';
```

### Erro: "Gemini OAuth não conectado"

**Causa:** Token não salvo ou expirado

**Solução:**
```sql
-- Verificar token
SELECT * FROM user_oauth_tokens 
WHERE user_id = 'seu-user-id';

-- Deletar (forçar reconexão):
DELETE FROM user_oauth_tokens 
WHERE user_id = 'seu-user-id';
```

### Erro: "Feature não disponível no seu plano"

**Causa:** Plano incorreto no DB

**Solução:**
```sql
-- Verificar plano atual
SELECT subscription_plan, subscription_end_date 
FROM profiles 
WHERE id = 'seu-user-id';

-- Atualizar manualmente (teste):
UPDATE profiles 
SET subscription_plan = 'premium',
    subscription_end_date = NOW() + INTERVAL '30 days'
WHERE id = 'seu-user-id';
```

---

## 📊 Monitoramento

### Query: Estatísticas de Assinaturas

```sql
SELECT * FROM subscription_stats;

-- Retorna:
-- subscription_plan | total_users | voucher_users | active_paid | avg_days_subscribed
-- free              | 150         | 0             | 0           | 0
-- premium           | 25          | 20            | 5           | 45
```

### Query: Uso de Features

```sql
SELECT 
    p.full_name,
    p.subscription_plan,
    u.ai_coach_messages,
    u.ai_pricing_requests,
    u.virtual_staging_requests
FROM profiles p
LEFT JOIN subscription_usage u ON p.id = u.user_id
WHERE u.month_year = TO_CHAR(NOW(), 'YYYY-MM')
ORDER BY u.ai_coach_messages DESC;
```

### Query: Vouchers Usados

```sql
SELECT 
    full_name,
    email,
    voucher_code,
    voucher_activated_at,
    subscription_end_date
FROM profiles
WHERE voucher_used = true
ORDER BY voucher_activated_at DESC;
```

---

## ✅ Checklist Final

Antes de fazer deploy em produção:

**Banco de Dados:**
- [ ] Schema SQL executado
- [ ] Tabelas criadas: user_oauth_tokens, subscription_usage, subscription_plans
- [ ] Colunas adicionadas: subscription_plan, voucher_code, voucher_used
- [ ] Funções criadas: validate_voucher, check_subscription_expiry
- [ ] Trigger criado: auto_check_expiry

**Frontend:**
- [ ] CONFIG atualizado com PLANS
- [ ] Funções novas adicionadas ao app.js
- [ ] handleAuthSuccess() substituído
- [ ] Objeto app atualizado
- [ ] CSS pricing adicionado ao index.html
- [ ] Plan badge adicionado ao header
- [ ] Gemini status card adicionado ao dashboard

**Edge Functions:**
- [ ] oauth-exchange criada e deployed
- [ ] ai-search atualizada (usa OAuth token)
- [ ] ai-coaching atualizada
- [ ] ai-assistant atualizada
- [ ] ai-idealista atualizada

**Configuração:**
- [ ] .env atualizado (CLIENT_SECRET, ENCRYPTION_KEY)
- [ ] Stripe produtos criados (4 planos)
- [ ] Stripe Price IDs copiados para .env
- [ ] Google OAuth scopes configurados

**Testes:**
- [ ] Voucher funciona (ativa 3 meses Premium)
- [ ] OAuth Gemini funciona (conecta Google)
- [ ] Expiração funciona (downgrade para Free)
- [ ] Limites de features funcionam
- [ ] Pricing cards aparecem corretamente
- [ ] Stripe checkout funciona

---

## 🚀 Deploy

Depois de testar localmente:

```bash
# 1. Commit mudanças
git add .
git commit -m "feat: sistema de preços + voucher + OAuth Gemini"

# 2. Deploy Edge Functions
supabase functions deploy oauth-exchange
supabase functions deploy ai-search
supabase functions deploy ai-coaching
supabase functions deploy ai-assistant
supabase functions deploy ai-idealista

# 3. Deploy frontend
netlify deploy --prod
# ou
vercel --prod

# 4. Verificar variáveis ambiente em produção
# Netlify: Site Settings → Environment Variables
# Vercel: Project Settings → Environment Variables
```

---

## 📞 Suporte

Problemas com a integração?

- 📖 Reveja este guia passo-a-passo
- 💻 Verifique todos os snippets foram copiados
- 🐛 Use debugging queries SQL
- 📧 Email: dev@luxeagent.pt

---

**✨ Sistema de Preços + Voucher + OAuth Gemini implementado com sucesso!**

**Principais benefícios:**
- 💰 5 planos de preços (Free a Enterprise)
- 🎫 Voucher de 3 meses Premium grátis
- 🔐 OAuth Gemini = custo $0 em IA
- 📊 Controle total de limites e uso
- 🚀 Escalável e pronto para produção
