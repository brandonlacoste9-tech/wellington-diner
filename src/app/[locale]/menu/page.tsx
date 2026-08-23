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
      <nav aria-label={t('jump')} className="mt-8 flex flex-wrap gap-2">
        {menu.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="border-2 border-ink bg-cream px-3 py-1.5 text-[0.72rem] font-extrabold tracking-[0.08em] uppercase"
          >
            {section.title[lang]}
          </a>
        ))}
      </nav>
      {menu.map((section) => (
        <div key={section.id} id={section.id} className="mt-14 scroll-mt-28">
          <h2 className="border-b-4 border-red pb-2 text-3xl font-extrabold">{section.title[lang]}</h2>
          {'note' in section && section.note ? (
            <p className="mt-3 max-w-3xl text-sm text-muted">{section.note[lang]}</p>
          ) : null}
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <li key={item.id} className="border-2 border-ink p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-extrabold normal-case tracking-normal">{item.title[lang]}</h3>
                  {item.price ? <span className="shrink-0 font-extrabold text-red">{item.price}</span> : null}
                </div>
                {item.body[lang] ? <p className="mt-2 text-sm text-muted">{item.body[lang]}</p> : null}
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
