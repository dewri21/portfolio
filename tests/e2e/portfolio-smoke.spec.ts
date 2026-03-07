import { expect, test } from '@playwright/test';

test('renders all major sections', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('section-hero')).toBeVisible();
  await expect(page.getByTestId('section-about')).toBeVisible();
  await expect(page.getByTestId('section-experience')).toBeVisible();
  await expect(page.getByTestId('section-projects')).toBeVisible();
  await expect(page.getByTestId('section-contact')).toBeVisible();
});

test('experience and projects react to tag filters', async ({ page }) => {
  await page.goto('/');

  const projectCards = page.getByTestId('project-card');
  const beforeCount = await projectCards.count();

  await page.getByTestId('tag-kafka').click();
  await expect(projectCards).toHaveCount(1);

  const timeline = page.getByTestId('timeline');
  await expect(timeline).toContainText(/kafka/i);

  await page.getByTestId('tag-all').click();
  await expect(projectCards).toHaveCount(beforeCount);
});

test('mobile viewport keeps hero and filters usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Automation Test Lead/i })).toBeVisible();
  await page.getByTestId('portfolio-search').fill('sql');
  await expect(page.getByTestId('timeline')).toContainText(/sql/i);
});
