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
