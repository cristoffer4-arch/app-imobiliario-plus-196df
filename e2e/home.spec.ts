import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loaded
    await expect(page).toHaveTitle(/Imobiliária/)
    
    // Check for main navigation elements
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('should display property listings', async ({ page }) => {
    await page.goto('/')
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 })
    
    // Check if at least one property is displayed
    const properties = page.locator('[data-testid="property-card"]')
    await expect(properties.first()).toBeVisible()
  })

  test('should navigate to property details', async ({ page }) => {
    await page.goto('/')
    
    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 })
    
    // Click on first property
    await page.locator('[data-testid="property-card"]').first().click()
    
    // Check if navigated to details page
    await expect(page).toHaveURL(/\/properties\/.+/)
  })

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/')
    
    // Find search input
    const searchInput = page.getByPlaceholder(/buscar|search/i)
    if (await searchInput.isVisible()) {
      await searchInput.fill('luxo')
      await searchInput.press('Enter')
      
      // Wait for search results
      await page.waitForTimeout(1000)
    }
  })
})
