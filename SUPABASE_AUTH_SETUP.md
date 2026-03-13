## Supabase Auth Setup

The app now includes Google sign-in and email magic-link sign-in through [`supabase-auth.js`](./supabase-auth.js).

### Supabase settings

In Supabase Dashboard -> Authentication -> URL Configuration:

- Site URL:
  - `https://your-vercel-domain.vercel.app`
- Redirect URLs:
  - `https://your-vercel-domain.vercel.app/auth/callback.html`
  - `http://localhost:3000/auth/callback.html`
  - add your custom domain callback too if you use one

### Google provider

In Google Cloud Console -> OAuth client:

- Authorized JavaScript origins:
  - `https://your-vercel-domain.vercel.app`
  - `http://localhost:3000`
- Authorized redirect URIs:
  - `https://jsetqmbxhdfmssulelws.supabase.co/auth/v1/callback`

Then paste the Google client ID and client secret into:

- Supabase Dashboard -> Authentication -> Providers -> Google

### Email provider

In Supabase Dashboard -> Authentication -> Providers -> Email:

- enable Email
- enable Magic Link

### Current app flow

- Google uses OAuth and returns to [`auth/callback.html`](./auth/callback.html)
- Email sends a magic link and returns to the same callback page
- The callback page restores the user to the page they started from

### Frontend behavior

- topbar pages get a `Sign In` button in the nav
- library pages without a topbar get a floating auth button
- signed-in users see their email and a sign-out button
