# Shift Ready

Upgrade guides, integration docs, and library alternatives for the stack you already have.

## Setup

1. Create a Supabase project and enable Email auth.
2. Run `supabase/schema.sql` in the SQL editor. If the table already exists, also run `supabase/share.sql` for public share links.
3. Copy `.env.example` to `.env.local` and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SERPAPI_KEY=
```

4. Install and start:

```bash
npm install
npm run dev
```
