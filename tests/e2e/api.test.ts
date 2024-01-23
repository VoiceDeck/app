import { test, expect } from '@playwright/test';

test('reports', async ({ request }) => {
  const reports = await request.get('/impact-reports');

  expect(reports.ok()).toBeTruthy();
  expect(await reports.json()).toContainEqual(expect.objectContaining({
    id: expect.any(String),
    title: expect.any(String),
    description: expect.any(String),
  }))
});
