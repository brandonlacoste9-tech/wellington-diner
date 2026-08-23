'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const locales = [
  { id: 'en', label: 'EN' },
  { id: 'fr', label: 'FR' },
] as const;

export function LocaleSwitch({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const locale = useLocale();
  const pathname = usePathname();
  const on = tone === 'light' ? 'text-red' : 'text-gold';
  const off = tone === 'light' ? 'text-muted hover:text-ink' : 'text-white/50 hover:text-white';

  return (
    <nav aria-label="Language" className="flex items-center gap-3">
      {locales.map((item) => (
        <Link
          key={item.id}
          href={pathname}
          locale={item.id}
          className={`text-[0.72rem] font-extrabold tracking-[0.16em] uppercase ${item.id === locale ? on : off}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
