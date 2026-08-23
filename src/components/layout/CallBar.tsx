import { getTranslations } from 'next-intl/server';
import { house } from '@/content/house';

export async function CallBar() {
  const t = await getTranslations('callbar');

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-red bg-chrome text-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 md:px-6">
        <p className="min-w-0 truncate text-sm font-semibold">{t('line')}</p>
        <a href={house.phoneHref} className="btn btn-red shrink-0 py-2">
          {house.phone}
        </a>
      </div>
    </div>
  );
}
