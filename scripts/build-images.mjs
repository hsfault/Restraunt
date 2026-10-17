// Builds the Pollinations batch file for every image the site uses, then
// (with --run) generates them into public/images/ via scripts/pollinations.py.
// Missing files after a pass are retried once with a new seed.
//
//   node scripts/build-images.mjs            # write scripts/images.batch.json
//   node scripts/build-images.mjs --run      # generate whatever is missing
import { writeFileSync, existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { menu } from '../src/data/menu.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'images');

const STYLE =
  ', editorial food photography, low-key dramatic lighting, deep black shadows, warm ember rim light, matte dark stone, shallow depth of field, rich realistic textures, 35mm film grain, no text, no watermark, no logo, no people\'s faces unless specified';
const TOPDOWN =
  ', perfectly top-down overhead view, single round plate centered, plate fully inside the frame with margin, pure black background';

const jobs = [];
const add = (file, subject, width, height, seed, topDown = false) =>
  jobs.push({ prompt: subject + (topDown ? TOPDOWN : '') + STYLE, out: path.join(outDir, file), width, height, seed });

add('hero-plate.jpg', 'charred lamb chops on a dark round stone plate with a smoked labneh swoosh, scattered pomegranate seeds, drops of green herb oil, flaky sea salt', 1024, 1024, 101, true);
add('fire-hearth.jpg', 'open wood-fire hearth in a restaurant kitchen, glowing oak coals, heavy iron grill grates, cooks\' hands turning metal skewers of meat, orange sparks in the air, smoke', 1920, 1088, 102);

const dishes = [
  'oak-smoked chicken tikka on the bone with a blackened burnt lime half, pickled red onion, on a dark stone plate',
  'whole charred seabass with blistered skin, bright green chutney, charred lemon, on a dark oval plate',
  'pulled lamb shoulder raan piled on blistered ember-roasted flatbread, raw onion and sumac, glistening juices',
  'whole charred cauliflower with a blackened crust, black lime tahini, crispy chickpeas, parsley oil',
  'wagyu seekh kebab on a flat iron skewer resting over glowing coals, melting bone marrow butter',
  'ember-roasted aubergine split open, cold white yoghurt, red chilli oil, pomegranate seeds, on dark ceramic',
  'smoked kulfi dessert on a dark plate, crushed pistachio, glossy burnt honey, wisps of smoke',
];
dishes.forEach((s, i) => add(`dish-${i + 1}.jpg`, s, 1024, 1280, 201 + i));

const layers = [
  ['layer-1-plate.jpg', 'a single empty dark basalt stone plate, nothing on it'],
  ['layer-2-labneh.jpg', 'a single swoosh of smoked white labneh only, isolated on black, no plate'],
  ['layer-3-chops.jpg', 'three charred french-trimmed lamb chops only, arranged in a circle, isolated on black, no plate'],
  ['layer-4-oil.jpg', 'only scattered drops of green herb oil and ruby pomegranate seeds in a loose circle, isolated on black, no plate'],
  ['layer-5-garnish.jpg', 'only a light scattering of micro herbs and flaky white sea salt crystals in a loose circle, isolated on black, no plate'],
];
layers.forEach(([f, s], i) => add(f, s, 1024, 1024, 301 + i, true));

const menuShots = {
  'smoked-labneh': 'bowl of smoked labneh with apricot oil and za\'atar crisps',
  'charred-leek': 'whole blackened charred leeks split open, brown butter, hazelnut dukkah',
  'chapli-tartare': 'hand-cut beef tartare with chapli spice, cured egg yolk, toasted lavash shards',
  'kalari-tomato': 'seared kalari cheese with blistered cherry tomatoes and basil oil in a small iron pan',
  'ember-prawns': 'charred tiger prawns with black lime butter on a dark plate',
  'shami-sliders': 'two shami kebab sliders on toasted milk buns with mint chutney and raw onion',
  'grilled-octopus': 'charred octopus tentacle on warm chickpea puree with chilli crumb',
  'lamb-chops': 'charred lamb chops with smoked labneh, pomegranate seeds and herb oil',
  'chicken-tikka': 'smoky chicken tikka pieces with a blackened lime',
  seabass: 'whole grilled seabass with green chutney on a dark plate',
  'lamb-raan': 'pulled lamb raan on flatbread, onions and mint',
  'wagyu-seekh': 'two wagyu seekh kebabs on flat skewers over coals',
  'charred-cauliflower': 'charred cauliflower steak with tahini and black lime',
  'ember-aubergine': 'roasted aubergine with yoghurt and chilli oil',
  'oak-ribeye': 'sliced oak-fired ribeye steak with a glossy dark jus and bone marrow',
  'spatchcock-quail': 'two glazed spatchcock quails with sumac onions',
  'saffron-taftan': 'round saffron taftan bread brushed with ghee, golden and blistered',
  'garlic-naan': 'blistered garlic naan torn open with charred green chillies',
  'kalonji-roti': 'stack of whole wheat roti with nigella seeds, charred spots',
  'smoked-pulao': 'smoked yakhni pulao rice in a copper pot with crispy onions',
  'black-lime-rice': 'herb rice with dried black lime and fried garlic in a dark bowl',
  'smoked-kulfi': 'smoked kulfi with pistachio and burnt honey',
  'gajar-halwa': 'carrot halwa with a scoop of brown butter ice cream',
  'basque-cheesecake': 'slice of burnt basque cheesecake with apricot jam',
  'ash-kunafa': 'crisp kunafa with rose syrup and crushed pistachio',
  'charred-stonefruit': 'charred halved peaches with labneh and honey drizzle',
  'smoke-old-fashioned': 'zero-proof old fashioned in a heavy glass with a big ice cube, orange peel, smoke swirling',
  'black-lime-tonic': 'tall glass of black lime tonic with ice and a charred lemon strip',
  'burnt-orange-kanji': 'deep purple black carrot kanji drink in a glass with a charred orange wheel',
  'smoked-lassi': 'salted lassi in a clay cup with roasted cumin on top',
  'kashmiri-chai': 'pink kashmiri chai in a small glass with crushed pistachio',
  'hearth-sharbat': 'falsa berry sharbat with soda, charred lemon and basil seeds in a glass',
};
menu.forEach((m, i) => {
  const shot = menuShots[m.id];
  if (!shot) throw new Error(`no shot for menu item ${m.id}`);
  add(`menu-${m.id}.jpg`, shot, 768, 960, 401 + i);
});

add('chef.jpg', 'portrait of a Pakistani male chef in a black apron standing beside a glowing wood-fire hearth, face in partial shadow, arms crossed, cinematic, face visible', 1024, 1408, 501);

const priv = [
  ['private-1.jpg', 'a long candle-lit private dining table set for eighteen, dark oak, linen, low brass candlesticks, warm restaurant room', 1600, 1008],
  ['private-2.jpg', 'a moody restaurant bar with copper bottles and copper shelves backlit, dark stone counter, no people', 1008, 1408],
  ['private-3.jpg', 'hearth-side counter seating with leather stools facing an open wood fire in a restaurant, no people', 1200, 1200],
  ['private-4.jpg', 'a restaurant terrace at night with warm string lights, set tables, plants, Lahore evening', 1600, 1008],
  ['private-5.jpg', 'a dark wine and bottle wall behind a small private dining table, candle light', 1008, 1408],
  ['private-6.jpg', 'an elegant plated tasting menu course on matte dark stone, tweezered garnish, small portion', 1200, 1200],
];
priv.forEach(([f, s, w, h], i) => add(f, s, w, h, 601 + i));

const pre = [
  'macro of orange flames licking upward',
  'a metal skewer of meat on glowing coals',
  'a sizzling cast iron pan with spitting oil',
  'a hand sprinkling flaky salt from above, hand only',
  'a naan blistering on a clay tandoor wall',
  'smoke curling in a dark room, backlit',
  'a cocktail glass with a smoked rosemary garnish',
  'extreme macro of a glowing coal ember with fine ash',
];
pre.forEach((s, i) => add(`preloader-${i + 1}.jpg`, s, 600, 800, 701 + i));

add('receipt-banner.jpg', 'abstract flowing ember-red and orange flame silk texture, smooth gradient folds', 800, 160, 801);

// pollinations.py resolves relative `out` paths against assets/images/, so keep
// the written manifests portable by pointing back up to public/images/.
const portable = (list) => list.map((j) => ({ ...j, out: path.relative(path.join(root, 'assets', 'images'), j.out) }));
const batchFile = path.join(root, 'scripts', 'images.batch.json');
const pending = jobs.filter((j) => !existsSync(j.out) || statSync(j.out).size < 2048);
writeFileSync(batchFile, JSON.stringify(portable(jobs), null, 2) + '\n');
console.log(`${jobs.length} images in manifest, ${pending.length} missing`);

if (process.argv.includes('--run') && pending.length) {
  const run = (list) => {
    const f = path.join(root, 'scripts', '.pending.batch.json');
    writeFileSync(f, JSON.stringify(portable(list)));
    spawnSync('python3', [path.join(root, 'scripts', 'pollinations.py'), '--batch', f], { stdio: 'inherit' });
  };
  run(pending);
  const failed = pending.filter((j) => !existsSync(j.out));
  if (failed.length) {
    console.log(`retrying ${failed.length} with new seeds`);
    run(failed.map((j) => ({ ...j, seed: j.seed + 1000 })));
  }
  const still = jobs.filter((j) => !existsSync(j.out)).map((j) => path.basename(j.out));
  console.log(still.length ? `FAILED: ${still.join(', ')}` : 'all images present');
}
