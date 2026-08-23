import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Barlow_Condensed, Source_Sans_3 } from 'next/font/google';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AlertBar } from '@/components/layout/AlertBar';
import { CallBar } from '@/components/layout/CallBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { routing } from '@/i18n/routing';

const heading = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
});

const body = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: {
      default: t('site'),
      template: `%s · ${t('site')}`,
    },
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${heading.variable} ${body.variable}`}>
      <body className="relative flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="relative z-10 flex min-h-dvh flex-col">
            <SiteHeader />
            <AlertBar />
            <main id="content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <SiteFooter />
            <CallBar />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
