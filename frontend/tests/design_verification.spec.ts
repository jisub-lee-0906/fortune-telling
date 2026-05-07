import { test, expect } from '@playwright/test';

test.setTimeout(90000);

test('Fortune Telling App - Visual Verification', async ({ page }) => {
  // 1. Landing Page (Intro)
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/운세 AI/);
  await page.screenshot({ path: 'screenshots/1-intro.png', fullPage: true });
  console.log('📸 Captured Intro');

  // 2. Click Start
  await page.getByText('내 운세 확인하기').click();
  
  // 3. Name Step
  await expect(page.getByText('성함이')).toBeVisible();
  await page.getByPlaceholder('홍길동').fill('테스트유저');
  await page.screenshot({ path: 'screenshots/2-name.png' });
  console.log('📸 Captured Name Input');

  // 4. Click Next
  await page.getByText('다음').click();

  // 5. Birth Step
  await expect(page.getByText('생년월일을')).toBeVisible();
  await page.getByPlaceholder('태어난 연도').fill('1999');
  await page.getByPlaceholder('월').fill('12');
  await page.getByPlaceholder('일').fill('31');
  await page.getByPlaceholder('태어난 시간').fill('14');
  await page.screenshot({ path: 'screenshots/3-birth.png' });
  console.log('📸 Captured Birth Input');

  // 6. Submit
  await page.getByText('운세 결과 보기').click();

  // 7. Loading State (Optional Check)
  // await expect(page.getByText('분석하고 있어요')).toBeVisible();

  // 8. Result Page
  // Wait for result to load (heavy computation)
  await expect(page.getByText('오행 분석')).toBeVisible({ timeout: 60000 });
  await page.screenshot({ path: 'screenshots/4-result.png', fullPage: true });
  console.log('📸 Captured Result');
});
