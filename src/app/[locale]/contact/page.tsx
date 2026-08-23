import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { house, shop } from '@/content/house';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return { title: t('title') };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const lang = locale as Locale;

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 md:py-20">
      <p className="text-[0.72rem] font-extrabold tracking-[0.22em] text-muted uppercase">{t('kicker')}</p>
      <h1 className="mt-2 text-6xl font-extrabold md:text-8xl">{t('title')}.</h1>
      <p className="mt-6 text-lg text-muted">{t('lead')}</p>
      <article className="mt-10 border-4 border-ink p-6">
        <h2 className="text-3xl font-extrabold">{house.name}</h2>
        <p className="mt-3">
          {shop.lines[lang].map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">{shop.postal}</span>
        </p>
        <a href={house.phoneHref} className="mt-4 block text-2xl font-extrabold text-red">
          {house.phone}
        </a>
        <a href={house.emailHref} className="mt-1 block font-bold">
          {house.email}
        </a>
        <a href={shop.mapUrl} className="mt-3 inline-block text-sm font-extrabold uppercase">
          {t('map')}
        </a>
      </article>
      <p className="mt-8">{t('emailNote')}</p>
      <p className="mt-4 text-sm text-muted">{t('delivery')}</p>
      <a href={house.phoneHref} className="btn btn-red mt-10">
        {house.phone}
      </a>
    </div>
  );
}
