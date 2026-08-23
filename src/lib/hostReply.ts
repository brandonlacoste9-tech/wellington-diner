import { challenge, house, hoursRows, menu, shop, specials } from '@/content/house';
import type { Locale } from '@/i18n/routing';

export type HostMessage = { role: 'user' | 'assistant'; content: string };

type FlatDish = {
  id: string;
  section: string;
  title: string;
  body: string;
  price: string | null;
};

function norm(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dishes(locale: Locale): FlatDish[] {
  return menu.flatMap((section) =>
    section.items.map((item) => ({
      id: item.id,
      section: section.title[locale],
      title: item.title.en,
      body: item.body[locale] || item.body.en,
      price: item.price,
    })),
  );
}

const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'what',
  'whats',
  'how',
  'much',
  'is',
  'are',
  'you',
  'your',
  'a',
  'an',
  'of',
  'on',
  'in',
  'to',
  'do',
  'does',
  'me',
  'please',
  'can',
  'i',
  'we',
  'want',
  'like',
  'about',
  'got',
  'get',
  'any',
  'have',
  'tell',
  'there',
  'they',
  'them',
  'this',
  'that',
  'le',
  'la',
  'les',
  'des',
  'un',
  'une',
  'du',
  'de',
  'est',
  'avez',
  'vous',
  'je',
  'quoi',
  'quel',
  'quelle',
]);

function tokens(q: string) {
  return norm(q)
    .split(' ')
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function scoreDish(q: string, dish: FlatDish) {
  const nq = norm(q);
  const nt = norm(dish.title);
  const nb = norm(dish.body);
  const ns = norm(dish.section);
  if (!nq) return 0;
  if (nt === nq) return 100;
  if (nt.includes(nq) && nq.length > 3) return 85;
  let s = 0;
  for (const t of tokens(q)) {
    if (nt.split(' ').includes(t)) s += 18;
    else if (nt.includes(t)) s += 12;
    else if (nb.includes(t)) s += 5;
    else if (ns.includes(t)) s += 4;
  }
  return s;
}

function formatDish(dish: FlatDish) {
  const price = dish.price ? ` ${dish.price}` : '';
  const body = dish.body ? ` — ${dish.body}` : '';
  return `${dish.title}${price}${body}`;
}

export function buildHostBrief(locale: Locale) {
  const hourLines = hoursRows.map((row) => `${row.day[locale]}: ${row.hours[locale]}`).join('\n');
  const specialLines = specials.map((item) => `${item.title[locale]}: ${item.body[locale]}`).join('\n');
  const dishLines = dishes(locale)
    .map((item) => {
      const price = item.price ?? 'no printed dollar';
      return `- [${item.section}] ${item.title} | ${price} | ${item.body}`;
    })
    .join('\n');
  const notes = menu
    .filter((section) => 'note' in section && section.note)
    .map((section) => `${section.title.en}: ${'note' in section ? section.note[locale] : ''}`)
    .join('\n');

  return `BUSINESS: ${house.name}
ADDRESS: ${shop.lines[locale].join(', ')} ${shop.postal}
PHONE (reservations): ${house.phone} (${house.phoneHref})
EMAIL (messages, not bookings): ${house.email}
DOORDASH: ${house.doordash}
FACEBOOK: ${house.facebook}
INSTAGRAM: ${house.instagram}
X: ${house.x}
LIVE SITE: ${house.liveSite}

HOURS (as printed on their home page, daily):
${hourLines}
Breakfast all day. Schema/Google may skip Monday; their page prints Monday — keep Monday.

BOOKING RULES:
- Reservations are taken by PHONE only.
- You cannot book, hold, confirm, or email a table.
- Their Wix form is a message, not a table hold.
- DoorDash is delivery, not a reservation.
- Never ask for a name/party size as if taking a reservation. If they already gave one, tell them to repeat it on the phone.

CHALLENGE: Mac Daddy food challenge ${challenge.price}, ${challenge.minutes} minutes. ${challenge.body[locale]}

WEEKLY SPECIALS:
${specialLines}

SECTION NOTES:
${notes}

PRICED MENU (from wellingtondiner.com/menus; tax extra; prices may change):
${dishLines}

EXTRAS: Wix modifiers (shake flavours, egg style) are not separate dishes.
GLUTEN/VEGGIE as printed: gluten-free toast upgrade $1.99; Beyond Meat as veggie patty on homemade burgers. No separate vegan menu is printed.
PARKING/WIFI/PATIO: not printed on their diner site — say you don't know, call.
`;
}

export function hostSystemPrompt(locale: Locale) {
  const lang = locale === 'fr' ? 'French' : 'English';
  return `You are the Wellington Diner website booth host. Bubbly, short, diner-counter energy. You are NOT staff and you are NOT at 1385 Wellington. You cannot book tables.

Speak ${lang}. Keep dish names as printed in English. 2–6 sentences unless listing a few dishes.

ONLY use FACTS in the brief. If it is not in the brief, say you don't know and point to ${house.phone}. Never invent prices, hours, emails, parking, allergens beyond the brief, or other delivery apps.

If they want a reservation: refuse clearly, give ${house.phone}, remind them DoorDash is not a table.

Prices exclude tax and may change.

FACTS:
${buildHostBrief(locale)}`;
}

function hitHours(q: string) {
  return /\b(hour|hours|open|opening|close|closed|closing|times|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday|heures|ouvert|ouverte|ferme|fermes|horaire)\b/.test(
    q,
  );
}

function hitBook(q: string) {
  return /\b(reserv|book|booking|table|hold|appointment|party of|reserve|reserver|reservation|reservations|réserver|résevation|réservation)\b/.test(
    q,
  );
}

function hitPhone(q: string) {
  return /\b(phone|call|number|telephone|téléphone|appeler)\b/.test(q);
}

function hitEmail(q: string) {
  return /\b(email|e-mail|courriel|jeff)\b/.test(q);
}

function hitWhere(q: string) {
  return /\b(where|address|located|location|hintonburg|westboro|map|adresse|ou etes|où)\b/.test(q);
}

function hitDash(q: string) {
  return /\b(doordash|door dash|deliver|delivery|uber|skip|livraison|livrer)\b/.test(q);
}

function specialId(q: string) {
  if (/\b(kids eat|kids free|enfants mangent)\b/.test(q)) return 'kids';
  if (/\bsundae/.test(q)) return 'sundaes';
  if (/\blunchbox|boite a lunch|boîte/.test(q)) return 'lunchbox';
  if (/\bearly bird/.test(q)) return 'early';
  if (/\bsundown/.test(q)) return 'sundown';
  if (/\bburger buds/.test(q)) return 'buds';
  if (/\b(special|specials|promo|speciale|spécial)\b/.test(q)) return 'all';
  return null;
}

function hitChallenge(q: string) {
  return /\b(challenge|mac daddy challenge|40 min|food challenge|defi|défi)\b/.test(q);
}

function hitKids(q: string) {
  return /\b(kids menu|kid menu|children|menu enfant)\b/.test(q);
}

function hitMenu(q: string) {
  return /^(menu|the menu|full menu|carte|le menu)$/.test(q) || /\b(what.?s on the menu|au menu)\b/.test(q);
}

function hitHi(q: string) {
  return /^(hi|hey|hello|yo|sup|howdy|bonjour|salut|allo|coucou)[\s!?.]*$/.test(q);
}

export function localHostReply(question: string, locale: Locale): string {
  const q = norm(question);
  const fr = locale === 'fr';

  if (!q) {
    return fr
      ? 'Pose-moi une question : menu, heures, ou comment réserver. Je ne peux pas retenir une table.'
      : 'Ask me about the menu, hours, or how to book. I can’t hold a table.';
  }

  if (hitHi(q)) {
    return fr
      ? `Hey, c’est l’hôte du site — pas quelqu’un au comptoir. Menu, heures, réservation : je peux pointer le tableau. Pour une table, ${house.phone}.`
      : `Hey there — I’m the booth host on this site, not someone at the counter. Menu, hours, booking: I can point at the board. For a table, call ${house.phone}.`;
  }

  if (hitBook(q)) {
    return fr
      ? `Je ne peux pas réserver, retenir, ni confirmer une table — je suis l’hôte du site. Ils écrivent : les réservations se font au téléphone. Appelle ${house.phone} et dis-leur la date et le nombre. Le formulaire Wix n’est pas une retenue. DoorDash, c’est la livraison, pas une table.`
      : `I can’t book, hold, or confirm a table — I’m just the website host. They print: reservations are taken by phone. Call ${house.phone} and tell them when and how many. Their Wix form is a message, not a hold. DoorDash is delivery, not a reservation.`;
  }

  if (hitHours(q)) {
    const board = hoursRows.map((row) => `${row.day[locale]} ${row.hours[locale]}`).join('; ');
    return fr
      ? `Tableau imprimé : tous les jours 8 h – 21 h (${board}). Déjeuner toute la journée. Les apps (DoorDash) ferment parfois plus tôt. Le schéma Google saute le lundi ; leur accueil l’imprime, alors on le garde.`
      : `Printed board: daily 8:00 am–9:00 pm (${board}). Breakfast all day. Apps like DoorDash sometimes close earlier. Google’s schema skips Monday; their home page prints it, so we keep Monday.`;
  }

  if (hitPhone(q)) {
    return fr
      ? `Le téléphone du diner : ${house.phone}. C’est comme ça qu’on réserve une table.`
      : `The diner’s phone is ${house.phone}. That’s how you book a table.`;
  }

  if (hitEmail(q)) {
    return fr
      ? `Le courriel sur le site : ${house.email}. Pour une table, téléphone ${house.phone} — le courriel n’est pas une réservation.`
      : `Email on the site is ${house.email}. For a table, call ${house.phone} — email is not a booking.`;
  }

  if (hitWhere(q)) {
    return fr
      ? `1385 Wellington Street West, Ottawa, ${shop.postal} — Hintonburg. ${shop.mapUrl}`
      : `1385 Wellington Street West, Ottawa, ${shop.postal} — Hintonburg. ${shop.mapUrl}`;
  }

  if (hitDash(q)) {
    return fr
      ? `Ils sont sur DoorDash : ${house.doordash}. Les heures de l’app peuvent fermer plus tôt que 21 h. Ce n’est pas une réservation de table. D’autres apps existent parfois ; on n’invente pas d’URL.`
      : `They’re on DoorDash: ${house.doordash}. App hours can close earlier than 9 pm. That’s delivery, not a table. Other apps may exist; we don’t invent extra store URLs.`;
  }

  if (hitChallenge(q)) {
    return fr
      ? `Défi Mac Daddy : ${challenge.price}, ${challenge.minutes} minutes. ${challenge.body.fr}`
      : `Mac Daddy challenge: ${challenge.price}, ${challenge.minutes} minutes. ${challenge.body.en}`;
  }

  const spec = specialId(q);
  if (spec) {
    const rows = spec === 'all' ? specials : specials.filter((item) => item.id === spec);
    const list = rows.map((item) => `${item.title[locale]} — ${item.body[locale]}`).join(' ');
    return fr ? `Comme imprimé : ${list}` : `As printed: ${list}`;
  }

  if (hitKids(q)) {
    const kids = menu.find((section) => section.id === 'kids-menu');
    const names = kids?.items.map((item) => `${item.title.en} ${item.price}`).join('; ');
    return fr
      ? `Menu kids (noms comme imprimés) : ${names}. Lundi : enfants mangent gratis après 16 h avec repas et boisson adulte (café/thé exclus, sur place).`
      : `Kids menu as printed: ${names}. Monday kids eat free after 4 pm with an adult meal and beverage (coffee/tea excluded, in-house).`;
  }

  if (hitMenu(q)) {
    const sections = menu.map((section) => section.title.en).join(', ');
    return fr
      ? `Le tableau a ${menu.length} sections, ${dishes(locale).length} items : ${sections}. Demande un plat par nom. Prix hors taxes, sujets à changement.`
      : `The board has ${menu.length} sections and ${dishes(locale).length} items: ${sections}. Ask a dish by name. Prices exclude tax and may change.`;
  }

  const toks = tokens(question);
  let ranked = dishes(locale)
    .map((item) => ({ item, score: scoreDish(question, item) }))
    .filter((row) => row.score >= 12)
    .sort((a, b) => b.score - a.score);

  if (toks.length >= 2) {
    const tight = ranked.filter((row) => toks.every((t) => norm(row.item.title).includes(t)));
    if (tight.length) ranked = tight;
  }

  if (ranked.length > 1 && ranked[0].score >= ranked[1].score + 16) {
    ranked = [ranked[0]];
  }

  ranked = ranked.slice(0, 3);

  if (ranked.length === 1) {
    const dish = ranked[0].item;
    return fr
      ? `Sur le tableau — ${dish.section}: ${formatDish(dish)} Prix hors taxes, sujets à changement.`
      : `On the board — ${dish.section}: ${formatDish(dish)} Tax extra, prices may change.`;
  }

  if (ranked.length > 1) {
    const lines = ranked.map((row) => formatDish(row.item)).join(' · ');
    return fr
      ? `Voici ce qui colle sur le tableau : ${lines} Prix hors taxes, sujets à changement. Pour une table : ${house.phone}.`
      : `Closest matches on the board: ${lines} Tax extra, prices may change. For a table: ${house.phone}.`;
  }

  return fr
    ? `Je n’ai que ce qu’ils impriment. Essaie un nom de plat, « heures », ou « réserver ». Pour le reste, ${house.phone}. Je ne retiens pas de table.`
    : `I only know what they print. Try a dish name, “hours”, or “book a table”. Anything else, call ${house.phone}. I can’t hold a booth.`;
}
