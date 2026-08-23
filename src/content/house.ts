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
] as const;

export const menu = [
  {
    id: 'benny',
    title: { en: 'Eggs Benny', fr: 'Eggs Benny' },
    items: [
      { id: 'wellington-benny', title: { en: 'The Wellington Benny', fr: 'The Wellington Benny' }, body: { en: 'Thin sliced seasoned steak and caramelized onions.', fr: 'Steak tranché, oignons caramélisés.' }, price: '$19.99' },
      { id: 'classic-benny', title: { en: 'The Classic Benny', fr: 'The Classic Benny' }, body: { en: 'Grilled peameal.', fr: 'Peameal grillé.' }, price: '$18.99' },
      { id: 'cali-benny', title: { en: 'The California Kid Benny', fr: 'The California Kid Benny' }, body: { en: 'Grilled ham, guacamole, 3-cheese blend, chipotle hollandaise.', fr: 'Jambon grillé, guacamole, 3 fromages, hollandaise chipotle.' }, price: '$18.99' },
      { id: 'florentine', title: { en: 'The Diner Florentine', fr: 'The Diner Florentine' }, body: { en: 'Baby spinach and a 3-cheese blend.', fr: 'Épinards et 3 fromages.' }, price: '$17.99' },
      { id: 'smoked-benny', title: { en: 'Smoked Meat Benny', fr: 'Smoked Meat Benny' }, body: { en: '5 oz Montreal-style smoked meat and swiss.', fr: '5 oz smoked meat style Montréal et suisse.' }, price: '$18.99' },
      { id: 'natasha', title: { en: 'Lady Natasha', fr: 'Lady Natasha' }, body: { en: 'Smoked Atlantic salmon, cream cheese, baby spinach.', fr: 'Saumon fumé, fromage à la crème, épinards.' }, price: '$21.99' },
    ],
  },
  {
    id: 'eggs',
    title: { en: 'Eggs & things', fr: 'Œufs et cie' },
    items: [
      { id: 'one-hit', title: { en: 'The One Hit Wonder', fr: 'The One Hit Wonder' }, body: { en: '1 egg, 2 slices bacon, ham or sausage. Homies, toast, coffee.', fr: '1 œuf, 2 tranches bacon, jambon ou saucisse. Patates, toast, café.' }, price: '$15.99' },
      { id: 'traditional', title: { en: 'Traditional Breakfast', fr: 'Traditional Breakfast' }, body: { en: '2 eggs, 3 slices bacon, ham or sausage. Homies, toast, coffee.', fr: '2 œufs, 3 tranches. Patates, toast, café.' }, price: '$17.99' },
      { id: 'biggie', title: { en: 'The Biggie Breakfast', fr: 'The Biggie Breakfast' }, body: { en: '3 eggs, bacon, ham, and sausage.', fr: '3 œufs, bacon, jambon et saucisse.' }, price: '$19.79' },
      { id: 'steak-eggs', title: { en: 'Steak & Eggs', fr: 'Steak & Eggs' }, body: { en: '2 eggs, 8 oz AAA hand-cut sirloin.', fr: '2 œufs, surlonge AAA 8 oz.' }, price: '$20.99' },
      { id: 'bonanza', title: { en: 'The Bonanza', fr: 'The Bonanza' }, body: { en: '3 eggs, 8 oz sirloin, bacon, ham, sausage, pork beans. Sharing fee $4.99.', fr: '3 œufs, surlonge 8 oz, bacon, jambon, saucisse, fèves. Frais de partage 4,99 $.' }, price: '$24.49' },
    ],
  },
  {
    id: 'hash',
    title: { en: 'Hashes & breakfast poutine', fr: 'Hashes et poutine déjeuner' },
    items: [
      { id: 'stoner', title: { en: 'Stoner Hash', fr: 'Stoner Hash' }, body: { en: 'In-house sweet sausage stoner patty, bacon, peppers, onions, 3-cheese, 2 over-easy eggs, chipotle hollandaise.', fr: 'Galette stoner maison, bacon, poivrons, oignons, 3 fromages, 2 œufs, hollandaise chipotle.' }, price: '$18.99' },
      { id: 'mexican', title: { en: 'Mexican Hash', fr: 'Mexican Hash' }, body: { en: 'Chorizo, peppers, onions, cheese, 2 eggs, guacamole, chipotle hollandaise on homies.', fr: 'Chorizo, poivrons, oignons, fromage, 2 œufs, guacamole, hollandaise chipotle.' }, price: '$18.99' },
      { id: 'carnivore', title: { en: 'Carnivore Poutine', fr: 'Carnivore Poutine' }, body: { en: 'Bacon, sausage, ham, St. Albert’s cheese curds, hollandaise.', fr: 'Bacon, saucisse, jambon, crottes St. Albert, hollandaise.' }, price: '$17.29' },
    ],
  },
  {
    id: 'drinks',
    title: { en: 'Drinks', fr: 'Boissons' },
    items: [
      { id: 'shake', title: { en: '20 oz milkshake', fr: 'Lait frappé 20 oz' }, body: { en: 'Chocolate, strawberry, vanilla, creamsicle, banana & chocolate, chocolate & PB, PB & J, Oreo, Smarties, mochaccino, coconut.', fr: 'Chocolat, fraise, vanille, creamsicle, banane-chocolat, chocolat-beurre d’arachide, Oreo, Smarties, etc.' }, price: '$9.99' },
      { id: 'coffee', title: { en: 'Coffee', fr: 'Café' }, body: { en: 'Refillable.', fr: 'Recharges.' }, price: '$3.49' },
      { id: 'caesar', title: { en: 'Diner Caesar', fr: 'Diner Caesar' }, body: { en: '2 for $15.99. Virgin $4.99.', fr: '2 pour 15,99 $. Virgin 4,99 $.' }, price: '$9.99' },
      { id: 'beau', title: { en: "Beau's Lugtread", fr: "Beau's Lugtread" }, body: { en: 'Large ABV 5.2%. Small $5.99.', fr: 'Grande 5,2 %. Petite 5,99 $.' }, price: '$9.99' },
    ],
  },
] as const;

export const challenge = {
  price: '$49.99',
  minutes: 40,
  body: {
    en: 'Oreo milkshake, three Mac Daddy burgers (two 6 oz patties each), and a double homie poutine. Finish in 40 minutes: meal is on them, you join the legend. Rules they print: no leaving the table, no splitting, no take-home or sharing.',
    fr: 'Lait frappé Oreo, trois burgers Mac Daddy (deux galettes 6 oz), double poutine homie. En 40 minutes : le repas est offert. Règles : pas quitter la table, pas partager, pas à emporter.',
  },
} as const;
