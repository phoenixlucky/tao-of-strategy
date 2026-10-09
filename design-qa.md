# Design QA

- Source visual truth: `C:\Users\Administrator\.codex\attachments\cd6aceca-1f30-4b9f-922f-cda28ae0d7b2\image-1.png` (1672 × 941 px).
- Intended route and state: project homepage, first load, desktop viewport.
- Intended comparison viewport: 1672 × 941 CSS px.
- Implementation screenshot: unavailable; no implementation pixel dimensions or density normalization are available.
- Full-view comparison: not performed because the local implementation could not be opened in the Codex in-app browser.
- Focused-region comparison: not performed for the same reason.

## Required fidelity surfaces

- Typography: the supplied QiuWan font is subsetted to 9,477 glyphs (4.4 MB), all source-supported characters used by project text are covered, and the shared site font token now applies it across regular page text; its rendered appearance still needs visual confirmation.
- Spacing and layout rhythm: not visually verifiable without a rendered capture.
- Colors and visual tokens: source reviewed; implementation appearance not visually verifiable.
- Image quality and asset fidelity: the supplied hero landscape, framed quote panel, paper mountains, cloud divider, red seal and cropped icon set were inspected as WebP assets; in-page crop and blending are not visually verifiable.
- Copy and content: source markup retains the page's existing quote and filter content.
- Responsive layout and interactive states: not visually verifiable.

## Findings

- [P1] Rendered comparison is blocked. The Codex browser denied access to the local preview because the admin-enforced browser policy could not be verified. This prevents checking desktop/mobile layout, in-page asset placement, and the visible quote/filter states. Fix: restore authorized in-app browser access, capture the homepage at the source viewport, compare full view and focused regions, then repair any P0–P2 findings.

## Comparison history

- Pass 1: source image reviewed; rendered page capture blocked by the browser policy. No visual fixes can be grounded in an implementation screenshot yet.
- Pass 2: restarted the local preview and retried the Codex in-app browser; the same admin-enforced policy check denied access.
- Pass 3: verified the current workspace and assets, restarted the preview, and retried the in-app browser. The admin-enforced policy still cannot be verified and denies access; no screenshot or visual comparison is available.
- Pass 4: integrated the user's supplied landscape and decorative sheets, cropped the illustrated icons into `public/assets/icons/`, keyed the paper mountain cutout for transparency, and retried the in-app browser after restarting the preview. The same admin-enforced policy denied access, so rendered comparison remains unavailable.
- Pass 5: tightened the crop for the scroll icon and retried the same local homepage preview. The in-app browser again denied access because its admin-enforced policy could not be verified; no rendered comparison is available.
- Pass 6: added the supplied QiuWan typeface as a local WOFF subset, applied it to the hero title and quote headings, and documented how to keep the subset current. The subset covers every character supported by the source font that is used in project text. Rendered typography still needs browser verification.
- Pass 7: after the user's feedback that only some text changed, promoted QiuWan to the shared `--font-site` token used by the body and all explicit Chinese text font declarations. Only code blocks retain their monospace font rule. Static font coverage and CSS references were checked; the visible result awaits preview confirmation.
- Pass 8: the user reported local navigation 404s. Replaced the preview process with a loopback-only route alias that serves both `/` and `/tao-of-strategy/`; server logs confirm prefixed people pages and CSS now return 200. The Codex browser capture policy still prevents an implementation screenshot for comparison.
- Pass 9: fixed the paper mountain layers to the viewport so `cover` scales against the screen instead of the full document height. Static navigation audit confirms seven matching entries across all six required files; daily/random/reset/filter/pagination handlers remain present. Rendered crop and responsive behavior still need visual confirmation.
- Pass 10: extended only the loopback preview server to render frontmatter Markdown through the shared layout. Route checks returned 200 for the homepage, comparison, about, overview, a topic page, a person page, the shared stylesheet and the local font. The agent screenshot capture remains blocked by browser policy.
- Pass 11: reviewed the user's 671 × 884 mobile preview screenshot. The daily quote artwork competed with the quote text, and the topic chips felt generic. Added an 82% parchment wash over the banner, restyled chips with a restrained vermilion edge, and removed the tiny seal illustration from each chip. The updated stylesheet and script both return 200; the preview is open for a post-refresh visual check.
- Pass 12: the user's follow-up screenshot confirmed the banner wash was too strong. Reduced it from 82% to 65% so more landscape detail remains visible. Reworked tags into warmer, larger rounded chips with a vermilion hash mark. Updated CSS and JS return 200; post-refresh appearance still needs the user's visual check.
- Pass 13: screenshots from the comparison page, a person page and the about page showed that tag chips still varied by page. Unified homepage and comparison tags under one warm-paper chip style and styled inline tag code in Markdown label rows to match; code blocks remain monospace. Updated CSS selectors are limited to emphasized Markdown rows containing inline code.
- Pass 14: final static audit confirms `public/assets/images` and `public/assets/icons` contain only WebP files, `_config.yml` and `.gitignore` do not exclude `public`, all six required navigation files contain the same seven entries, and the existing daily/random/filter/reset/pagination handlers remain in the homepage script. Preview routes for home, comparison, about, a person page, CSS and JS all return 200. A fresh screenshot after the latest shared-tag change is still needed for visual sign-off.

## Implementation checklist

- Re-run full-view and focused-region comparison at 1672 × 941.
- Capture at least one narrow viewport and verify navigation wrapping and card readability.
- Exercise face/person/tag filters, random quote, reset, pagination, and daily quote display in the browser.

final result: awaiting post-refresh visual verification
