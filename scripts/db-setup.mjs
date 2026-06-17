// One-time/idempotent schema setup for the Neon database.
// Run: node --env-file=.env.local scripts/db-setup.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/db-setup.mjs");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS subscribers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active',
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
  )`;

await sql`
  CREATE TABLE IF NOT EXISTS trip_inquiries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    trip TEXT NOT NULL,
    travelers TEXT,
    dates TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

await sql`
  CREATE TABLE IF NOT EXISTS orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL,
    subtotal_cents INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

// Stripe payment columns on orders (idempotent). Orders start 'unpaid'; the
// webhook flips them to 'paid' once Stripe confirms the Checkout Session.
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'unpaid'`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS amount_total_cents INTEGER`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ`;
await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session
  ON orders (stripe_session_id) WHERE stripe_session_id IS NOT NULL`;

// Checkout collects only the email up front now; Stripe Checkout collects the
// name, shipping address and phone, so those are optional on insert and filled
// in when the order is finalized. reminder_* tracks the abandoned-cart sequence.
await sql`ALTER TABLE orders ALTER COLUMN name DROP NOT NULL`;
await sql`ALTER TABLE orders ALTER COLUMN address DROP NOT NULL`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS reminder_stage INTEGER NOT NULL DEFAULT 0`;
await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS reminder_last_at TIMESTAMPTZ`;

// Lightweight per-IP request log backing the rate limiter on public POST routes.
await sql`
  CREATE TABLE IF NOT EXISTS request_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ip TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
await sql`
  CREATE INDEX IF NOT EXISTS request_log_lookup
  ON request_log (ip, action, created_at)`;

// El Paisa's autonomous desk: short posts the agent writes and publishes.
await sql`
  CREATE TABLE IF NOT EXISTS paisa_posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    link TEXT,
    dedupe_key TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'live',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
await sql`
  CREATE INDEX IF NOT EXISTS paisa_posts_recent
  ON paisa_posts (status, created_at DESC)`;

const tables = await sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name`;
console.log("Tables ready:", tables.map((t) => t.table_name).join(", "));
