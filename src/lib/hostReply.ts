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

const SECTION_ALIASES: Record<string, string[]> = {
  beverages: ['beverage', 'beverages', 'drink', 'drinks', 'milkshake', 'milkshakes', 'shake', 'shakes', 'coffee', 'smoothie'],
  'get-boozy': ['boozy', 'beer', 'cocktail', 'cocktails', 'wine', 'caesar', 'alcohol', 'booze', 'mimosa'],
  'eggs-benny': ['benny', 'bennies', 'benedict', 'eggs benny', 'eggs benedict'],
  'eggs-things': ['eggs and things', 'traditional breakfast', 'steak and eggs'],
  'scrambles-omelettes': ['omelette', 'omelettes', 'scramble', 'scrambles'],
  'our-breakfast-poutines-hashes': ['hash', 'hashes', 'breakfast poutine', 'stoner'],
  'light-healthy': ['salad', 'salads', 'healthy', 'light'],
  'breakfast-clubs-wraps': ['breakfast club', 'breakfast wrap', 'burrito'],
  yummies: ['pancake', 'pancakes', 'french toast', 'yummies', 'sweet'],
  'tasty-apps': ['app', 'apps', 'appetizer', 'appetizers', 'starter', 'starters', 'fries', 'rings'],
  mains: ['mains', 'dinner', 'fish and chips', 'quesadilla'],
  'mac-n-cheese-house-specialty': ['mac', 'macs', 'macaroni', 'mac and cheese', 'mac n cheese'],
  'our-famous-poutines': ['poutine', 'poutines'],
  'homemade-burger': ['burger', 'burgers', 'hamburger', 'hamburgers'],
  'our-signature-clubs-wraps': ['club', 'clubs', 'wrap', 'wraps', 'sandwich', 'sandwiches'],
  'kids-menu': ['kids', 'kid', 'children', 'child'],
  'weekly-specials': ['weekly', 'this week'],
};

function expandQuery(q: string) {
  return q
    .replace(/\beggs?\s*benedicts?\b/gi, 'benny')
    .replace(/\bmilk\s*shakes?\b/gi, 'milkshake')
    .replace(/\bmac(?:aroni)?\s*(?:and|&|n|'n)?\s*cheese\b/gi, 'mac')
    .replace(/\bhome\s*fries\b/gi, 'homies')
    .replace(/\bappetizers?\b/gi, 'apps')
    .replace(/\bstarters?\b/gi, 'apps');
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
  return norm(expandQuery(q))
    .split(' ')
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function matchSection(q: string) {
  const nq = norm(expandQuery(q));
  const toks = tokens(q);
  for (const section of menu) {
    const title = norm(section.title.en);
    if (nq === title || nq.includes(title)) return section;
  }
  let best: (typeof menu)[number] | null = null;
  let bestHits = 0;
  for (const section of menu) {
    const aliases = SECTION_ALIASES[section.id] ?? [];
    const hits = aliases.filter((alias) => nq === alias || nq.includes(alias) || toks.includes(alias)).length;
    if (hits > bestHits) {
      bestHits = hits;
      best = section;
    }
  }
  const categoryCue = /\b(what|which|any|your|got|have|list|show|des|les|vos)\b/.test(nq);
  if (best && bestHits > 0 && (toks.length <= 1 || categoryCue)) return best;
  return null;
}

function listSection(section: (typeof menu)[number], locale: Locale, fr: boolean) {
  const note = 'note' in section && section.note ? ` ${section.note[locale]}` : '';
  const rows = section.items
    .slice(0, 10)
    .map((item) => `${item.title.en}${item.price ? ` ${item.price}` : ''}`)
    .join('. ');
  const more = section.items.length > 10 ? (fr ? ' Et d’autres sur le menu.' : ' And more on the menu page.') : '';
  return fr
    ? `${section.title.en}.${note} Sur le tableau : ${rows}.${more} Prix hors taxes, sujets à changement.`
    : `${section.title.en}.${note} On the board: ${rows}.${more} Tax extra, prices may change.`;
}

function scoreDish(q: string, dish: FlatDish) {
  const nq = norm(expandQuery(q));
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
They credit Beard Meets Food (YouTube channel BeardMeatsFood). The video of him doing it at this diner: ${house.challengeVideo}

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
  const timeWord = /\b(hour|hours|open|opening|close|closed|closing|times|today|tonight|heures|ouvert|ouverte|ferme|fermes|horaire)\b/.test(
    q,
  );
  const dayOnly =
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\b/.test(
      q,
    );
  const foodish = /\b(mac|burger|benny|poutine|shake|hash|special|kids eat|breakfast|menu)\b/.test(q);
  if (timeWord) return true;
  if (dayOnly && !foodish) return true;
  return false;
}

function hitBook(q: string) {
  if (/\b(reserv|book|booking|appointment|party of|reserve|reserver|reservation|reservations|réserver|réservation)\b/.test(q)) {
    return true;
  }
  return /\btable\b/.test(q) && /\b(want|need|please|hold|for \d|pour)\b/.test(q);
}

export function foodCue(q: string) {
  return /\b(poutine|burger|benny|mac|hash|shake|milkshake|omelette|breakfast|wrap|club|salad|fries|kids|menu|special|coffee|beer|cocktail|lobster|pancake|benedict|homie|appetizer|beard|challenge)\b/i.test(
    q,
  );
}

function hitPhone(q: string) {
  if (foodCue(q)) return false;
  return /\b(phone number|telephone|téléphone|appeler|call (you|the diner|us))\b/.test(q) || /^(phone|call|number)$/.test(q);
}

function hitEmail(q: string) {
  if (foodCue(q)) return false;
  return /\b(email|e-mail|courriel|jeff@)\b/.test(q);
}

function hitWhere(q: string) {
  if (foodCue(q)) return false;
  return (
    /\b(address|located|hintonburg|westboro|your map|adresse)\b/.test(q) ||
    /\bwhere\s+(are you|is (it|the diner)|do you sit|can i find)\b/.test(q) ||
    /\bhow do i get there\b/.test(q)
  );
}

const DINER_ASK =
  /\b(poutine|burger|benny|mac|hash|menu|hours?|open|book|reserv|table|doordash|milkshake|shake|breakfast|omelette|wrap|club|salad|fries|kids|special|phone|call|address|wellington|diner|coffee|beer|cocktail|lobster|pancake)\b/i;

export function cleanHeard(text: string) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  if (trimmed.length < 140) return trimmed;

  const parts = trimmed
    .split(/(?<=[.?!\n])\s+|(?=\b(?:do you|does it|what|where|when|how|can i|have you|got any|is there)\b)/i)
    .map((part) => part.replace(/^["'\-–—\s]+|["'\s]+$/g, '').trim())
    .filter((part) => part.length > 5 && DINER_ASK.test(part));

  if (parts.length) {
    const questions = parts.filter(
      (part) =>
        part.includes('?') || /^(do|does|what|where|when|how|have|got|is|are|can|any)\b/i.test(part),
    );
    const pool = questions.length ? questions : parts;
    return pool.sort((a, b) => a.length - b.length)[0].slice(0, 180);
  }

  return trimmed.slice(0, 180);
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
  return /\b(challenge|mac daddy challenge|40 min|food challenge|defi|défi|beard meets|beard meats|beardmeatsfood|youtube)\b/.test(
    q,
  );
}

function hitKids(q: string) {
  return /\b(kids menu|kid menu|children|menu enfant)\b/.test(q);
}

function hitMenu(q: string) {
  return (
    /^(menu|the menu|full menu|carte|le menu)$/.test(q) ||
    /\b(what.?s on the menu|what do you serve|what do you have to eat|au menu|quoi manger)\b/.test(q)
  );
}

function hitHi(q: string) {
  return /^(hi|hey|hello|yo|sup|howdy|bonjour|salut|allo|coucou)[\s!?.]*$/.test(q);
}

export function localHostReply(question: string, locale: Locale): string {
  const heard = cleanHeard(question);
  const q = norm(heard);
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

  if (hitBook(q) && !matchSection(q)) {
    return fr
      ? `Je ne peux pas réserver, retenir, ni confirmer une table — je suis l’hôte du site. Ils écrivent : les réservations se font au téléphone. Appelle ${house.phone} et dis-leur la date et le nombre. Le formulaire Wix n’est pas une retenue. DoorDash, c’est la livraison, pas une table.`
      : `I can’t book, hold, or confirm a table — I’m just the website host. They print: reservations are taken by phone. Call ${house.phone} and tell them when and how many. Their Wix form is a message, not a hold. DoorDash is delivery, not a reservation.`;
  }

  if (hitPhone(q) && !hitHours(q)) {
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
      ? `Défi Mac Daddy : ${challenge.price}, ${challenge.minutes} minutes. ${challenge.body.fr} Ils créditent Beard Meets Food. La vidéo YouTube de lui le faisant ici : ${house.challengeVideo}`
      : `Mac Daddy challenge: ${challenge.price}, ${challenge.minutes} minutes. ${challenge.body.en} They credit Beard Meets Food. The YouTube video of him doing it here: ${house.challengeVideo}`;
  }

  const spec = specialId(q);
  if (spec) {
    const rows = spec === 'all' ? specials : specials.filter((item) => item.id === spec);
    const list = rows.map((item) => `${item.title[locale]} — ${item.body[locale]}`).join(' ');
    return fr ? `Comme imprimé : ${list}` : `As printed: ${list}`;
  }

  if (hitKids(q)) {
    const kids = menu.find((section) => section.id === 'kids-menu');
    if (kids) return listSection(kids, locale, fr);
  }

  if (hitMenu(q)) {
    const sections = menu.map((section) => section.title.en).join(', ');
    return fr
      ? `Le tableau a ${menu.length} sections, ${dishes(locale).length} plats tarifés : ${sections}. Demande une section (burgers, poutine, benny, mac) ou un plat par nom. Prix hors taxes, sujets à changement.`
      : `The board has ${menu.length} sections and ${dishes(locale).length} priced dishes: ${sections}. Ask a section — burgers, poutine, bennies, mac — or a dish by name. Tax extra, prices may change.`;
  }

  const toks = tokens(heard);
  let ranked = dishes(locale)
    .map((item) => ({ item, score: scoreDish(heard, item) }))
    .filter((row) => row.score >= 12)
    .sort((a, b) => b.score - a.score);

  if (toks.length >= 2) {
    const tight = ranked.filter((row) => toks.every((t) => norm(row.item.title).includes(t)));
    if (tight.length) ranked = tight;
  }

  if (ranked.length > 1 && ranked[0].score >= ranked[1].score + 16) {
    ranked = [ranked[0]];
  }

  const section = matchSection(q);
  const exact = ranked.find((row) => norm(row.item.title) === norm(expandQuery(heard)));
  if (exact) {
    return fr
      ? `Sur le tableau — ${exact.item.section}: ${formatDish(exact.item)} Prix hors taxes, sujets à changement.`
      : `On the board — ${exact.item.section}: ${formatDish(exact.item)} Tax extra, prices may change.`;
  }

  if (section && toks.length <= 2) {
    return listSection(section, locale, fr);
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

  if (section) return listSection(section, locale, fr);

  if (hitHours(q)) {
    return fr
      ? `Tableau imprimé : tous les jours de 8 h à 21 h. Déjeuner toute la journée. DoorDash ferme parfois plus tôt. Le schéma Google saute le lundi ; leur accueil l’imprime, alors on le garde. Pour une table, ${house.phone}.`
      : `Printed board: every day, 8:00 am to 9:00 pm. Breakfast all day. DoorDash sometimes closes earlier. Google’s schema skips Monday; their home page prints it, so we keep Monday. For a table, call ${house.phone}.`;
  }

  return fr
    ? `Je n’ai que ce qu’ils impriment. Essaie un plat (Wellington Benny, Lobster Mac, Phat Ass Burger), une section (burgers, poutine, mac), « heures », ou « réserver ». Pour le reste, ${house.phone}.`
    : `I only know what they print. Try a dish (Wellington Benny, Lobster Mac, Phat Ass Burger), a section (burgers, poutine, mac), “hours”, or “book a table”. Anything else, call ${house.phone}.`;
}
