import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { house, menu } from '@/content/house';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'menu' });
  return { title: t('title') };
}

export default async function MenuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('menu');
  const lang = locale as Locale;

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16 md:py-20">
      <p className="text-[0.72rem] font-extrabold tracking-[0.22em] text-muted uppercase">{t('kicker')}</p>
      <h1 className="mt-2 text-6xl font-extrabold md:text-8xl">{t('title')}.</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{t('lead')}</p>
      {menu.map((section) => (
        <div key={section.id} id={section.id} className="mt-14">
          <h2 className="border-b-4 border-red pb-2 text-3xl font-extrabold">{section.title[lang]}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <li key={item.id} className="border-2 border-ink p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-extrabold normal-case tracking-normal">{item.title[lang]}</h3>
                  <span className="font-extrabold text-red">{item.price}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{item.body[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="mt-10 text-sm text-muted">{t('note')}</p>
      <a href={house.phoneHref} className="btn btn-red mt-8">
        {house.phone}
      </a>
    </div>
  );
}
