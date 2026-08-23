import { socials } from '@/content/house';

const icons = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.8A2 2 0 1 0 14 12a2 2 0 0 0-2-2Zm4.7-3.1a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M17.5 3h3.1l-6.8 7.8L22 21h-6.2l-4.8-6.3L5.6 21H2.4l7.3-8.3L2 3h6.3l4.4 5.8L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z" />
    </svg>
  ),
  doordash: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8 7V6a4 4 0 0 1 8 0v1h2.3l1.4 12.5H4.3L5.7 7H8Zm2 0h4V6a2 2 0 0 0-4 0v1Z" />
    </svg>
  ),
} as const;

type Props = {
  tone?: 'ink' | 'cream';
  compact?: boolean;
};

export function SocialLinks({ tone = 'ink', compact = false }: Props) {
  const chip =
    tone === 'cream'
      ? 'border-white/50 text-white hover:border-gold hover:text-gold'
      : 'border-ink text-ink hover:border-red hover:text-red';

  return (
    <ul className="flex flex-wrap items-center gap-2">
      {socials.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 border-2 px-3 py-2 text-[0.72rem] font-extrabold tracking-[0.12em] uppercase ${chip}`}
            aria-label={item.label}
          >
            {icons[item.id]}
            {compact ? <span className="sr-only">{item.label}</span> : item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
