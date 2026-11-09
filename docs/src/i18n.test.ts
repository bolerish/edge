import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test('localized home loads its fonts and keeps the dashboard inside the viewport', async ({
  page,
}) => {
  for (const [locale, family, sample] of [
    ['en', 'LINE Seed EN', 'Edge'],
    ['ko', 'LINE Seed KR', '조명'],
    ['es', 'Edge Latin Supplement', 'ñá'],
    ['ja', 'LINE Seed JP', '照明'],
    ['zh', 'LINE Seed EN', 'Edge'],
  ]) {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(locale === 'en' ? '/' : `/${locale}/`);
    const fonts = await page.evaluate(
      async ({ family, sample }) => {
        const loaded = await document.fonts.load(`16px "${family}"`, sample);
        await document.fonts.ready;
        return loaded.map((font) => font.status);
      },
      { family, sample },
    );
    expect(fonts).toEqual(['loaded']);
    await expect(page.locator('#dashboard-title')).toBeVisible();
    await expect(page.getByRole('link', { name: 'bolerish/ui', exact: true })).toHaveAttribute(
      'href',
      'https://ui.bolerish.com',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

const languages = [
  {
    code: 'en',
    name: 'English',
    introduction: 'Introduction',
    installation: 'Installation',
    search: 'Search documentation',
    language: 'Language',
  },
  {
    code: 'ko',
    name: '한국어',
    introduction: '소개',
    installation: '설치',
    search: '문서 검색',
    language: '언어 선택',
  },
  {
    code: 'es',
    name: 'Español',
    introduction: 'Introducción',
    installation: 'Instalación',
    search: 'Buscar documentación',
    language: 'Idioma',
  },
  {
    code: 'zh',
    name: '简体中文',
    introduction: '简介',
    installation: '安装',
    search: '搜索文档',
    language: '语言',
  },
  {
    code: 'ja',
    name: '日本語',
    introduction: 'はじめに',
    installation: 'インストール',
    search: 'ドキュメントを検索',
    language: '言語',
  },
];
for (const language of languages) {
  const prefix = language.code === 'en' ? '' : `/${language.code}`;
  test(`${language.code}: prerendered content, metadata, local links and search`, async ({
    browser,
    page,
    request,
  }) => {
    const response = await request.get(`${prefix}/docs/installation/`);
    const html = await response.text();
    expect(html).toContain(`lang="${language.code === 'zh' ? 'zh-Hans' : language.code}"`);
    expect(html).toContain(
      `rel="canonical" href="https://edge.bolerish.com${prefix}/docs/installation/"`,
    );
    expect(html).toContain(`${prefix}/docs/installation/index.md`);
    expect((await request.get(`${prefix}/docs/installation/index.md`)).ok()).toBe(true);
    const staticContext = await browser.newContext({ javaScriptEnabled: false });
    try {
      const staticPage = await staticContext.newPage();
      await staticPage.goto(`${prefix}/docs/`);
      await expect(staticPage.getByRole('heading', { level: 1 })).toHaveText(language.introduction);
      await expect(staticPage.locator('.sidebar')).toBeVisible();
    } finally {
      await staticContext.close();
    }
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${prefix}/docs/`);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(language.introduction);
    await page
      .locator('.sidebar')
      .getByRole('link', { name: language.installation, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${prefix}/docs/installation/$`));
    await page.getByRole('button', { name: language.search, exact: true }).click();
    await page.getByRole('dialog').getByRole('textbox').fill(language.installation);
    await expect(page.locator('.search-results a').first()).toHaveAttribute(
      'href',
      new RegExp(`^${prefix}/docs/`),
    );
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    const accessibility = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('language menu preserves the current document and section', async ({ page }) => {
  await page.goto('/docs/installation/#stylesheet');
  for (const language of [...languages.slice(1), languages[0]!]) {
    await page.getByRole('button', { name: /^(Language|언어 선택|Idioma|语言|言語)$/ }).click();
    await Promise.all([
      page.waitForEvent('load'),
      page.getByRole('menuitemradio', { name: language.name, exact: true }).click(),
    ]);
    const prefix = language.code === 'en' ? '' : `/${language.code}`;
    await expect(page).toHaveURL(new RegExp(`${prefix}/docs/installation/#stylesheet$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(language.installation);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('translated navigation and language menu fit a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const language of languages) {
    const prefix = language.code === 'en' ? '' : `/${language.code}`;
    await page.goto(`${prefix}/docs/installation/`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: language.language, exact: true }).click();
    await expect(
      page.getByRole('menuitemradio', { name: language.name, exact: true }),
    ).toBeVisible();
    await page.keyboard.press('Escape');
  }
});

test('translated sentences keep native inline code in the language’s word order', async ({
  page,
}) => {
  const openings: readonly (readonly [string, string])[] = [
    ['/docs/react/usage/', 'Use as to choose'],
    ['/ko/docs/react/usage/', 'as로 렌더링할 HTML 태그를 선택하세요.'],
    ['/ja/docs/react/usage/', 'as でレンダリングする HTML タグを選びます。'],
    ['/es/docs/react/usage/', 'Elige la etiqueta HTML con as.'],
    ['/zh/docs/react/usage/', '通过 as 选择要渲染的 HTML 标签。'],
  ];
  for (const [path, opening] of openings) {
    await page.goto(path);
    const paragraph = page.locator('#keep-your-styles p').first();
    await expect(paragraph).toContainText(opening);
    await expect(paragraph.locator('code')).toHaveText(['as', 'className', 'style']);
    await expect(page.locator('.document')).not.toContainText(/<part\d+\/>/);
  }
});

test('languages use the English typography sizes and literal API control names', async ({
  page,
}) => {
  let english: string[] | undefined;
  for (const language of languages) {
    const prefix = language.code === 'en' ? '' : `/${language.code}`;
    await page.goto(`${prefix}/docs/motion/`);
    const sizes = await page.evaluate(() =>
      ['h1', '.document > p', '.document section p'].map((selector) => {
        const node = document.querySelector(selector);
        if (!node) throw new Error(`Missing typography sample: ${selector}`);
        return getComputedStyle(node).fontSize;
      }),
    );
    if (!english) english = sizes;
    expect(sizes).toEqual(english);
    await expect(page.getByRole('combobox', { name: 'motion', exact: true })).toHaveText('dynamic');
    await expect(page.getByRole('slider', { name: 'radius', exact: true })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'direction', exact: true })).toHaveText(
      'gather',
    );
  }
});
