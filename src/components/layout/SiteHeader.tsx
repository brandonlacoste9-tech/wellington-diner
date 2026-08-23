'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { house } from '@/content/house';
import { Link, usePathname } from '@/i18n/navigation';

const navItems = [
  { href: '/menu', key: 'menu' },
  { href: '/specials', key: 'specials' },
  { href: '/hours', key: 'hours' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={open ? 'sticky top-0 z-[70]' : 'sticky top-0 z-30'}>
      <div className="bg-red text-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[0.78rem] font-extrabold tracking-[0.08em] uppercase md:px-6">
          <span>{t('strip')}</span>
          <a href={house.phoneHref} className="underline-offset-2 hover:underline">
            {house.phone}
          </a>
        </div>
      </div>
      <header className="border-b-4 border-red bg-cream">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-50 focus:bg-red focus:px-3 focus:py-2 focus:text-white"
        >
          {t('skip')}
        </a>
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 md:px-6">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">{t('menu')}</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className="block h-0.5 bg-ink" />
              <span className="block h-0.5 bg-ink" />
              <span className="block h-0.5 bg-ink" />
            </span>
          </button>

          <Link href="/" className="min-w-0 flex-1 md:flex-none">
            <img src={house.logo} alt={house.name} width={220} height={80} className="h-12 w-auto object-contain md:h-14" />
          </Link>

          <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-x-5 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? 'text-[0.72rem] font-extrabold tracking-[0.14em] text-red uppercase'
                    : 'text-[0.72rem] font-extrabold tracking-[0.14em] text-ink/70 uppercase hover:text-red'
                }
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-3 md:gap-5">
            <a href={house.phoneHref} className="btn btn-red hidden py-2 sm:inline-flex">
              {t('call')}
            </a>
            <div className="hidden md:block">
              <LocaleSwitch tone="light" />
            </div>
          </div>
        </div>

        {open ? (
          <div
            id="mobile-nav"
            className="fixed inset-0 z-[60] flex flex-col bg-cream text-ink md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('menu')}
          >
            <div className="flex items-center justify-between border-b-2 border-red px-4 py-3">
              <img src={house.logo} alt="" width={180} height={60} className="h-10 w-auto object-contain" />
              <button type="button" className="h-11 px-2 text-sm font-extrabold uppercase" onClick={() => setOpen(false)}>
                {t('close')}
              </button>
            </div>
            <nav className="flex flex-1 flex-col px-6 pt-8" aria-label="Primary">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-line py-4 font-heading text-4xl font-extrabold">
                  {t(item.key)}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between gap-4 px-6 py-6">
              <a href={house.phoneHref} className="btn btn-red">
                {house.phone}
              </a>
              <LocaleSwitch tone="light" />
            </div>
          </div>
        ) : null}
      </header>
    </div>
  );
}
