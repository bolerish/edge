import * as stylex from '@stylexjs/stylex';
import { Button } from '@bolerish/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@bolerish/ui/dropdown-menu';
import { TranslateIcon } from '@phosphor-icons/react/Translate';
import { CaretDownIcon } from '@phosphor-icons/react/CaretDown';
import { getLocale } from '../paraglide/runtime.js';
import { m } from '../paraglide/messages.js';
import { locales, localePath, type Locale } from './locale.js';

const names: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  es: 'Español',
  zh: '简体中文',
  ja: '日本語',
};
export function LanguageMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" xstyle={styles.trigger} aria-label={m.language()}>
            <TranslateIcon size={20} aria-hidden="true" />
            <CaretDownIcon size={12} aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={getLocale()}
          onValueChange={(value) => {
            const locale = locales.find((locale) => locale === value);
            if (locale)
              location.assign(
                localePath(location.pathname, locale) + location.search + location.hash,
              );
          }}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem
              key={locale}
              value={locale}
              lang={locale === 'zh' ? 'zh-Hans' : locale}
            >
              {names[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const styles = stylex.create({ trigger: { width: 48, minWidth: 48 } });
