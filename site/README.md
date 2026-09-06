# 3DASTRA presentation website

Published at [3dastra.vercel.app](https://3dastra.vercel.app/). An English presentation with six workflow stages, neutral model studies, four generated concept examples, a prompt builder, installation guidance, FAQ, source links, and a skill download.

## Run

Build the portable skill from the repository root first:

```sh
python -B tools/package_skill.py
cd site
npm run build
npm run dev
```

The local preview uses `http://127.0.0.1:4310`. Node.js 22 is required; the site build has no npm dependencies. It copies only the page, source modules, and reviewed public assets into a clean `dist` directory.

## Verify

From the repository root, with the preview running:

```sh
node tests/verify_site.mjs http://127.0.0.1:4310 /path/to/node_modules
```

The last argument is optional when Playwright can already be resolved. Captures and reports are written to the ignored `artifacts` directory. Verification covers method tabs, keyboard operation, image dialogs, focus, use cases, generated prompts, clipboard, installation, mobile navigation, image loading, errors, and the downloadable ZIP.

## Assets and distribution

The hero and use-case gallery use AI-generated concepts. The model studies use reviewed renders without HUDs, labels, or business data. The images are clearly identified as references, geometry studies, or model renders.

The source assets are explicitly listed in the build script so unreviewed images cannot silently enter the published site. Image prompts are documented in [image-prompts.json](../docs/image-prompts.json). The optional share-card script renders English HTML text with the generated hero artwork; it does not modify the original artwork.

The Vercel project uses the `site` directory in this repository. Its canonical address and social metadata point to the public 3DASTRA website.
