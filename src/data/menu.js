// Every item is cooked, finished or smoked over the hearth.
// tags: V = vegetarian, GF = gluten-free, HOT = carries real heat.

export const categories = [
  { id: 'small', label: 'Small Plates' },
  { id: 'fire', label: 'From the Fire' },
  { id: 'breads', label: 'Breads & Rice' },
  { id: 'desserts', label: 'Desserts' },
  { id: 'bar', label: 'Bar' },
];

const item = (id, category, name, desc, price, tags = [], chefsPick = false) => ({
  id,
  category,
  name,
  desc,
  price,
  tags,
  chefsPick,
  image: `images/menu-${id}.jpg`,
});

export const menu = [
  // Small Plates
  item('smoked-labneh', 'small', 'Smoked Labneh', 'Strained overnight, cold-smoked over oak, Hunza apricot oil, za’atar crisps.', 1650, ['V'], true),
  item('charred-leek', 'small', 'Charred Leek, Brown Butter', 'Leeks blackened whole in the coals, peeled at the pass, hazelnut dukkah.', 1450, ['V', 'GF']),
  item('chapli-tartare', 'small', 'Chapli Tartare', 'Hand-cut beef, chapli spice, cured yolk, ember-toasted lavash.', 2450, ['HOT']),
  item('kalari-tomato', 'small', 'Kalari & Blistered Tomato', 'Kashmiri kalari cheese seared on iron, tomatoes split in the heat, basil oil.', 1950, ['V', 'GF']),
  item('ember-prawns', 'small', 'Ember Prawns', 'Tiger prawns thrown straight on the coals, black lime butter, lemon ash.', 3250, ['GF', 'HOT']),
  item('shami-sliders', 'small', 'Smoked Bun Kebab', 'Two egg-dipped shami sliders on toasted milk buns, mint and raw onion.', 1850),
  item('grilled-octopus', 'small', 'Grilled Octopus', 'Braised then charred, warm chickpea purée, Aleppo chilli crumb.', 3450, ['GF']),

  // From the Fire
  item('lamb-chops', 'fire', 'Saltfire Lamb Chops', 'Charred chops, smoked labneh, pomegranate, herb oil, flaky salt. The house plate.', 4850, ['GF'], true),
  item('chicken-tikka', 'fire', 'Oak-smoked Chicken Tikka', 'Thigh on the bone, two-day marinade, burnt lime squeezed at the table.', 2650, ['GF', 'HOT']),
  item('seabass', 'fire', 'Whole Charred Seabass', 'Grilled in a cage over oak, green chutney, pickled shallot.', 5450, ['GF'], true),
  item('lamb-raan', 'fire', 'Pulled Lamb Raan', 'Shoulder cooked twelve hours in the embers, pulled onto blistered flatbread. Serves two.', 6800),
  item('wagyu-seekh', 'fire', 'Wagyu Seekh', 'Hand-pressed on flat iron skewers, rested on the coals, bone-marrow butter.', 5950, ['HOT'], true),
  item('charred-cauliflower', 'fire', 'Charred Cauliflower', 'Whole head, coal-roasted, tahini, black lime, crispy chickpeas.', 2250, ['V', 'GF']),
  item('ember-aubergine', 'fire', 'Ember-roasted Aubergine', 'Cooked in the coals until it collapses, cold yoghurt, chilli oil.', 1950, ['V', 'GF', 'HOT']),
  item('oak-ribeye', 'fire', 'Oak-fired Ribeye', '400g, dry-aged 28 days, nihari bone-marrow jus.', 8900, ['GF']),
  item('spatchcock-quail', 'fire', 'Spatchcock Quail', 'Two birds, pomegranate molasses glaze, sumac onions.', 3150, ['GF']),

  // Breads & Rice
  item('saffron-taftan', 'breads', 'Saffron Taftan', 'Slapped on the tandoor wall, brushed with desi ghee and saffron milk.', 450, ['V']),
  item('garlic-naan', 'breads', 'Blistered Garlic Naan', 'Roasted garlic, charred green chilli, coriander.', 550, ['V', 'HOT']),
  item('kalonji-roti', 'breads', 'Kalonji Roti', 'Whole wheat, nigella seed, straight off the clay.', 350, ['V']),
  item('smoked-pulao', 'breads', 'Smoked Yakhni Pulao', 'Lamb-stock rice sealed and smoked over the coals, ember-roasted onions.', 1850, ['GF']),
  item('black-lime-rice', 'breads', 'Black Lime & Herb Rice', 'Basmati, dried lime, dill, coriander, fried garlic.', 1250, ['V', 'GF']),

  // Desserts
  item('smoked-kulfi', 'desserts', 'Smoked Kulfi', 'Reduced milk smoked over oak, pistachio, burnt honey.', 1450, ['V', 'GF'], true),
  item('gajar-halwa', 'desserts', 'Ember Gajar Halwa', 'Carrots slow-cooked by the fire, brown-butter ice cream, khoya crumb.', 1350, ['V']),
  item('basque-cheesecake', 'desserts', 'Burnt Cheesecake', 'Baked in the hearth until the top blackens, Hunza apricot jam.', 1550, ['V']),
  item('ash-kunafa', 'desserts', 'Fire-crisped Kunafa', 'Kataifi and kalari cheese, rose syrup, crushed pistachio.', 1650, ['V']),
  item('charred-stonefruit', 'desserts', 'Charred Stone Fruit', 'Seasonal peaches or plums, labneh, oak-smoked honey.', 1250, ['V', 'GF']),

  // Bar (zero-proof)
  item('smoke-old-fashioned', 'bar', 'Oak Smoke Old Fashioned', 'Zero-proof. Black tea, date syrup, orange oil, glass smoked to order.', 1250, ['V', 'GF']),
  item('black-lime-tonic', 'bar', 'Black Lime Tonic', 'Dried lime cordial, tonic, a strip of charred lemon.', 950, ['V', 'GF']),
  item('burnt-orange-kanji', 'bar', 'Burnt Orange Kanji', 'Fermented black carrot, charred orange, mustard seed.', 850, ['V', 'GF', 'HOT']),
  item('smoked-lassi', 'bar', 'Salted Smoked Lassi', 'Churned yoghurt, roasted cumin, a pinch of ash salt.', 750, ['V', 'GF']),
  item('kashmiri-chai', 'bar', 'Kashmiri Chai', 'Pink tea, cardamom, crushed pistachio and almond.', 650, ['V', 'GF']),
  item('hearth-sharbat', 'bar', 'Hearth Sharbat', 'Falsa berries, charred lemon, soda, basil seeds.', 850, ['V', 'GF']),
];

export const menuById = Object.fromEntries(menu.map((m) => [m.id, m]));
export const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));
