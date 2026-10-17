# Image prompts for the /hire pages

The hire pages pick these files up automatically. Drop them into `public/hire/<slug>/` and rebuild; a missing file simply hides its slot.

| File | Size | Where it shows |
| --- | --- | --- |
| `overview.webp` | 1184×896 | Beside "How to hire …", turns that section into two columns |
| `cta.png` (shared: `public/hire/cta.png`) | 1376×250 transparent PNG (cropped from 1376×768) | Bottom of the closing call-to-action band |
| `og.png` | 1200×630 (cropped from 1376×768) | Social share preview (Open Graph) |

Slugs: `hire-software-engineer-india`, `hire-react-nextjs-developer-india`, `hire-forward-deployed-engineer-india`.

**Style anchor (all images):** bright, airy, premium editorial 3D illustration. Soft sky-blue gradient (`#cbeeff` → `#85cef2`), deep ink blue `#1030ae` as the main accent, with small touches of green `#00a63b`, cyan `#00b3c2`, coral `#db334d`, orange `#e56c1d` and pink `#e05aa8`. Matte clay-like materials, soft studio lighting, gentle shadows, lots of white space. Calm and confident, never cheap or busy.

**Negative prompt (all):** text, letters, watermark, logo, human face, stock-photo look, clutter, dark background, neon, cyberpunk, glossy plastic, money, coins, price tags.

## hire-software-engineer-india
- **overview:** A single tidy desk floating on a sky-blue gradient: a laptop with a clean code editor, a coffee cup, a small potted plant, and three floating cards orbiting it (a UI wireframe, a server stack, a sparkle icon), soft clay 3D, ink-blue accents, generous negative space, 4:3.
- **cta:** A row of small floating clay objects rising from the bottom edge: a laptop, a rocket lifting off, a calendar with a tick, a chat bubble, a cloud with an upward arrow, colourful accents on soft sky blue, wide 21:9, objects on the lower third only.
- **og:** The overview desk scene, centred, sky-blue gradient, empty space on the left for a headline, 1200×630.

## hire-react-nextjs-developer-india
- **overview:** Floating clay UI pieces (a button, a card, a toggle, a navigation bar) snapping together into a polished interface, with a soft atom-style orbit ring behind, ink-blue and pink accents on sky blue, 4:3.
- **cta:** A finished app screen on a phone and a laptop side by side, with small sparkles and a speed gauge pointing high, wide 21:9, lower third.
- **og:** The assembled interface, centred, 1200×630.

## hire-forward-deployed-engineer-india
- **overview:** Two small clay islands joined by a bridge of glowing ink-blue nodes: one holds a product dashboard, the other a customer workspace with a whiteboard and sticky notes, a paper plane travelling across, 4:3.
- **cta:** The bridge scene from a wider angle, small colourful figures-as-shapes (no faces) crossing, wide 21:9, lower third.
- **og:** The two islands and bridge, centred, 1200×630.

## Already in use
- **Hero portrait:** `public/portrait.png` (transparent PNG). Keep it a cut-out with no background so it sits on the sky gradient.
