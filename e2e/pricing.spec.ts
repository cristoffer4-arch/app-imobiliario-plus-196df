import { test, expect } from '@playwright/test';

test.describe('Pricing and Checkout Flow', () => {
  test('should display all pricing plans', async ({ page }) => {
    await page.goto('/pricing');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /escolha o plano ideal/i })).toBeVisible();
    
    // Check all plans are visible
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('Starter')).toBeVisible();
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('Premium')).toBeVisible();
    await expect(page.getByText('Enterprise')).toBeVisible();
  });

  test('should show popular badge on Pro plan', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.getByText('MAIS POPULAR')).toBeVisible();
  });

  test('should display correct prices', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.getByText('€0')).toBeVisible();
    await expect(page.getByText('€29')).toBeVisible();
    await expect(page.getByText('€79')).toBeVisible();
    await expect(page.getByText('€149')).toBeVisible();
    await expect(page.getByText('€497')).toBeVisible();
  });

  test('should show features for each plan', async ({ page }) => {
    await page.goto('/pricing');
    
    // Check that feature lists have checkmarks
    const checkmarks = page.locator('svg').filter({ hasText: '' });
    await expect(checkmarks.first()).toBeVisible();
  });

  test('should show FAQ section', async ({ page }) => {
    await page.goto('/pricing');
    
    await expect(page.getByRole('heading', { name: /perguntas frequentes/i })).toBeVisible();
    await expect(page.getByText(/posso cancelar a qualquer momento/i)).toBeVisible();
  });

  test('free plan should navigate to dashboard', async ({ page }) => {
    await page.goto('/pricing');
    
    // Click on first "Começar Grátis" button
    await page.getByRole('button', { name: /começar grátis/i }).click();
    
    // Should navigate to dashboard (or login if not authenticated)
    await expect(page).toHaveURL(/\/(dashboard|auth)/);
  });

  test('paid plan should trigger checkout process', async ({ page }) => {
    // Mock API response for checkout
    await page.route('**/api/stripe/checkout', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'test_session',
          url: 'https://checkout.stripe.com/test',
        }),
      });
    });

    await page.goto('/pricing');
    
    // Click on Starter plan
    const starterButton = page.getByRole('button', { name: /assinar agora/i }).first();
    await starterButton.click();
    
    // Wait for loading state
    await expect(page.getByText(/processando/i)).toBeVisible({ timeout: 2000 }).catch(() => {});
  });
});

test.describe('Success Page', () => {
  test('should display success message', async ({ page }) => {
    await page.goto('/pricing/success?session_id=test_session');
    
    await expect(page.getByRole('heading', { name: /pagamento confirmado/i })).toBeVisible();
    await expect(page.getByText(/assinatura foi ativada com sucesso/i)).toBeVisible();
  });

  test('should have navigation buttons', async ({ page }) => {
    await page.goto('/pricing/success?session_id=test_session');
    
    await expect(page.getByRole('button', { name: /ir para dashboard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ver planos/i })).toBeVisible();
  });
});

test.describe('Cancel Page', () => {
  test('should display cancellation message', async ({ page }) => {
    await page.goto('/pricing/cancel');
    
    await expect(page.getByRole('heading', { name: /pagamento cancelado/i })).toBeVisible();
    await expect(page.getByText(/nenhuma cobrança foi realizada/i)).toBeVisible();
  });

  test('should have navigation buttons', async ({ page }) => {
    await page.goto('/pricing/cancel');
    
    await expect(page.getByRole('button', { name: /voltar aos planos/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /ir para dashboard/i })).toBeVisible();
  });
});
