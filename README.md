# Auto System S.A.L.

Website for **Auto System S.A.L.**, a Mazda dealership in Lebanon. The public site showcases used Mazda inventory, parts, and contact options. The admin area lets staff manage cars, parts, images, and customer inquiries.

**Live site:** [https://www.autosystemsal.com](https://www.autosystemsal.com)

## Features

- Vehicle inventory with search and filters
- Car detail pages with image gallery and contact form
- Parts catalog
- Admin dashboard for cars, parts, and contact requests
- Supabase authentication and storage for admin users

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/) (database, auth, storage)
- [Vercel](https://vercel.com/) (hosting)

## Local development

**Requirements:** Node.js 18+ and npm

```sh
git clone https://github.com/alihajj400-prog/autosystem-main.git
cd autosystem-main
npm install
cp .env.example .env
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

### Environment variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

These are the only variables required to run the website.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |

## Deployment

The site is deployed on Vercel. Pushes to `main` trigger automatic deployments.

Set the same Supabase environment variables in the Vercel project settings before deploying.

## Database setup

SQL migrations and setup scripts live in the `supabase/` folder. Run `supabase/setup-all.sql` on a new Supabase project to create tables, policies, and storage buckets.

Admin access is granted by adding an `admin` role in the `user_roles` table for an authenticated user (see `supabase/grant-admin.sql`).

## Project structure

```
src/
  components/   # UI and page components
  hooks/        # Data fetching and auth
  pages/        # Route pages (public + admin)
  integrations/ # Supabase client
  lib/          # Shared utilities and constants
supabase/       # SQL setup and migrations
```

## License

Private — © Auto System S.A.L.
