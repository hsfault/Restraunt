#!/usr/bin/env python3
"""Generate images with the Pollinations API (https://gen.pollinations.ai).

Standard library only. Reads POLLINATIONS_API_KEY from the environment or a
.env file at the repo root. Get a key at https://enter.pollinations.ai/keys.

Examples:
  python3 scripts/pollinations.py "cozy italian trattoria interior, warm light" -o hero.jpg
  python3 scripts/pollinations.py "margherita pizza, top-down" -o menu/pizza.jpg -W 800 -H 800 --seed 7
  python3 scripts/pollinations.py --batch images.json
  python3 scripts/pollinations.py --list-models
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT_DIR = REPO_ROOT / "assets" / "images"
TIMEOUT = 180
RETRIES = 3


def load_dotenv():
    env_file = REPO_ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def base_url():
    return os.environ.get("POLLINATIONS_BASE_URL", "https://gen.pollinations.ai").rstrip("/")


def request(url, api_key=None):
    headers = {"User-Agent": "restraunt-mockups/1.0"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        return resp.read(), resp.headers.get("Content-Type", "")


def generate(prompt, out, width=1024, height=1024, model=None, seed=None,
             quality=None, api_key=None):
    params = {"width": width, "height": height}
    if model:
        params["model"] = model
    if seed is not None:
        params["seed"] = seed
    if quality:
        params["quality"] = quality
    url = (f"{base_url()}/image/{urllib.parse.quote(prompt, safe='')}"
           f"?{urllib.parse.urlencode(params)}")

    out = Path(out)
    if not out.is_absolute():
        out = DEFAULT_OUT_DIR / out
    out.parent.mkdir(parents=True, exist_ok=True)

    for attempt in range(1, RETRIES + 1):
        try:
            data, ctype = request(url, api_key)
            if not ctype.startswith("image/"):
                raise RuntimeError(f"expected an image, got {ctype}: {data[:200]!r}")
            out.write_bytes(data)
            print(f"saved {out.relative_to(REPO_ROOT) if out.is_relative_to(REPO_ROOT) else out} "
                  f"({len(data) // 1024} KB)")
            return out
        except urllib.error.HTTPError as e:
            body = e.read()[:300].decode(errors="replace")
            # Auth and bad-request errors won't fix themselves on retry.
            if e.code in (400, 401, 402, 403, 404) or attempt == RETRIES:
                raise RuntimeError(f"HTTP {e.code} for {prompt!r}: {body}") from None
        except (urllib.error.URLError, TimeoutError, RuntimeError) as e:
            if attempt == RETRIES:
                raise RuntimeError(f"failed for {prompt!r}: {e}") from None
        wait = 2 ** attempt
        print(f"  retrying in {wait}s (attempt {attempt}/{RETRIES})", file=sys.stderr)
        time.sleep(wait)


def run_batch(path, defaults, api_key):
    """Batch file: JSON list of {"prompt", "out", optional width/height/model/seed/quality}."""
    jobs = json.loads(Path(path).read_text())
    failures = 0
    for job in jobs:
        opts = {**defaults, **{k: v for k, v in job.items() if k not in ("prompt", "out")}}
        try:
            generate(job["prompt"], job["out"], api_key=api_key, **opts)
        except RuntimeError as e:
            failures += 1
            print(f"error: {e}", file=sys.stderr)
    return failures


def main():
    load_dotenv()
    p = argparse.ArgumentParser(description="Generate images with Pollinations.")
    p.add_argument("prompt", nargs="?", help="text prompt")
    p.add_argument("-o", "--out", help="output file, relative to assets/images/ unless absolute")
    p.add_argument("-W", "--width", type=int, default=1024)
    p.add_argument("-H", "--height", type=int, default=1024)
    p.add_argument("-m", "--model", default=os.environ.get("POLLINATIONS_MODEL"),
                   help="model id (default: $POLLINATIONS_MODEL or the server default)")
    p.add_argument("-s", "--seed", type=int, help="seed for reproducible output")
    p.add_argument("-q", "--quality", choices=["low", "medium", "high", "hd"])
    p.add_argument("--batch", help="JSON file with a list of image jobs")
    p.add_argument("--list-models", action="store_true", help="print available image models")
    args = p.parse_args()

    if args.list_models:
        data, _ = request(f"{base_url()}/image/models")
        models = json.loads(data)
        for m in models:
            print(m.get("name", m) if isinstance(m, dict) else m)
        return 0

    api_key = os.environ.get("POLLINATIONS_API_KEY")
    if not api_key:
        print("warning: POLLINATIONS_API_KEY is not set; requests will likely be rejected. "
              "Get a key at https://enter.pollinations.ai/keys", file=sys.stderr)

    defaults = {"width": args.width, "height": args.height, "model": args.model,
                "seed": args.seed, "quality": args.quality}

    if args.batch:
        return 1 if run_batch(args.batch, defaults, api_key) else 0

    if not args.prompt:
        p.error("a prompt is required (or use --batch / --list-models)")
    out = args.out or f"{int(time.time())}.jpg"
    try:
        generate(args.prompt, out, api_key=api_key, **defaults)
    except RuntimeError as e:
        print(f"error: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
