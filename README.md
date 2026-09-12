# Eve's Millinery

An editorial portfolio site for a bespoke millinery atelier — fascinators, occasion headwear
and gele. Motion-led, enquiry-driven, no cart.

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on <http://localhost:3000> |
| `npm run build` | Production build — must pass before merging |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` then `tsc --noEmit` |
| `npm run placeholders` | Generates placeholder imagery for any new piece |

## Adding a piece

Everything on the site reads from one file: [`src/content/pieces.ts`](src/content/pieces.ts).

1. Put the photographs in `public/images/` — see
   [`public/images/README.md`](public/images/README.md) for the filenames and aspect ratios.
2. Add an entry to the `pieces` array.

The collections index, the detail page, the home page, the gele gallery and the sitemap all pick
it up automatically. Brand details, contact information and long-form copy live next door in
[`src/content/site.ts`](src/content/site.ts).

## Before launch

The site currently ships with **placeholder photography and placeholder contact details**.

- [ ] Replace every image in `public/images/` with real photography (same filenames).
- [ ] Replace every value marked `TODO` in `src/content/site.ts` — email, phone, WhatsApp,
      social links, studio location, and the production `url`.
- [ ] Confirm the spelling of the brand name (the directory is `Eves-Milinery`, the site says
      "Eve's Millinery").
- [ ] Set `RESEND_API_KEY`, `ENQUIRY_FROM` and `ENQUIRY_TO` in the Vercel dashboard — see
      [`.env.example`](.env.example). Without a key the enquiry form still works and logs the
      submission server-side instead of emailing it.

## Architecture

```
src/
  app/                 Routes. `template.tsx` drives the page-transition curtain.
  components/motion/   Reusable motion primitives — reveals, split text, parallax, marquee.
  components/ui/       Page furniture and the larger set pieces.
  content/             The editable content layer. No CMS by design.
  lib/motion.ts        Every easing curve and duration on the site, in one place.
```

**Tuning the feel of the site starts in `src/lib/motion.ts`.** Durations and easing are shared
from there deliberately, so the whole site can be made faster or slower as one decision.

Two rules govern the motion work:

1. Nothing moves fast. Entrances are 0.9–1.4s.
2. Every effect appears in at most two places. An effect used everywhere stops reading as craft.

### Accessibility

Every animated component consults `useReducedMotion()` and renders its final state immediately.
With reduced motion enabled, Lenis is never mounted, the preloader and custom cursor are skipped,
the horizontal gele gallery becomes a vertical stack, and the sticky atelier process becomes
ordinary stacked sections. Motion never carries information that isn't also in the static DOM.

**Please keep this true when adding components.**

### Performance

Only `transform`, `opacity` and `clip-path` are animated — never layout properties. Lenis owns
the only scroll RAF loop; nothing else should attach an unthrottled scroll listener.

## Deployment

Pushes to `main` deploy to production via Vercel's GitHub integration; pull requests get a
preview URL. GitHub Actions handles quality gates separately:

- `.github/workflows/ci.yml` — lint, typecheck and build on every push and PR.
- `.github/workflows/lighthouse.yml` — performance and accessibility budgets on PRs. Budgets are
  advisory (`warn`) while the motion work is tuned; tighten them to `error` in
  `.lighthouserc.json` once the numbers settle.

Recommended: protect `main` and require the CI job to pass before merging.
