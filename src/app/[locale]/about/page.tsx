import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { house, shop } from '@/content/house';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title') };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const lang = locale as Locale;

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 md:py-20">
      <p className="text-[0.72rem] font-extrabold tracking-[0.22em] text-muted uppercase">{t('kicker')}</p>
      <h1 className="mt-2 text-6xl font-extrabold md:text-8xl">{t('title')}.</h1>
      <p className="mt-6 text-lg text-muted">{t('lead')}</p>
      <p className="mt-6">{t('blend')}</p>
      <p className="mt-6">{t('address')}</p>
      <p className="mt-4 text-sm text-muted">{t('windows')}</p>
      <p className="mt-3 text-sm">
        {shop.lines[lang].map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        <span className="block">{shop.postal}</span>
      </p>
      <p className="mt-6">{t('challenge')}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="relative min-h-[14rem] overflow-hidden border-4 border-ink">
          <img src={house.storefront} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative min-h-[14rem] overflow-hidden border-4 border-ink">
          <img src={house.plates} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href={house.phoneHref} className="btn btn-red">
          {house.phone}
        </a>
        <Link href="/menu" className="btn btn-ghost">
          Menu
        </Link>
      </div>
    </div>
  );
}
