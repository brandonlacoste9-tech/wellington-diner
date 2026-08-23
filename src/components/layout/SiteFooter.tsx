import { getLocale, getTranslations } from 'next-intl/server';
import { SocialLinks } from '@/components/layout/SocialLinks';
import { house, shop } from '@/content/house';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const nav = await getTranslations('nav');
  const locale = (await getLocale()) as Locale;

  return (
    <footer className="mt-auto border-t-8 border-red bg-chrome pb-24 text-white">
      <div className="awning" />
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <img src={house.logo} alt="" width={200} height={70} className="h-12 w-auto bg-cream object-contain p-1" />
          <p className="mt-4 text-sm text-white/70">{t('line')}</p>
        </div>
        <address className="not-italic text-sm leading-relaxed text-white/85">
          {shop.lines[locale].map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">{shop.postal}</span>
          <a href={house.phoneHref} className="mt-2 block font-extrabold text-gold">
            {house.phone}
          </a>
          <a href={house.emailHref} className="mt-1 block text-gold">
            {house.email}
          </a>
        </address>
        <div className="flex flex-col gap-2 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase">
          <Link href="/menu">{nav('menu')}</Link>
          <Link href="/hours">{nav('hours')}</Link>
          <Link href="/contact">{nav('contact')}</Link>
          <div className="mt-4">
            <SocialLinks tone="cream" />
          </div>
        </div>
      </div>
      <p className="mx-auto max-w-[1280px] px-6 pb-6 text-xs text-white/50">{t('copy')}</p>
    </footer>
  );
}
