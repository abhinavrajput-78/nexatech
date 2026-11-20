# NexaTech — MERN IT company website

A full-stack, responsive IT company website starter using React, Vite, Express, MongoDB, and Mongoose. The site has dynamic service and portfolio pages, a contact workflow, and a protected content-management area.

> NexaTech and the included portfolio entries are starter content. Replace example contact details, sample content, and policies with your real company information before launch. This project does not claim real clients, certifications, or achievements.

## Features

- Public Home, About, Services, Service Details, Projects, Project Details, Contact, Privacy, Terms, and 404 pages
- Dynamic service and published project listing/detail pages backed by MongoDB
- Project category filters, search, and pagination
- Contact form with browser and server validation, rate limiting, database storage, and optional Gmail SMTP delivery
- HTTP-only cookie admin authentication with hashed passwords and server-side role checks
- Admin overview with recent enquiries and six-month enquiry analytics, service/project/testimonial CRUD, editable homepage content, and searchable/filterable enquiry review
- Advanced project enquiries with optional service, budget, and timeline, stored in MongoDB and included in Gmail notifications
- Responsive dark design, reduced-motion support, Framer Motion reveals, keyboard focus states, semantic forms, and page titles
- Premium typography using Google Fonts (**Outfit** for high-impact geometric headings and **Plus Jakarta Sans** for crisp body copy)
- Polished micro-interactions: glowing cyber gradients, floating badge reveals, glassmorphism card elevation, and smooth accordion animations
- Sample database seeding and secure initial-admin creation commands

## Technology

- React 19, React Router, Vite, Axios, Framer Motion, Lucide, React Hot Toast, Tailwind CSS
- Node.js 20+, Express 5, Mongoose, MongoDB
- Helmet, CORS allow-list, rate limits, JWT HTTP-only cookies, bcryptjs
- Nodemailer with Gmail SMTP (optional; requires your own Google App Password)

## Requirements

- Node.js 20 or newer and npm
- MongoDB local instance or MongoDB Atlas database
- Optional Gmail account with 2-Step Verification enabled for email delivery

## Install and configure

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env`. On PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Configure the backend settings:

   ```dotenv
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/nexatech
   CLIENT_URL=http://localhost:5173
   JWT_SECRET=super_secret_nexatech_jwt_key_change_in_production_min_32_characters
   EMAIL_USER=
   EMAIL_APP_PASSWORD=
   CONTACT_RECEIVER=
   ```

   Set `JWT_SECRET` to a long, random secret before enabling admin login. Keep all real values private. Never put backend secrets in Vite variables or commit `.env`.

4. Start both frontend and API:

   ```sh
   npm run dev
   ```

5. Open `http://localhost:5173`. The API is on `http://localhost:5000`; its status is available at `/api/health`.

If MongoDB is disconnected, public database-backed pages show an error and contact submissions return an unavailable response instead of claiming they were saved.

## MongoDB Atlas

Create a MongoDB Atlas cluster and database user, allow your development machine's IP in Network Access, and copy the application connection string into `MONGODB_URI` in `.env`. Replace the username, password, and database name with your own values. Do not share or commit the connection string.

## Example content

Seed the database with example service descriptions and explicitly illustrative portfolio concepts:

```sh
npm run seed
```

The seed command is idempotent for its sample slugs and refreshes its own starter records when rerun. Avoid editing those records in the admin UI if you plan to rerun the seeder.

## Initial administrator

There is no public admin registration route. In the project folder, run:

```sh
npm run create-admin
```

The interactive command requests the admin email, name, and a password of at least 12 characters. Password input is masked. It requires the `MONGODB_URI` in `.env`, hashes the password with bcrypt, and will not overwrite an existing account. For scripted deployments, you can instead supply `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` as environment variables; do not commit them.

Sign in at `/admin/login`. The admin session uses an HTTP-only, same-site cookie and expires after eight hours. `JWT_SECRET` and HTTPS must be configured in production.

## Gmail contact delivery

Email is optional. Without all three email settings, contact enquiries are saved in MongoDB with `emailStatus: "not_configured"`. If SMTP delivery fails, the enquiry remains saved with `emailStatus: "failed"` and the response does not claim email succeeded.

1. Enable 2-Step Verification on the Gmail/Google account used by the company.
2. In the Google Account security settings, create an App Password for this server/application (Google may limit App Password availability based on account policy).
3. Put the Gmail address in `EMAIL_USER`, the generated App Password in `EMAIL_APP_PASSWORD`, and the destination inbox in `CONTACT_RECEIVER` in the backend `.env`.
   Spaces in a Google App Password are removed automatically.
4. Restart the API after changing `.env`; settings are loaded when the server starts. Each enquiry is emailed to `CONTACT_RECEIVER`, and the person who submitted it receives a confirmation at the address they entered. The enquiry email uses that submitted address as its reply-to; the confirmation uses `CONTACT_RECEIVER` as its reply-to. Inspect the `emailStatus` in the admin enquiries page. If delivery fails, the API response distinguishes missing mail configuration from a sending failure, and the backend log records the SMTP error.

Use only an App Password when Google offers it; never use a regular account password. Do not expose these values to the browser or commit them.

## Admin area

- `/admin/login` — sign in
- `/admin/dashboard` — service, project, and enquiry counts
- `/admin/services` — add/edit/delete and activate/deactivate services
- `/admin/projects` — add/edit/delete and publish/unpublish projects
- `/admin/testimonials` — manage verified client testimonials; only published records appear on the homepage
- `/admin/content` — edit homepage hero/about copy and the company contact email
- `/admin/contacts` — review messages, check email status, update enquiry status, and delete enquiries

Server-side middleware protects every `/api/admin/*` route; hiding admin UI alone is not the security boundary. Content editors can enter arrays as one item per line and FAQs as a JSON array. Live demo and GitHub URLs must use HTTP or HTTPS.

## API reference

Public:

- `GET /api/health`
- `GET /api/services`
- `GET /api/services/:slug`
- `GET /api/content`
- `GET /api/testimonials`
- `GET /api/projects?page=1&limit=12&search=&category=`
- `GET /api/projects/categories`
- `GET /api/projects/:slug`
- `POST /api/contact` — `{ "name", "email", "subject", "message", "selectedService", "budget", "timeline" }`; budget and timeline are optional

Authentication:

- `POST /api/auth/login` — `{ "email", "password" }`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Admin (requires authenticated admin cookie):

- `GET /api/admin/dashboard`
- `GET|PUT /api/admin/content`
- `GET|POST /api/admin/testimonials`
- `PUT|DELETE /api/admin/testimonials/:id`
- `GET|POST /api/admin/services`
- `PUT|DELETE /api/admin/services/:id`
- `GET|POST /api/admin/projects`
- `PUT|DELETE /api/admin/projects/:id`
- `GET /api/admin/contacts?page=1&limit=20&search=&status=`
- `GET|DELETE /api/admin/contacts/:id`
- `PATCH /api/admin/contacts/:id/status` — `{ "status": "pending|contacted|resolved" }`

## Tests and build

```sh
npm test
npm run build
```

Route tests cover API health, contact validation and unavailable-database handling, login input validation, admin authorization, and unknown API routes.

Website content, testimonials, services, projects, and enquiries are stored in MongoDB. The homepage does not display placeholder testimonials; create and publish verified testimonials from the admin workspace. Seeded portfolio entries are explicitly illustrative starter concepts, not client results.

## Deployment

1. Build the frontend with `npm run build`.
2. Configure production environment values: `NODE_ENV=production`, `MONGODB_URI`, a long random `JWT_SECRET`, `CLIENT_URL` set to the deployed frontend origin, and optional Gmail SMTP settings.
3. Run `npm start`. In production, Express serves the built `dist` frontend and API.
4. Deploy behind HTTPS and restrict database network access. Set the production `CLIENT_URL` exactly; do not use a wildcard CORS origin with credentials.
5. Create the admin and seed desired starter data using the commands above. Replace example copy, policy text, company email, and concept portfolio content.

Starter Admin Credentials
Auto-fill
Email: admin@nexatech.internal
Password: Admin@NexaTech2026!
# nexatech
# nexatech
