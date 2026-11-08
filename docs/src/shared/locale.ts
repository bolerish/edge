import { m } from '../paraglide/messages.js';
import { getLocale, locales, type Locale } from '../paraglide/runtime.js';
export { locales, type Locale };

export function localeFromPath(path: string): Locale {
  const segment = path.split('/')[1];
  return locales.find((locale) => locale !== 'en' && locale === segment) ?? 'en';
}

export function basePath(path: string) {
  const locale = localeFromPath(path);
  return locale === 'en' ? path : path.slice(locale.length + 1) || '/';
}

export function localePath(path: string, locale: Locale = getLocale()) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const base = basePath(path);
  return locale === 'en' ? base : `/${locale}${base}`;
}

export function sectionLabel(section: string) {
  switch (section) {
    case 'Getting started':
      return m.getting_started();
    case 'Styles':
      return m.styles_group();
    case 'Guides':
      return m.guides();
    case 'All':
      return m.all();
    default:
      return section;
  }
}
