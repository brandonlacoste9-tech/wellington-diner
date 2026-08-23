export const house = {
  name: 'The Wellington Diner',
  shortName: 'Wellington Diner',
  liveSite: 'https://www.wellingtondiner.com/',
  email: 'jeff@thewellingtondiner.ca',
  emailHref: 'mailto:jeff@thewellingtondiner.ca',
  phone: '(613) 798-7800',
  phoneHref: 'tel:+16137987800',
  facebook: 'https://www.facebook.com/wellingtondiner/',
  instagram: 'https://www.instagram.com/thewellingtondiner/',
  logo: '/logo.png',
  hero: '/hero.jpg',
  plate: '/food2.jpg',
  challenge: '/challenge.jpg',
} as const;

export const shop = {
  lines: {
    en: ['1385 Wellington Street West', 'Ottawa, ON'],
    fr: ['1385 Wellington Street West', 'Ottawa, Ont.'],
  },
  postal: 'K1Y 2X1',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=1385+Wellington+Street+West+Ottawa+ON+K1Y+2X1',
} as const;

export const hoursRows = [
  { day: { en: 'Monday', fr: 'Lundi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Tuesday', fr: 'Mardi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Wednesday', fr: 'Mercredi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Thursday', fr: 'Jeudi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Friday', fr: 'Vendredi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Saturday', fr: 'Samedi' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
  { day: { en: 'Sunday', fr: 'Dimanche' }, hours: { en: '8:00 am–9:00 pm', fr: '8 h – 21 h' } },
] as const;

export const specials = [
  {
    id: 'kids',
    title: { en: 'Monday Kids Eat Free', fr: 'Lundi : enfants mangent gratis' },
    body: {
      en: 'After 4 pm with an adult meal and beverage. Coffee and tea excluded. In-house only.',
      fr: 'Après 16 h avec un repas et une boisson adulte. Café et thé exclus. Sur place seulement.',
    },
  },
  {
    id: 'sundaes',
    title: { en: 'Tuesday 2 for 1 sundaes', fr: 'Mardi : 2 sundaes pour 1' },
    body: {
      en: 'After 4 pm. In-house only.',
      fr: 'Après 16 h. Sur place seulement.',
    },
  },
  {
    id: 'mac',
    title: { en: 'Sunday buy 1 Mac, get 1 half off', fr: 'Dimanche : 2e macaroni à moitié' },
    body: {
      en: 'After 4 pm, with a beverage. Coffee and tea excluded. In-house only.',
      fr: 'Après 16 h, avec une boisson. Café et thé exclus. Sur place seulement.',
    },
  },
  {
    id: 'early',
    title: { en: 'Early bird (Mon–Fri 8–10 am)', fr: 'Early bird (lun–ven 8 h – 10 h)' },
    body: {
      en: 'Traditional breakfast: 2 eggs, bacon/ham/sausage, homies, toast, coffee. $15.99.',
      fr: 'Déjeuner traditionnel : 2 œufs, bacon/jambon/saucisse, patates, toast, café. 15,99 $.',
    },
  },
  {
    id: 'lunchbox',
    title: { en: 'Lunchbox (Mon–Fri 11 am–2 pm)', fr: 'Boîte à lunch (lun–ven 11 h – 14 h)' },
    body: {
      en: 'Soup and sandwich of the day $15.99. Bread: white, brown, rye +$0.75.',
      fr: 'Soupe et sandwich du jour 15,99 $. Pain : blanc, brun, seigle +0,75 $.',
    },
  },
  {
    id: 'sundown',
    title: { en: 'Sundown special', fr: 'Special sundown' },
    body: {
      en: 'Buy 1 burger with a side, large beer $5.99. Monday–Friday after 4 pm.',
      fr: '1 burger avec accompagnement, grande bière 5,99 $. Lundi–vendredi après 16 h.',
    },
  },
  {
    id: 'buds',
    title: { en: 'Burger Buds', fr: 'Burger Buds' },
    body: {
      en: 'Buy 1 burger at regular price, second 50% off with two drinks. Coffee and tea excluded. Monday–Friday after 4 pm.',
      fr: '1 burger au prix régulier, le 2e à 50 % avec deux boissons. Café et thé exclus. Lundi–vendredi après 16 h.',
    },
  },
] as const;

export { menu, dish } from './menu';

export const challenge = {
  price: '$49.99',
  minutes: 40,
  body: {
    en: 'Oreo milkshake, three Mac Daddy burgers (two 6 oz patties each), and a double homie poutine. Finish in 40 minutes: meal is on them, you join the legend. Rules they print: no leaving the table, no splitting, no take-home or sharing.',
    fr: 'Lait frappé Oreo, trois burgers Mac Daddy (deux galettes 6 oz), double poutine homie. En 40 minutes : le repas est offert. Règles : pas quitter la table, pas partager, pas à emporter.',
  },
} as const;
