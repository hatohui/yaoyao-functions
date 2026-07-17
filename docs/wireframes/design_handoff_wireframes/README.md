# Handoff: YaoYao Dinner — Wireframes

## Overview
Low-fidelity wireframes mapping out the full YaoYao Dinner app: guest-facing flows (landing, PIN-gated tables, ordering, feedback) and admin flows (events, tables, food catalog, stats, floor-plan map). Covers the "New since last sync" specs additions too: optimistic UI, debounced search, pagination, deep links w/ OG previews, AI-assisted translation, and the floor-plan map.

## About the Design Files
The bundled file (`Wireframes.dc.html`) is an **HTML design reference** — a wireframe prototype, not production code. Do not copy its markup/CSS into the app. The task is to **recreate the structure and flows shown here inside the existing `yaoyaodinner` codebase** (Vite + React + TypeScript + Tailwind + shadcn/ui on the frontend, NestJS on the backend), following the conventions already in that repo (see `CLAUDE.md` and `specs.md` at the repo root).

## Fidelity
**Low-fidelity.** These are structural wireframes (sketchy b&w + purple annotations, placeholder photos, hand-drawn style) meant to nail down layout, information hierarchy, and flow — not final colors/typography/spacing. For actual visual styling, use the app's **existing design system**:
- Tailwind semantic tokens already defined in `frontend/src/global.css` (`bg-primary`, `bg-card`, `text-muted-foreground`, etc.) — purple hue ~305, light/dark variants already wired up.
- Existing shadcn components in `frontend/src/components/ui/*` (button, card, dialog, alert-dialog, input, tabs, pagination, select, etc.) — reuse these rather than building new primitives.
- `lucide-react` for all icons (wireframes use emoji as placeholders only — replace with real lucide icons, e.g. 🔍→`Search`, 🔗→`Link`, ✕→`X`, ☰→`Menu`, ✎→`Pencil`).
- Radii from the existing `--radius` scale (`rounded-2xl`, `rounded-full`, etc.), soft shadows, generous spacing — per the Apple-like soft/rounded direction in `specs.md`.

## Screens / Views
All ids reference `<div id="…">` anchors inside `Wireframes.dc.html` (open it and jump to `#1a`, `#2c`, etc). Grouped by turn:

### Turn 1 — Core flows
- **1a/1b** Landing (mobile/desktop): full-bleed looping `banner.mp4` hero with dark overlay; top nav overlay = site title, "Menu" and "Tables" links, language + theme toggles. No PIN on this screen — Menu is public.
- **1c** PIN unlock (mobile, dedicated screen): reached by tapping "Tables". 4–6 digit PIN boxes, "Unlock" CTA, note that it's saved to localStorage after first entry.
- **1d** Table/person search (mobile): debounced search bar, paginated list of tables with occupancy chip.
- **1e** Table roster (mobile): people chips (remove via confirm modal), inline fast-add input (press Enter → optimistic add, focus jumps to fresh input).
- **1f** Menu (mobile): category chips, multi-select checkboxes per item, sticky bottom bar ("N selected — Add to order") appears once ≥1 selected.
- **1g** Food detail (mobile, deep link): photo, description (translated), variant pills, price, "Add to order".
- **1h** Order/cart (mobile): order line items w/ split tag, edit/remove, running table total + "your share".
- **1i** Feedback wall (mobile): name (optional) + text post form, scrollable wall of past feedback.
- **1j** Hidden admin gate: tap logo ×5 → passphrase field appears inline.
- **1k** Admin dashboard (desktop): sidebar nav (Events/Tables/People/Food/Presets/Stats/Feedback), current PIN + "Publish new event" (confirm modal), stat cards (tables/occupied/people/orders), past-events list.
- **1l** Admin tables (desktop): search, "+ Create table", "+ Bulk create ×N", multi-select checkboxes on table cards → batch delete/reassign bar.
- **1m** Admin food catalog (desktop spreadsheet): inline-editable cells (name/price/availability/translations), debounced autosave, row multi-select → bulk toggle availability/delete.
- **1n** Cross-event stats (desktop): this-event vs all-time toggle, popular-items bar chart, per-table totals with outlier flag.
- **1o** People list + notes (desktop): searchable/paginated table of people with table assignment, order summary, personal note.

### Turn 2 — New specs additions
- **2a** Admin floor-plan map (desktop): drag table markers onto a canvas (optional restaurant photo underlay); position autosaves optimistically. Needs `Table.x`/`Table.y`.
- **2b** Guest floor-plan map (mobile): same map, read-only; tap a marker to open that table's page — an alternative to the search bar.
- **2c** AI-translation panel (desktop): compact spreadsheet (name/price/i18n status) on the left; clicking a row opens a **side detail panel** on the right showing per-locale (VI/ZH/TH) fields, each starting as "⟳ generating…" then becoming a normal editable cell once the background Gemini call resolves. Source locale is whatever the admin's UI is currently set to.
- **2d** Deep-link previews: chat-bubble mockups showing OG/Twitter-card previews for a table link (PIN-gated, note visible in preview) and a food link (public, no PIN).

### Turn 3 — Desktop split-views, modals, tabbed table detail
- **3a** Table search + detail (desktop): list pane left, selected table's roster/add-person/total right pane.
- **3b** Menu + cart (desktop): menu w/ multi-select left, live order cart right pane with running total + your share.
- **3c** Food detail (desktop): photo left, info right, includes public-link note.
- **3d** Generic destructive confirm modal (centered dialog, desktop pattern).
- **3e** Publish-new-event confirm modal (explains the reset explicitly, per spec's safety requirement).
- **3f** Bulk-create-tables modal (count + capacity fields, auto-naming note).
- **3g** Split-cost picker modal (Just me / Whole table (default) / Choose people… w/ chip multi-select).
- **3h/3i/3j** Table detail (mobile, **tabbed**: People / Orders / Your split):
  - 3h = Orders tab (default) — each order line tagged **Shared** or **Personal**, not just names.
  - 3i = People tab — roster + fast-add.
  - 3j = Your split tab — "who am I" picker, shows only the current guest's own line items and total owed (not a full per-person breakdown of everyone).

### Turn 4 — Remaining mobile/desktop counterparts
- **4a/4b** PIN unlock (desktop), feedback wall (desktop split: post form + wall grid).
- **4c–4g** Mobile versions of the 5 admin desktop screens (dashboard, tables, food catalog, stats, people+notes) — sidebar replaced by a `☰` menu + bottom tab bar, grids collapse to stacked cards.
- **4h/4i** Mobile bottom-sheet variants of the destructive-confirm and split-cost modals (slide up from bottom, rounded top corners only, per mobile modal convention).

## Interactions & Behavior (from `specs.md`, apply throughout)
- **Optimistic UI everywhere**: add/remove person, add/edit/remove order, availability toggle, etc. update instantly client-side; API call runs in background; roll back with a visible indication on failure.
- **Debounced search**: table/person search (1d/3a), people search (1o/4g), food catalog inline edits (1m/2c) — never fire per keystroke.
- **Pagination as default** for any growing list: tables, people, orders, feedback wall, food catalog rows, past events. Never render unbounded.
- **Multi-select everywhere it saves clicks**: table lists, people lists, order lists, food catalog rows, menu items — batch actions in one call.
- **Destructive actions** always go through a confirm modal (3d/3e/3f, 4h) — no bare delete buttons.
- **Deep links**: every table and every food/variant has a stable shareable URL (2d). Table links require the PIN (auto-filled from localStorage if already entered); food links are fully public. Both render OG/Twitter-card metadata.
- **AI translation**: saving a food/category in the admin's current locale kicks off a background Gemini call to fill the other 3 locales; UI shows a pending state (2c) then normal editable cells once each lands.

## State Management
- PIN + theme + language preference persisted in localStorage (guest-side).
- Guest identity is self-asserted by name, no accounts.
- Admin session gated by a single hardcoded passphrase (easter-egg style, not a real auth boundary).
- Table roster, orders, and floor-plan positions all need optimistic local state with server reconciliation/rollback.

## Design Tokens
Do not invent new tokens — pull directly from `frontend/src/global.css` (already purple, hue ~305, light + dark variants defined): `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar*`, and the `--radius` scale. See `specs.md`'s "Theme" section for the full ruleset (semantic Tailwind classes only, no hardcoded hex/oklch in components).

## Assets
No real assets used — all photos/video/floor-plan backgrounds are striped placeholder rectangles labeled with what should be dropped in (e.g. "food photo", "banner.mp4 — looping hero video (already in codebase)", "restaurant floor photo/plan (optional bg)"). The hero video (`banner.mp4`) already exists in the codebase per `frontend/src/pages/page.tsx`.

## Files
- `Wireframes.dc.html` — the full wireframe set (open in a browser; all turns/screens are on one pannable/zoomable canvas).
- Reference `yaoyaodinner/specs.md` (pasted into this conversation) for the complete product spec, user stories, and schema gaps this design is built against.
