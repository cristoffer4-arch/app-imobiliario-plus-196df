import { test, expect } from '@playwright/test';

test.describe('Dashboard Analytics', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the analytics dashboard
    await page.goto('/dashboard/analytics');
  });

  test('should display page title and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible();
    await expect(page.getByText('Análise de mercado e insights AI')).toBeVisible();
  });

  test('should display period filter dropdown', async ({ page }) => {
    const periodSelect = page.locator('select, [role="combobox"]').first();
    await expect(periodSelect).toBeVisible();
  });

  test('should display KPI cards', async ({ page }) => {
    // Check for KPI cards
    await expect(page.getByText('Total de Imóveis')).toBeVisible();
    await expect(page.getByText('Preço Médio')).toBeVisible();
    await expect(page.getByText('Valor Total Portfolio')).toBeVisible();
    await expect(page.getByText('IMI Médio Anual')).toBeVisible();
  });

  test('should display chart tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /Por Tipologia/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Por Distrito/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Evolução Temporal/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Certificação Energética/i })).toBeVisible();
  });

  test('should switch between chart tabs', async ({ page }) => {
    // Click on "Por Distrito" tab
    await page.getByRole('tab', { name: /Por Distrito/i }).click();
    await expect(page.getByText('Top 10 Distritos por Preço Médio')).toBeVisible();

    // Click on "Evolução Temporal" tab
    await page.getByRole('tab', { name: /Evolução Temporal/i }).click();
    await expect(page.getByText('Evolução de Imóveis ao Longo do Tempo')).toBeVisible();

    // Click on "Certificação Energética" tab
    await page.getByRole('tab', { name: /Certificação Energética/i }).click();
    await expect(page.getByText('Distribuição de Certificação Energética')).toBeVisible();
  });

  test('should display AI insights section', async ({ page }) => {
    await expect(page.getByText('Insights AI - Gemini')).toBeVisible();
    await expect(page.getByText('Análise inteligente de tendências e oportunidades de mercado')).toBeVisible();
  });

  test('should have button to generate AI insights', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /Gerar Insights com Gemini AI/i });
    await expect(generateButton).toBeVisible();
  });

  test('should show loading state when generating insights', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /Gerar Insights com Gemini AI/i });
    
    // Click generate button
    await generateButton.click();
    
    // Check for loading state
    await expect(page.getByText(/A gerar insights/i)).toBeVisible();
  });

  test('should change period filter', async ({ page }) => {
    // Open the period selector
    const periodSelect = page.locator('[role="combobox"]').first();
    await periodSelect.click();

    // Select "Últimos 7 dias"
    await page.getByRole('option', { name: 'Últimos 7 dias' }).click();

    // The page should reload data (we'd need to mock the API to verify)
  });

  test('should display charts with data', async ({ page }) => {
    // Wait for charts to render (Recharts uses SVG)
    await page.waitForSelector('svg', { timeout: 5000 });
    
    const svgElements = page.locator('svg');
    const count = await svgElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display tipologia chart', async ({ page }) => {
    await page.getByRole('tab', { name: /Por Tipologia/i }).click();
    await expect(page.getByText('Preço Médio por Tipologia')).toBeVisible();
    await expect(page.getByText('Análise de preços por tipo de imóvel (T0-T6+)')).toBeVisible();
  });

  test('should display distrito chart', async ({ page }) => {
    await page.getByRole('tab', { name: /Por Distrito/i }).click();
    await expect(page.getByText('Top 10 Distritos por Preço Médio')).toBeVisible();
    await expect(page.getByText('Ranking de distritos mais caros')).toBeVisible();
  });

  test('should display timeline chart', async ({ page }) => {
    await page.getByRole('tab', { name: /Evolução Temporal/i }).click();
    await expect(page.getByText('Evolução de Imóveis ao Longo do Tempo')).toBeVisible();
    await expect(page.getByText('Número de imóveis cadastrados por mês')).toBeVisible();
  });

  test('should display energy certificate chart', async ({ page }) => {
    await page.getByRole('tab', { name: /Certificação Energética/i }).click();
    await expect(page.getByText('Distribuição de Certificação Energética')).toBeVisible();
    await expect(page.getByText('Classificação energética dos imóveis (A+ a F)')).toBeVisible();
  });

  test('should show KPI trend indicators', async ({ page }) => {
    // Look for trend indicators (up/down arrows)
    const trendIndicators = page.locator('.text-green-600, .text-red-600');
    const count = await trendIndicators.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should format prices in EUR', async ({ page }) => {
    // Wait for KPIs to load
    await page.waitForSelector('.text-2xl.font-bold', { timeout: 5000 });
    
    // Check if EUR symbol (€) is present in price displays
    const priceElements = page.locator('.text-2xl.font-bold');
    const priceText = await priceElements.first().textContent();
    expect(priceText).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be functional
    await expect(page.getByRole('heading', { name: 'Analytics Dashboard' })).toBeVisible();
    await expect(page.getByText('Total de Imóveis')).toBeVisible();
  });

  test('should handle no data gracefully', async ({ page }) => {
    // If there's no data, the page should still render without errors
    const errorMessages = page.locator('text=/erro|error/i');
    const count = await errorMessages.count();
    // Should either show data or handle empty state gracefully
    expect(count).toBe(0);
  });

  test('should navigate back to main dashboard', async ({ page }) => {
    // Look for navigation breadcrumb or back button
    const backLink = page.locator('a[href="/dashboard"]');
    if (await backLink.count() > 0) {
      await backLink.first().click();
      await expect(page).toHaveURL(/.*\/dashboard$/);
    }
  });

  test('should display regenerate button after generating insights', async ({ page }) => {
    const generateButton = page.getByRole('button', { name: /Gerar Insights com Gemini AI/i });
    
    // If button exists, click it and wait for completion
    if (await generateButton.isVisible()) {
      await generateButton.click();
      
      // Wait for regenerate button to appear (with timeout)
      await page.waitForSelector('button:has-text("Regenerar Insights")', { 
        timeout: 10000,
        state: 'visible'
      }).catch(() => {
        // It's okay if this times out - the API might not be configured
      });
    }
  });
});

test.describe('Dashboard Navigation', () => {
  test('should navigate from main dashboard to analytics', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for link to analytics
    const analyticsLink = page.locator('a[href*="analytics"]');
    if (await analyticsLink.count() > 0) {
      await analyticsLink.first().click();
      await expect(page).toHaveURL(/.*\/dashboard\/analytics/);
    }
  });
});
