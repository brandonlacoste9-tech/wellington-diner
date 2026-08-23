import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { challenge, house, specials } from '@/content/house';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'specials' });
  return { title: t('title') };
}

export default async function SpecialsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('specials');
  const lang = locale as Locale;

  return (
    <div className="mx-auto max-w-[860px] px-6 py-16 md:py-20">
      <p className="text-[0.72rem] font-extrabold tracking-[0.22em] text-muted uppercase">{t('kicker')}</p>
      <h1 className="mt-2 text-6xl font-extrabold md:text-8xl">{t('title')}.</h1>
      <p className="mt-6 text-lg text-muted">{t('lead')}</p>
      <ul className="mt-10 grid gap-4">
        {specials.map((item) => (
          <li key={item.id} className="border-4 border-ink p-5">
            <h2 className="text-2xl font-extrabold">{item.title[lang]}</h2>
            <p className="mt-2 text-muted">{item.body[lang]}</p>
          </li>
        ))}
      </ul>
      <article className="mt-10 border-4 border-red bg-red p-6 text-white">
        <h2 className="text-3xl font-extrabold">{t('challengeTitle')}</h2>
        <p className="mt-3">{challenge.body[lang]}</p>
        <p className="mt-3 font-extrabold">{challenge.price}</p>
        <p className="mt-2 text-sm text-white/80">{t('challengeCaption')}</p>
        <a href={house.challengeVideo} className="btn btn-chrome mt-6" target="_blank" rel="noreferrer">
          {t('challengeWatch')}
        </a>
        <a href={house.challengeVideo} className="mt-3 block break-all text-sm text-white underline" target="_blank" rel="noreferrer">
          {house.challengeVideo}
        </a>
      </article>
      <a href={house.challengeVideo} target="_blank" rel="noreferrer" className="relative mt-8 block min-h-[16rem] overflow-hidden border-4 border-ink">
        <img src={house.challenge} alt={t('challengeAlt')} className="absolute inset-0 h-full w-full object-cover object-center" />
      </a>
      <a href={house.phoneHref} className="btn btn-red mt-10">
        {house.phone}
      </a>
    </div>
  );
}
