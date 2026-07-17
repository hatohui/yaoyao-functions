# YaoYao Dinner — Specs

A stats-and-planner tool for one restaurant's private, invite-only dinner events — table arrangement, free-form seating, per-person food ordering with flexible cost splitting, and cross-event admin stats. Not a POS, not a kitchen ticketing system, no payments processing, no guest accounts/logins.

## Theme

- Reuse the existing purple theme in `frontend/src/global.css` — `--primary` (oklch, hue ~305). No new palette colors.
- Semantic Tailwind tokens only (`bg-primary`, `text-muted-foreground`, `bg-accent`, `border-border`, etc.) — never hardcoded hex/oklch/rgb or raw Tailwind palette classes.
- Brand-specific utilities go through `@theme inline` in `global.css` as CSS variables (e.g. `bg-brand-muted`), not inline styles.
- Icons: `lucide-react` exclusively. No inline SVG, no SVG data URIs.
- Light/dark mode toggle, available to everyone — same purple palette/CSS variables under both, just the light vs. dark variants already defined in `global.css`.
- Stick to the existing token set in `global.css` (`background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1..5`, `sidebar*`) — don't introduce new _variables_ or reach for raw Tailwind palette colors in components. The exact oklch values behind each token **can be tuned** (lightness/chroma for contrast, spacing between surfaces, etc.) — but every one of them must stay on the purple hue (~305), since that's YaoYao's color. Adjusting shade is fine; drifting off-hue to a different color family is not.
- `primary` (purple) is the accent and must read as such — CTAs, active/selected states, links, and key highlights use `bg-primary`/`text-primary`/`border-primary` (or `accent` for secondary emphasis), not muted/neutral tones. The purple should be visibly the brand color, not an incidental detail.
- Surfaces must be visually distinct: page background (`bg-background`) vs. card/panel surfaces (`bg-card`) vs. popovers (`bg-popover`) are different tokens for a reason — a card sitting on the page background must be legible as a separate surface, not blend in.
- Keep it simple: don't mix in `chart-*` tokens outside of actual charts/stat visuals, and don't reach for `secondary`/`muted`/`accent` interchangeably — each token has one job (see `frontend/src/global.css` for what each is wired to). Prioritize contrast and clarity over decoration.
- **Multi-select everywhere it saves clicks** — this is a maximum-UX priority, not an afterthou/ght. Any list of rows (admin spreadsheet views, people lists, order lists, table lists) supports selecting multiple items and acting on them in one batch. Food ordering supports selecting several menu items at once and adding them all in a single action, rather than one add-flow per item.
- Destructive actions (remove person, delete order, delete table, end event) always go through a confirm modal — no bare delete buttons.
- Visual style is soft and rounded — Apple-like: generous corner radii (use the existing `--radius`/`rounded-*` scale in `global.css`, don't hardcode radius values), soft shadows/elevation over hard borders where possible, comfortable spacing. Avoid sharp corners and dense/cramped layouts.
- **Mobile-first, fully responsive.** Guests will overwhelmingly be on phones (scanning a PIN, ordering at the table); admin may use either. Every screen must work well at phone width — touch-sized tap targets, no horizontal scrolling, no desktop-only interactions (hover-only affordances need a mobile-usable equivalent).
- **Optimistic rendering everywhere.** Add/remove a person, add/edit/remove an order, toggle availability, etc. — the UI updates instantly on interaction, the API call happens in the background, and it rolls back with a clear indication if the request actually fails. Nothing should feel like it's waiting on a network round-trip.
- **Search is debounced**, not fired on every keystroke — applies to the table/people search bar and any other free-text filter.
- **Pagination is the default for any list that can grow** (people, tables, orders, feedback wall, food catalog rows, past events) — never render an unbounded list in one shot.

## Tone & Copy

- This is a personal/private event tool, not a storefront. No marketing language, no upsell/CTA copy ("Check out our store!", "Order now!", promo banners), no commercial framing anywhere.
- All copy should be plainly informational: state what something is or what an action does, nothing more.
- Prices are playful, not real money — denominated in a made-up unit set by the admin (e.g. "5 pats"), not RM/currency. This reinforces that the app tracks fun, not payments.

## Engineering Conventions

### React / Frontend

- Components stay small and single-purpose. Extract early rather than letting a component grow.
- `page.tsx` is thin — it wires hooks to components and renders. Target **60–80 lines per page file**; if it's growing past that, pull pieces into `@ComponentName.tsx` files co-located in the same folder (per `CLAUDE.md`).
- All logic (data fetching, derived state, handlers) lives in hooks, not inline in JSX-returning components. A page/component reads as: call hooks, get values, render markup.
- Use `layout.tsx` for anything actually shared across a route subtree (nav chrome, providers) instead of repeating it per page.
- No comments that just restate what the code does. Only a comment when the _why_ isn't obvious from the code itself (per `CLAUDE.md`'s "no inline comments unless the reason is non-obvious").
- No `any`, no ad-hoc/duplicated type definitions for shapes the backend already defines. Use the Prisma-generated types (or the orval-generated API types under `frontend/src/api/`, per `CLAUDE.md`) — don't hand-roll parallel interfaces for the same data.

### Backend

- Follow the existing NestJS module structure/conventions already in `backend/src/modules/*` — controller/service/module per feature, same shape as what's there.
- Keep it clean: no duplicated logic between modules. Shared logic (helpers, guards, DTOs, formatting) belongs in a common/shared location, not copy-pasted per module.

### General

- No duplicated code anywhere, frontend or backend — if the same logic appears twice, extract it to `utils`/`common` and import it.

## Roles & Access Model

- **Host/Admin** — a single hardcoded secret (e.g. an admin passphrase/env secret), not a user account. There's no multi-admin concept and no username/password row per operator.
- Admin entry is hidden, not a visible "Login" link — clicking the site's icon/logo 5 times in quick succession reveals a passphrase/PIN entry section. This app doesn't need real security; it's an easter-egg-style gate, not an auth boundary.
- **Guest** — no account at all. Access is via a **per-event PIN**: entering the PIN unlocks that event's table list, arrangement, and ordering. Menu + pricing are public and need no PIN.
- The PIN is saved client-side (localStorage) once entered, so a guest only enters it once per device/browser, not on every visit.
- Identity within an event is self-asserted by name — this is a private, invite-only guest list, so low-friction beats verification.
- `Table.tableLeaderId` is kept but purely informational — shown as a badge/label for "who's hosting this table," grants no extra permissions. Anyone can still add people to any table.
- No live sync (websockets/polling) — guests refresh/reopen to see other people's changes. Simpler request/response model throughout.
- `Table.capacity` is a hard cap — adding a person to a full table is rejected, not just warned.
- The `Account` model (and its login/register flow) is no longer needed anywhere — neither guests nor the admin use it — and should be dropped, along with the fields that reference it (`People.accountId`, `Feedback.by`/`account` relation). Feedback attribution, if kept, becomes a free-text name instead of an account link.

### Sharing & Deep Links

- Every table has its own shareable URL that opens directly to that table's page. Since tables sit behind the event PIN, opening the link still requires the PIN (auto-filled from localStorage if already entered on that device) before landing on the table — it's a deep link past the search step, not a bypass of access.
- Every food/variant has its own shareable URL that opens directly to that item's page. The menu is already public, so this link needs no PIN at all.
- Both link types render proper link-preview metadata (Open Graph/Twitter card tags — title, description, image where available) so pasting the link into a chat app shows a real preview, not a bare URL. Metadata follows the Tone & Copy rules — informational, not promotional.

### Events

- An **Event** is an admin-only concept — guests never see an event list, switcher, or history. From a guest's point of view, "publishing a new event" just looks like the tables/orders were reset to empty.
- Tables can be created ahead of time as **staged** (`Table.isStaging`, already in the schema) while the current event is still live for guests — the admin can set up next event's floor plan/tables in advance without disrupting the ongoing one.
- Publishing a new event is what promotes the full staged set to live, all-or-nothing: it swaps the current live table set out for whatever's staged, generates a fresh PIN, and gives guests a clean slate. Staged tables aren't published/replaced individually — it's one atomic action tied to publishing the event.
- Past events' data (tables, people, orders) is retained, not deleted — it feeds admin-facing cross-event stats (e.g. all-time popular items).
- ⚠ Schema gap: `Table`, `People`, `Order` need an `eventId` FK; none exists today, so every table/order currently lives in one undifferentiated pool forever.

## Known schema/API gaps

- `table` and `people` controllers are GET-only today — no create/update/delete endpoints. ⚠ needed throughout section 1 & 2.
- No `Event` model, so nothing is scoped to "this event" vs. "all time" yet. ⚠ needed throughout.
- `Order.orderedBy` is a single nullable FK — can only express "this one person" or "shared by everyone at the table." Splitting a dish across an arbitrary subset (e.g. 3 of 6 people) needs a join table (`OrderSplit`: orderId, personId) instead. ⚠ schema change needed for section 2.
- No PIN/event-access mechanism exists yet (no `Event.pin`, no guest-side auth-by-PIN flow). ⚠ needed for guest access entirely.
- `PresetMenu` exists (fixed price + fixed set of `FoodVariant`s) but nothing ties a preset menu to a table or event as its "assigned template." ⚠ needed for template-menu story.
- `FoodVariant.currency` is not real-world currency — this is a fun/playful event, and prices are denominated in a made-up unit (e.g. "5 pats" instead of "5 RM"). Keep the field and just render its value verbatim as the price suffix; admin can set it to whatever string they want per food/event, no ISO-currency logic needed.
- No AI translation integration exists yet — needs a Google AI (Gemini) API call triggered on food/category create-or-edit, running in the background (queue/job, not inline with the save request), writing into the existing `FoodTranslation`/`CategoryTranslation`/`FoodVariantTranslation` tables for the locales the admin didn't type directly. The source language is whatever locale the admin's UI is currently set to when they type the name/description — not a fixed "always English" source — so the AI call needs to translate _from_ that locale _into_ the other three.
- No spatial layout data exists — `Table` has no x/y position, and no floor-plan/background-image concept. ⚠ needed for the floor-plan story below.
- `Table.isStaging` already exists in the schema and is exactly the field this needs — but nothing uses it: no create endpoint sets it, and there's no "publish event" action that atomically flips staged tables to live and archives the previously-live ones. That swap logic is entirely new. ⚠ needed for the staging stories in section 1

## User Stories

### 1. Admin — Events & Tables

- As the admin, I can create tables **staged** (not live yet) while the current event is still running for guests, so I can set up the next event's tables in advance without disrupting what guests currently see. ⚠ no `POST /table`, though `Table.isStaging` already exists in the schema
- As the admin, I can publish a new event (confirm modal — "this resets what guests see"), which atomically swaps the current live table set for whatever's staged, auto-generates a fresh PIN, and presents guests with that table set, so I can start a new dinner night on tables I already prepared, without old data leaking in or an accidental mid-event reset. ⚠ no `Event` model, no staged-to-live swap logic
- As the admin, I can see the PIN for the currently published event, so I can share it with invitees.
- As the admin, I can create a table with a name/number and capacity, so guests have somewhere to seat themselves. ⚠ no `POST /table`
- As the admin, I can mass-create tables in one action (e.g. "create 10 staged tables of capacity 8"), so I don't have to set up seating one table at a time for a big event — created tables are auto-numbered (e.g. "Table 1", "Table 2", ...) and I can rename any of them afterward. ⚠ no bulk `POST /table`
- As the admin (or anyone adding people to a table, including guests during the event), I get a fast inline add flow: type a name, press Enter to add and instantly see them appear (optimistic UI, API call happens in the background), and focus jumps to a fresh input so I can keep typing the next name without touching the mouse. No separate bulk-import screen — this single fast-add interaction _is_ how mass seating gets set up, one table at a time, by whoever's hosting it. ⚠ no `POST /people`, needs optimistic-update handling client-side
- As the admin, I can browse a list of past events and drill into one to see that specific night's tables, orders, and stats in isolation — not just the all-time aggregate. ⚠ needs `Event` model + an admin-only events list endpoint
- As the admin, I can select multiple tables (or multiple people, in the people list) via checkboxes and delete/reassign them in one batch action (confirm modal), instead of repeating the action per row.
- As the admin, I can assign **one** template (preset) menu to the whole event (exactly one per event, not a choice of several), so every table starts with the same fixed set of items/price by default. A table can only add extra items on top of the template — it can never remove or override what the template includes. ⚠ no link between `PresetMenu` and `Event`
- As the admin, I can see the total number of tables and how many are occupied vs. empty, so I know capacity at a glance.
- As the admin, I can delete a table (confirm modal), so I can undo a setup mistake before guests join.
- As the admin, I can drag tables onto a floor-plan canvas (optionally over a background image of the restaurant) to freely position them, matching the real physical layout — positions save automatically as I drag (optimistic, debounced). ⚠ needs `Table.x`/`Table.y` (or similar) and a canvas UI

### 2. Guest — Joining & Table Arrangement

- As a guest, after entering the event PIN, I land on a search bar where I can look up a table by name or a person by name, so I can quickly find where I'm sitting or who I'm with.
- As a guest, I can type my own name to add myself to any table (no login, no pre-seeding required), so joining has zero friction for a private invite-only crowd.
- As a guest, I can add other people (by name) to any table — not just my own — so a friend can seat someone on my behalf. ⚠ no `POST /people`
- As a guest, I can view a table's roster (who's seated there) via the existing `GET /table/:id/people`.
- As a guest, I can remove a person from a table (confirm modal), so mistakes are correctable — this is intentionally unrestricted, matching the "freedom" access model.
- As a guest, I can copy/share a direct link to my table, so I can send it to someone instead of them re-searching for it after entering the PIN. ⚠ needs a stable per-table route + OG metadata
- As a guest, I can view the same floor-plan map the admin arranged, tapping a table on it to open that table's page — a visual alternative to the search bar for finding where I'm sitting.

### 3. Guest — Menu & Ordering

- As a guest, I can browse the public menu (categories, foods, variants, prices, translated per my chosen language) without needing the event PIN.
- As a guest, I can open a specific food/variant's own page directly (deep link) and share that link with a preview (name, description, image) — no PIN needed since the menu is public. ⚠ needs a stable per-food route + OG metadata
- As a guest, I can view the event's template/preset menu if one is set — a curated bundle of existing food items, always present at every table and can't be removed, only added to. Foods in the bundle can also stand alone and be ordered individually outside the preset.
- As a guest, I can select multiple menu items at once (checkboxes/multi-select on the menu) and add them all to my table's order in a single action, rather than repeating the add-flow one item at a time.
- As a guest, I can add a food/variant to my table's order and tag it as: just for me, shared by the whole table (the default selection — fastest path for the common case), or split across a chosen subset of people at the table. ⚠ needs `OrderSplit` join table, current schema can't represent subsets
- As a guest, I can edit any order at my table in place — change quantity or who it's split between — without deleting and re-adding it, and remove it entirely (confirm modal for delete) via `DELETE /order/:id`. Not restricted to orders I personally added — matches the fully open, no-ownership access model used everywhere else. ⚠ needs `PATCH /order/:id`, currently only `POST`/`DELETE` exist
- As a guest, I can see my table's running total (sum of all orders' `price * quantity`).
- As a guest, I can see my personal cost: full price of items tagged just to me, plus my even share of every shared/subset item I'm included in.

### 4. Admin — Cross-Event Stats

- As the admin, I can see a people list with their table assignment and what they ordered, for the currently published event.
- As the admin, I can see the most popular food/variant ordered in the current event, so I can gauge kitchen prep/reorder priorities.
- As the admin, I can see the most popular items across all past events combined, so I can spot standing favorites over time. ⚠ needs `eventId` scoping to distinguish "this event" from "all events"
- As the admin, I can see per-table totals side by side within an event, so I can spot outlier tables (way over/under average spend).

### 5. Everyone — Personal Notes & Feedback

- As a guest, I can jot a personal note tied to myself (e.g. "can't eat shrimp") — this is public, visible to everyone, not private — surfaces the existing `PersonalNote` model.
- As the admin, I can see everyone's personal notes alongside the people list (section 4), so dietary/other notes are visible without hunting per person.
- As a guest, I can leave freeform, informal/for-fun feedback, typing my own name (free text, no account needed) or leaving it blank, scoped to the current event only. ⚠ `Feedback` needs `eventId`, and `by` becomes a free-text name field instead of an `Account` link
- As a guest, I can read a public wall of everyone's feedback for the current event — it's a shared fun board, not a private inbox.
- As a guest, I can react to any feedback entry with an emoji from a fixed set — the reaction is also the vote: the wall can be sorted by reaction count to surface the most-loved feedback. No login and no limit — anyone can react to the same entry as many times as they want, matching the low-friction, purely-for-fun nature of everything else here. ⚠ needs a new `FeedbackReaction` model (feedbackId, emoji, count or one-row-per-tap) and endpoints to add/list reactions
- As the admin, I can read all feedback submitted for a given event (including past events, via the event history view), sorted by reaction count same as guests see.

### 6. Everyone — Language

- As any user, I can switch the UI and menu language between the supported locales (en/vi/zh/th), and see food/category names and descriptions in that language, using the existing `Language`/translation tables.
- As any user, I can toggle light/dark mode, and my preference is remembered (localStorage), same as the PIN.

### 7. Admin — Food Management

- As the admin, I manage the food catalog (categories, foods, variants, prices, availability, translations) through a spreadsheet-style table view, not a series of modal forms.
- As the admin, editing a cell (price, name, availability toggle, etc.) saves inline and automatically — debounced, so rapid edits don't fire a request per keystroke — with no separate "Save" button.
- As the admin, I manage preset menus in a **separate spreadsheet-style view from the food catalog** — same inline-edit, debounced-autosave pattern as food management, but its own screen: rows are existing foods added into the bundle, not new food definitions.
- As the admin, I can select multiple rows in either spreadsheet (food catalog or preset menu) via checkboxes and bulk-toggle availability or bulk-delete them (confirm modal for delete), instead of editing row by row.
- As the admin, when I type a food/category's name and description in one language, the other three locales' translations are auto-generated in the background via a Google AI (Gemini) call — I don't have to type the same text four times. Generated translations land in the spreadsheet as normal editable cells, so I can review/correct them like anything else; nothing is auto-published without passing through the same inline-edit surface. ⚠ needs a backend integration with the Google AI API, and a background job/queue so the initial save isn't blocked waiting on it

### 8. Safety

- As any user performing a destructive action (delete order, remove person, delete table, publish a new event over an active one), I am shown a confirm modal describing exactly what will be removed/reset before it happens — no silent/one-click destructive actions anywhere in the app.
