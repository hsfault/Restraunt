# SALTFIRE

Website mockup for SALTFIRE, a live-fire kitchen & bar in Lahore. Built with React 18, Vite, Tailwind CSS, Framer Motion, Lenis and Zustand. The full spec is in [`PRD.md`](PRD.md).

## Run it in VS Code

1. **Install Node.js 18 or newer** (the LTS from https://nodejs.org). Check it in a terminal with `node -v`.
2. **Get the code**:
   ```bash
   git clone https://github.com/hsfault/Restraunt.git
   cd Restraunt
   git checkout claude/elegant-davinci-m274vs
   ```
   or in VS Code: `Ctrl+Shift+P` (`Cmd+Shift+P` on Mac) → **Git: Clone** → paste the repo URL, then pick the branch from the branch name in the bottom-left corner.
3. **Open the folder** in VS Code: File → Open Folder… → `Restraunt`.
4. **Open a terminal** inside VS Code: Terminal → New Terminal (or `` Ctrl+` ``).
5. **Install dependencies** (once):
   ```bash
   npm install
   ```
6. **Start the dev server**:
   ```bash
   npm run dev
   ```
   The terminal shows `Local: http://localhost:5173/`. `Ctrl`+click it (`Cmd`+click on Mac) to open the site. Edits to files in `src/` show up instantly. Stop the server with `Ctrl+C`.

## Other commands

| Command | What it does |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the `dist/` build at http://localhost:4173 |
| `npm run images` | Regenerates any missing images in `public/images/` (needs Pollinations credit; see `.env.example`) |

The `dist/` folder is a plain static site with relative paths and hash routing (`/#/menu`), so you can upload it as-is to Netlify, Vercel, GitHub Pages or any web host.

## Publish on Vercel

The repo includes `vercel.json`, so Vercel picks the right settings on its own (Vite, `npm run build`, output `dist`). The site uses hash routing (`/#/menu`), so no rewrite rules are needed.

1. Make sure your latest code is pushed to GitHub.
2. Go to https://vercel.com and sign up or log in with your GitHub account.
3. Click **Add New… → Project**, find the `Restraunt` repo and click **Import**. If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to it.
4. Leave the settings as detected (Framework: Vite) and click **Deploy**. No environment variables are needed.
5. **Point production at the right branch.** Vercel builds your repo's default branch. If that isn't the branch with the site, go to **Project → Settings → Git → Production Branch**, enter the site's branch (for example `claude/elegant-davinci-m274vs`), save, then open **Deployments** and redeploy. Merging the site into your default branch works too.
6. When it finishes you get a live address like `https://restraunt.vercel.app`. Every later push to that branch redeploys automatically.

Optional: add your own domain under **Project → Settings → Domains**.

Prefer the terminal? `npm i -g vercel`, then run `vercel` in the project folder (first deploy) and `vercel --prod` to publish to production.

## Where things live

- `src/data/` — all copy: brand facts, the 32-item menu, signature dishes, gallery, press quotes. Edit these to change text or prices.
- `src/sections/` — the home page sections (hero, fire scene, coverflow, anatomy, …).
- `src/pages/` — Home, Menu, Bag (checkout), Reserve, 404.
- `src/components/` — navbar, splash screen, footer, bag drawer, receipt printer and shared pieces.
- `tailwind.config.js` and `src/index.css` — colours, fonts and global styles.

## Tips

- The splash screen plays on every full page load. It's skipped if your OS has "reduce motion" turned on.
- The bag is saved in your browser, so it survives a refresh.
- Payments are fake. Use any 16-digit card number, e.g. `4242 4242 4242 4242`, a future expiry like `12/29` and any 3-digit CVC.
- Turning on "reduce motion" in your OS settings switches the site to its calm, low-animation version.
