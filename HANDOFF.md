# PayXen Handoff

## Project Snapshot
- Stack: `Next.js 16` + `TypeScript` + `Better Auth` + `Drizzle ORM` + `Neon Postgres`.
- Repo root for app: `auth/`
- Current local branch: `database`
- Remote: `origin https://github.com/pratyush4barik/payxen-02.git`

## Setup Commands
Run from `auth/`:

1. `npm ci`
2. `cp .env.example .env` (or PowerShell: `Copy-Item .env.example .env`)
3. Fill `.env` values
4. `npx drizzle-kit migrate`
5. `npm run dev`

Optional:
- `npm run setup` (installs + migrates)
- `npm run hooks:install` (enables auto-install post-merge hook)

## Required Env Vars
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL`

See: `.env.example`

## Auth + Session Architecture
- Better Auth server config: `lib/auth.ts`
  - Drizzle adapter wired
  - Google provider enabled
  - `emailAndPassword` enabled
- Auth route: `app/api/auth/[...all]/route.ts`
- Client auth API: `lib/auth-client.ts`
- Session guard helper: `lib/require-session.ts`

## Core Product Features Implemented

### 1) Dashboard (new UI shell)
- Uses shadcn `dashboard-01` shell with customized PayXen navigation.
- Main page: `app/dashboard/page.tsx`
- Sidebar components: `app/dashboard-01/app-sidebar.tsx`, `app/dashboard-01/site-header.tsx`
- Shows live data:
  - wallet balance
  - group count
  - group subscription count
  - subscription count
  - recent transactions

### 2) Shared Sidebar Across Authenticated Pages
- Sidebar open/collapse behavior (with top trigger) is enabled on:
  - `app/dashboard/page.tsx`
  - `app/wallet/page.tsx`
  - `app/groups/page.tsx`
  - `app/subscriptions/page.tsx`
  - `app/settings/page.tsx`
- `SiteHeader` supports per-page title props.

### 3) Wallet + Ledger
- Wallet page: `app/wallet/page.tsx`
- Server actions: `app/wallet/actions.ts`
- Features:
  - add money (escrow -> wallet)
  - withdraw money (wallet -> bank)
  - internal transfer by `px-id` only
  - requests placeholder box in transfer area
  - ledger status badges
  - pending withdrawal auto-switch to successful after ~5s
- Pending refresh helper: `app/wallet/pending-status-refresher.tsx`
- `px-id` copy icon button: `app/wallet/pxid-copy-button.tsx`
- QR code support: removed completely.

### 4) Groups / Subscriptions / Settings
- `app/groups/page.tsx` session-protected data view
- `app/subscriptions/page.tsx` personal subscriptions
- `app/settings/page.tsx` profile/accounts/sessions

## Database Schema Status
Main schema file: `db/schema.ts`

### Existing Auth Tables
- `user`, `account`, `session`, `verification`

### Fintech Tables
- `escrow_account`
- `wallet`
- `transactions`
- `subscriptions`
- `groups`
- `group_members`
- `group_subscriptions`
- `group_subscription_splits`
- `internal_transfers`

### Enums
- `transaction_type`
- `subscription_status`
- `group_member_role`
- `split_type`
- `internal_transfer_status`
- `transaction_status`

### Important fields added
- `wallet.px_id` unique (`px-...`)
- `transactions.status` (`PENDING` | `SUCCESSFUL`)

## Migrations
- `drizzle/0000_milky_blockbuster.sql`
- `drizzle/0001_far_angel.sql`
- `drizzle/0002_wooden_wind_dancer.sql`
- journal: `drizzle/meta/_journal.json`

Migration `0002` was applied successfully in this working session.

## Branding
- Product name: **PayXen** (old "SubWallet" references replaced).

## Routes Quick Map
- `/login`
- `/signup`
- `/dashboard`
- `/wallet`
- `/groups`
- `/subscriptions`
- `/settings`

## Current Uncommitted Local Changes
At handoff refresh time:
- `app/dashboard-01/site-header.tsx` (modified)
- `app/groups/page.tsx` (modified)
- `app/settings/page.tsx` (modified)
- `app/subscriptions/page.tsx` (modified)
- `app/wallet/actions.ts` (modified)
- `app/wallet/page.tsx` (modified)
- `db/schema.ts` (modified)
- `drizzle/meta/_journal.json` (modified)
- `HANDOFF.md` (new/untracked)
- `app/wallet/pending-status-refresher.tsx` (new)
- `app/wallet/pxid-copy-button.tsx` (new)
- `drizzle/0002_wooden_wind_dancer.sql` (new)
- `drizzle/meta/0002_snapshot.json` (new)

## Recommended Next Steps
1. Commit current local changes.
2. Push branch and/or push to `main`.
3. Add `db.transaction` wrappers for wallet money movement to improve consistency under concurrency.
4. Add tests for:
   - add money
   - withdraw pending -> success transition
   - transfer by `px-id`
