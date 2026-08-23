import type { Locale } from '@/i18n/routing';

const ONES_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS_EN = [
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];
const TENS_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const ONES_FR = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
const TEENS_FR = [
  'dix',
  'onze',
  'douze',
  'treize',
  'quatorze',
  'quinze',
  'seize',
  'dix-sept',
  'dix-huit',
  'dix-neuf',
];
const TENS_FR = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

function under100(n: number, locale: Locale): string {
  if (locale === 'fr') {
    if (n < 10) return ONES_FR[n];
    if (n < 20) return TEENS_FR[n - 10];
    if (n === 71) return 'soixante-et-onze';
    if (n === 81) return 'quatre-vingt-un';
    if (n === 91) return 'quatre-vingt-onze';
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (t === 7 || t === 9) {
      const base = t === 7 ? 'soixante' : 'quatre-vingt';
      return o === 0 ? (t === 7 ? 'soixante-dix' : 'quatre-vingt-dix') : `${base}-${TEENS_FR[o]}`;
    }
    if (o === 0) return t === 8 ? 'quatre-vingts' : TENS_FR[t];
    if (o === 1 && t !== 8) return `${TENS_FR[t]}-et-un`;
    return `${TENS_FR[t]}-${ONES_FR[o]}`;
  }
  if (n < 10) return ONES_EN[n];
  if (n < 20) return TEENS_EN[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${TENS_EN[t]}-${ONES_EN[o]}` : TENS_EN[t];
}

function numToWords(n: number, locale: Locale): string {
  if (!Number.isFinite(n) || n < 0) return String(n);
  n = Math.round(n);
  if (n < 100) return under100(n, locale);
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    if (locale === 'fr') {
      const head = h === 1 ? 'cent' : `${ONES_FR[h]} cent${h > 1 && rest === 0 ? 's' : ''}`;
      return rest ? `${h === 1 ? 'cent' : `${ONES_FR[h]} cent`} ${under100(rest, locale)}` : head;
    }
    const head = h === 1 ? 'one hundred' : `${ONES_EN[h]} hundred`;
    return rest ? `${head} ${under100(rest, locale)}` : head;
  }
  if (n < 10000) {
    const th = Math.floor(n / 1000);
    const rest = n % 1000;
    if (locale === 'fr') {
      const head = th === 1 ? 'mille' : `${under100(th, locale)} mille`;
      return rest ? `${head} ${numToWords(rest, locale)}` : head;
    }
    // Street-style: 1385 → "thirteen eighty-five"
    if (th >= 10 && th < 20 && rest < 100) {
      return rest === 0 ? `${under100(th, locale)} hundred` : `${under100(th, locale)} ${under100(rest, locale)}`;
    }
    const head = th === 1 ? 'one thousand' : `${under100(th, locale)} thousand`;
    return rest ? `${head} ${numToWords(rest, locale)}` : head;
  }
  return String(n);
}

function money(dollars: number, cents: number, locale: Locale): string {
  if (dollars === 0 && cents === 0) return locale === 'fr' ? 'zéro dollar' : 'zero dollars';
  if (dollars === 0) {
    return locale === 'fr' ? `${numToWords(cents, locale)} cents` : `${numToWords(cents, locale)} cents`;
  }
  const d =
    locale === 'fr'
      ? dollars === 1
        ? 'un dollar'
        : `${numToWords(dollars, locale)} dollars`
      : dollars === 1
        ? 'one dollar'
        : `${numToWords(dollars, locale)} dollars`;
  if (cents === 0) return d;
  return locale === 'fr'
    ? `${d} et ${numToWords(cents, locale)} cents`
    : `${d} and ${numToWords(cents, locale)} cents`;
}

function digitLine(digits: string, locale: Locale) {
  return [...digits].map((d) => (locale === 'fr' ? ONES_FR[Number(d)] : ONES_EN[Number(d)])).join(' ');
}

function clock(hour: number, minute: number, mer: string | null, locale: Locale) {
  const h = numToWords(hour, locale);
  const isPm = Boolean(mer && /^p/.test(mer.toLowerCase()));
  const merPart = mer
    ? isPm
      ? hour === 12
        ? locale === 'fr'
          ? 'midi'
          : 'noon'
        : hour < 6
          ? locale === 'fr'
            ? 'de l’après-midi'
            : 'in the afternoon'
          : locale === 'fr'
            ? 'du soir'
            : 'in the evening'
      : hour === 12
        ? locale === 'fr'
          ? 'minuit'
          : 'midnight'
        : locale === 'fr'
          ? 'du matin'
          : 'in the morning'
    : '';
  if (minute === 0) return merPart ? `${h} ${merPart}` : locale === 'fr' ? `${h} heures` : `${h} o'clock`;
  const m = numToWords(minute, locale);
  return merPart ? `${h} ${m} ${merPart}` : locale === 'fr' ? `${h} heures ${m}` : `${h} ${m}`;
}

export function forSpeech(text: string, locale: Locale = 'en'): string {
  let out = text;

  out = out.replace(/https?:\/\/www\.youtube\.com\/watch\?v=wwTVFnJTOj4/gi, locale === 'fr' ? 'la vidéo YouTube Beard Meets Food du défi Mac Daddy' : 'the YouTube video of Beard Meets Food doing the Mac Daddy challenge');
  out = out.replace(/https?:\/\/\S+/gi, locale === 'fr' ? 'le lien à l’écran' : 'the link on the screen');
  out = out.replace(/\bDoorDash\b/gi, 'Door Dash');
  out = out.replace(/\bMac\s*'?\s*N\s*Cheese\b/gi, 'mac and cheese');
  out = out.replace(/\bWix\b/g, 'Wix');

  out = out.replace(/\(?(\d{3})\)[\s.-]*(\d{3})[\s.-]*(\d{4})/g, (_, a: string, b: string, c: string) =>
    locale === 'fr'
      ? `${digitLine(a, locale)}, ${digitLine(b, locale)}, ${digitLine(c, locale)}`
      : `${digitLine(a, locale)}, ${digitLine(b, locale)}, ${digitLine(c, locale)}`,
  );

  out = out.replace(/\$(\d+)\.(\d{2})/g, (_, d: string, c: string) => money(Number(d), Number(c), locale));
  out = out.replace(/\$(\d+)/g, (_, d: string) => money(Number(d), 0, locale));
  out = out.replace(/(\d+),(\d{2})\s*\$/g, (_, d: string, c: string) => money(Number(d), Number(c), locale));
  out = out.replace(/\+(\d+)\.(\d{2})/g, (_, d: string, c: string) =>
    locale === 'fr' ? `plus ${money(Number(d), Number(c), locale)}` : `plus ${money(Number(d), Number(c), locale)}`,
  );

  out = out.replace(/\b(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.|am|pm)\b/gi, (_, h: string, m: string, mer: string) =>
    clock(Number(h), Number(m), mer, locale),
  );
  out = out.replace(/\b(\d{1,2})\s*(a\.m\.|p\.m\.|am|pm)\b/gi, (_, h: string, mer: string) =>
    clock(Number(h), 0, mer, locale),
  );
  out = out.replace(/\b(\d{1,2})\s*h(?:eures)?\s*[–-]\s*(\d{1,2})\s*h(?:eures)?/gi, (_, a: string, b: string) =>
    locale === 'fr'
      ? `${numToWords(Number(a), locale)} heures à ${numToWords(Number(b), locale)} heures`
      : `${numToWords(Number(a), locale)} to ${numToWords(Number(b), locale)}`,
  );

  out = out.replace(/\b(\d+)\s*oz\b/gi, (_, n: string) =>
    locale === 'fr' ? `${numToWords(Number(n), locale)} onces` : `${numToWords(Number(n), locale)} ounce`,
  );
  out = out.replace(/\b(\d+)\s*%/g, (_, n: string) =>
    locale === 'fr' ? `${numToWords(Number(n), locale)} pour cent` : `${numToWords(Number(n), locale)} percent`,
  );
  out = out.replace(/\b(\d+)\s*for\s*(\d+)\b/gi, (_, a: string, b: string) =>
    `${numToWords(Number(a), locale)} for ${numToWords(Number(b), locale)}`,
  );
  out = out.replace(/#(\d+)/g, (_, n: string) =>
    locale === 'fr' ? `numéro ${numToWords(Number(n), locale)}` : `number ${numToWords(Number(n), locale)}`,
  );

  out = out.replace(/\bK1Y\s*2X1\b/gi, locale === 'fr' ? 'K un Y deux X un' : 'K one Y two X one');
  out = out.replace(/\b1385\b/g, numToWords(1385, locale));
  out = out.replace(/\b40\s*min(?:utes)?\b/gi, locale === 'fr' ? 'quarante minutes' : 'forty minutes');

  // leftover standalone prices written without $
  out = out.replace(/\b(\d{1,2})\.(\d{2})\b/g, (full, d: string, c: string) => {
    const dollars = Number(d);
    const cents = Number(c);
    if (dollars >= 3 && dollars <= 60) return money(dollars, cents, locale);
    return full;
  });

  return out.replace(/\s+/g, ' ').replace(/[–—]/g, ' to ').trim().slice(0, 1400);
}
