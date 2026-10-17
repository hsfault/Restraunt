# Restraunt

Restaurant webpage mockups.

## Image generation (Pollinations)

Generate images with `scripts/pollinations.py` (Python stdlib, no install needed). Don't use stock-photo placeholders or hotlink Pollinations URLs in pages; generate the file and reference it locally.

- Needs `POLLINATIONS_API_KEY` in the environment or in `.env` (see `.env.example`).
- Single image: `python3 scripts/pollinations.py "<prompt>" -o <section>/<name>.jpg -W 1600 -H 900 --seed 1`
- Many images: write a JSON list of `{prompt, out, width?, height?, seed?, model?}` and run `--batch file.json` (example: `assets/images/example-batch.json`).
- Output paths are relative to `assets/images/`. Group by page/section (`home/`, `menu/`, `about/`).
- Always pass `--seed` so an image can be regenerated identically.
- Write detailed prompts: subject, setting, lighting, style ("food photography", "photorealistic"), and composition.
- Sizes: hero 1600x900, cards 800x800 or 1200x800. Some models need multiples of 16.
- `--list-models` shows available models; pin one with `-m` or `POLLINATIONS_MODEL`.
- The API host is `gen.pollinations.ai`; the cloud environment's network policy must allow it.

## SALTFIRE site

- React 18 + Vite + Tailwind v3 + Framer Motion + Lenis. Spec lives in `PRD.md`; content in `src/data/*.js`.
- Site images live in `public/images/`. `npm run images` regenerates only the missing ones from `scripts/build-images.mjs` (fixed seeds, retries once with a new seed). Menu photos are keyed by `menu.js` ids, so adding a menu item needs a matching `menuShots` entry there.
- `npm run dev` to work on it, `npm run build` to verify.
