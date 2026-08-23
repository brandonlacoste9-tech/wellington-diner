import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { house, hoursRows } from '@/content/house';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hours' });
  return { title: t('title') };
}

export default async function HoursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('hours');
  const lang = locale as Locale;

  return (
    <div className="mx-auto max-w-[760px] px-6 py-16 md:py-20">
      <p className="text-[0.72rem] font-extrabold tracking-[0.22em] text-muted uppercase">{t('kicker')}</p>
      <h1 className="mt-2 text-6xl font-extrabold md:text-8xl">{t('title')}.</h1>
      <p className="mt-6 text-lg text-muted">{t('lead')}</p>
      <ul className="mt-8 border-4 border-ink">
        {hoursRows.map((row) => (
          <li key={row.day.en} className="flex justify-between gap-4 border-b-2 border-ink px-4 py-3 last:border-b-0">
            <span className="font-extrabold uppercase">{row.day[lang]}</span>
            <span>{row.hours[lang]}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">{t('schema')}</p>
      <p className="mt-3 text-sm text-muted">{t('delivery')}</p>
      <p className="mt-3 font-extrabold">{t('book')}</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href={house.phoneHref} className="btn btn-red">
          {house.phone}
        </a>
        <a href={house.doordash} className="btn btn-chrome" target="_blank" rel="noreferrer">
          {t('orderDash')}
        </a>
      </div>
    </div>
  );
}
