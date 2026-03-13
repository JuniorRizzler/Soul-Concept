## Supabase Setup

The browser client now loads from [`supabase-client.js`](./supabase-client.js) using [`supabase-config.json`](./supabase-config.json).

### What is already connected

- Frontend pages load the shared Supabase runtime.
- The runtime creates `window.scSupabaseClient`.
- Existing API routes already use Supabase for push subscription storage.

### Frontend usage

```js
const client = await window.scSupabaseReady()
const session = await client.auth.getSession()
```

Helpers exposed globally:

- `window.scSupabaseReady()`
- `window.scGetSupabaseClient()`
- `window.scSupabaseClient`

### Vercel env vars required for server routes

Add these in Vercel Project Settings -> Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Use the same project URL as `supabase-config.json`.

### SQL already included

Run [`supabase/push_subscriptions.sql`](./supabase/push_subscriptions.sql) in Supabase SQL Editor.

### Current public config file

`supabase-config.json` contains:

- project URL
- anon/publishable key

This is safe for the browser client. Do not put the service role key in that file.
