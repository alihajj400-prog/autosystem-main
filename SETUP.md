# Autosystem — local setup

## 1. Environment

Copy `.env.example` to `.env` and fill in values from [Supabase Connect → API](https://supabase.com/dashboard/project/ikbvhpyaqnttfcrgwmjb/settings/api).

## 2. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## 3. Admin access

1. Sign up at `/auth`
2. Copy your user UUID from Supabase → Authentication → Users
3. Run `supabase/grant-admin.sql` in SQL Editor (replace `YOUR_USER_UUID`)
4. Sign out and back in → `/admin`

## 4. Database (already applied if using project ikbvhpyaqnttfcrgwmjb)

- Schema: `supabase/setup-all.sql`
- Sample inventory: `supabase/seed-sample-data.sql`

## 5. Build

```bash
npm run build
```
