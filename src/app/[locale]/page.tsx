import { getTranslations, setRequestLocale } from 'next-intl/server';
import { challenge, house, hoursRows, menu } from '@/content/house';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const lang = locale as Locale;
  const picks = [
    menu[0].items[0],
    menu[0].items[1],
    menu[1].items[1],
    menu[2].items[0],
    menu[2].items[2],
    menu[3].items[0],
  ];

  return (
    <>
      <div className="awning" />
      <section className="relative isolate bg-chrome text-white">
        <div className="mx-auto grid max-w-[1280px] md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-14 md:px-10 md:py-20">
            <p className="text-[0.78rem] font-extrabold tracking-[0.22em] text-gold uppercase">{t('kicker')}</p>
            <h1 className="mt-3 text-5xl font-extrabold leading-[0.9] md:text-7xl">{t('title')}</h1>
            <p className="mt-6 max-w-md text-lg text-white/85">{t('lead')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={house.phoneHref} className="btn btn-red text-xl">
                {t('ctaCall')}
              </a>
              <Link href="/menu" className="btn btn-ghost border-white text-white">
                {t('ctaMenu')}
              </Link>
            </div>
          </div>
          <div className="relative min-h-[22rem] overflow-hidden md:min-h-[28rem]">
            <img src={house.hero} alt={t('heroAlt')} className="absolute inset-0 h-full w-full object-cover object-center" />
          </div>
        </div>
      </section>

      <section className="border-b-4 border-red bg-cream">
        <div className="mx-auto max-w-[1280px] px-6 py-12">
          <h2 className="text-4xl font-extrabold text-red">{t('hoursTitle')}</h2>
          <p className="mt-3 max-w-2xl text-muted">{t('hoursLead')}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {hoursRows.map((row) => (
              <li key={row.day.en} className="border-2 border-ink px-3 py-2 text-sm font-extrabold uppercase">
                {row.day[lang]} · {row.hours[lang]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-16">
        <h2 className="text-5xl font-extrabold">{t('menuTitle')}</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">{t('menuLead')}</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((item) => (
            <li key={item.id} className="border-4 border-ink bg-cream p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-extrabold normal-case tracking-normal">{item.title[lang]}</h3>
                <span className="shrink-0 font-extrabold text-red">{item.price}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{item.body[lang]}</p>
            </li>
          ))}
        </ul>
        <Link href="/menu" className="mt-8 inline-block text-sm font-extrabold uppercase">
          {t('menuMore')} →
        </Link>
      </section>

      <section className="border-y-4 border-red bg-red text-white">
        <div className="mx-auto grid max-w-[1280px] items-center gap-8 px-6 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-extrabold">{t('challengeTitle')}</h2>
            <p className="mt-4 text-white/90">{t('challengeLead')}</p>
            <p className="mt-3 font-extrabold">{challenge.price}</p>
            <Link href="/specials" className="btn btn-chrome mt-6">
              {t('challengeCta')}
            </Link>
          </div>
          <div className="relative min-h-[16rem] overflow-hidden border-4 border-cream">
            <img src={house.challenge} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
