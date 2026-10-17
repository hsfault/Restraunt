import { menuById } from './menu.js';

const raw = [
  {
    id: 'chicken-tikka',
    image: 'images/dish-1.jpg',
    short: 'Two days in yoghurt and Kashmiri chilli, one hour over oak.',
    story:
      'We marinate thighs on the bone for two days, then hang them over the oak end of the hearth where the smoke is thickest. A lime goes into the coals at the same time. By the time it reaches you, the lime is black and the juice inside is sweet.',
    components: ['Bone-in chicken thigh', 'Kashmiri chilli marinade', 'Burnt lime', 'Pickled red onion', 'Mint yoghurt'],
    pairsWith: 'Black Lime Tonic',
    dominantColor: '#B4451C',
  },
  {
    id: 'seabass',
    image: 'images/dish-2.jpg',
    short: 'Whole fish, iron cage, skin you can hear.',
    story:
      'Seabass from Karachi, packed in ice overnight. It goes into a hinged iron cage so we can turn it without tearing the skin, then sits over oak until the skin blisters and pulls away. Green chutney, made an hour before service, never earlier.',
    components: ['Whole seabass, 700g', 'Coriander & green chilli chutney', 'Pickled shallot', 'Charred lemon'],
    pairsWith: 'Hearth Sharbat',
    dominantColor: '#4F6B3A',
  },
  {
    id: 'lamb-raan',
    image: 'images/dish-3.jpg',
    short: 'Twelve hours in the embers. Pulled at the table.',
    story:
      'A whole lamb shoulder goes into the dying coals at closing time and stays there until the next afternoon. We pull it onto flatbread blistered on the same fire, so the bread drinks the fat. Order it early. We make eight a night.',
    components: ['Lamb shoulder, 12-hour ember roast', 'Blistered flatbread', 'Raw onion & sumac', 'Mint chutney', 'Pan juices'],
    pairsWith: 'Burnt Orange Kanji',
    dominantColor: '#7A3B1E',
  },
  {
    id: 'charred-cauliflower',
    image: 'images/dish-4.jpg',
    short: 'The vegetable that converted our meat cooks.',
    story:
      'A whole head, blanched in salted milk, then pushed straight into the coals. We let the outside go fully black, scrape back the char, and finish it with tahini whipped with black lime. Crispy chickpeas for crunch. Nobody misses the lamb.',
    components: ['Whole cauliflower', 'Black lime tahini', 'Crispy chickpeas', 'Parsley oil', 'Toasted sesame'],
    pairsWith: 'Salted Smoked Lassi',
    dominantColor: '#A47A45',
  },
  {
    id: 'wagyu-seekh',
    image: 'images/dish-5.jpg',
    short: 'Hand-pressed onto flat iron. Rested on the coals.',
    story:
      'Wagyu chuck and brisket, ground twice and pressed by hand onto flat iron skewers so the meat holds. It cooks fast over the hottest part of the fire, then rests on the edge of the coals while the bone-marrow butter melts through it.',
    components: ['Wagyu chuck & brisket', 'Bone-marrow butter', 'Green chilli', 'Charred onion petals', 'Saffron taftan'],
    pairsWith: 'Oak Smoke Old Fashioned',
    dominantColor: '#8E2F17',
  },
  {
    id: 'ember-aubergine',
    image: 'images/dish-6.jpg',
    short: 'Cooked until it collapses. Served cold-against-hot.',
    story:
      'The aubergine goes directly into the embers, skin and all, until it sighs and falls in on itself. We split it open at the pass and pour over yoghurt from the fridge and chilli oil from the stove. Hot, cold, smoke, heat. Eat it with bread.',
    components: ['Coal-roasted aubergine', 'Cold garlic yoghurt', 'Chilli oil', 'Pomegranate', 'Kalonji roti'],
    pairsWith: 'Black Lime Tonic',
    dominantColor: '#5A2A3A',
  },
  {
    id: 'smoked-kulfi',
    image: 'images/dish-7.jpg',
    short: 'Milk reduced for six hours, then shown the smoke.',
    story:
      'We reduce whole milk with cardamom for six hours, cold-smoke it over oak for twenty minutes, and freeze it in brass moulds. Pistachio for texture. Honey burnt in a pan until it nearly turns bitter, then stopped. The last thing the fire touches each night.',
    components: ['Oak-smoked kulfi', 'Burnt honey', 'Pistachio', 'Rose salt', 'Cardamom'],
    pairsWith: 'Kashmiri Chai',
    dominantColor: '#C9A36A',
  },
];

export const dishes = raw.map((d) => {
  const m = menuById[d.id];
  return { ...d, name: m.name, price: m.price, tags: m.tags, category: m.category, chefsPick: m.chefsPick };
});

// Anatomy of the signature plate, bottom layer first.
export const anatomy = [
  { id: 'plate', image: 'images/layer-1-plate.jpg', name: 'Stone plate', line: 'Black basalt, warmed at the hearth edge so nothing cools on the way out.', label: 'BASALT · 62°C' },
  { id: 'labneh', image: 'images/layer-2-labneh.jpg', name: 'Smoked labneh', line: 'Strained for a day, smoked for an hour, swept on with the back of a spoon.', label: 'LABNEH · OAK 60 MIN' },
  { id: 'chops', image: 'images/layer-3-chops.jpg', name: 'Lamb chops', line: 'French-trimmed, salted the night before, seared over the hottest coals.', label: 'LAMB · 1,200°F' },
  { id: 'oil', image: 'images/layer-4-oil.jpg', name: 'Herb oil & pomegranate', line: 'Coriander and mint oil, cold. Pomegranate for sharpness and colour.', label: 'HERB OIL · ANAR' },
  { id: 'garnish', image: 'images/layer-5-garnish.jpg', name: 'Micro herbs & salt', line: 'Last thing on, at the pass. Flaky salt is never optional.', label: 'FLAKY SALT · ALWAYS' },
];
