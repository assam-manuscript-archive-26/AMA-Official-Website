# Assamese Manuscript Archive Website

## Project Overview

The Assamese Manuscript Archive Website is a digital heritage platform for Assamese Manuscript Archive - a cultural institution in Assam, India. The website serves as a digital archive for Assamese manuscript paintings, providing visitors with an interactive museum experience both at the physical location and online.

### Purpose

- Digital preservation of Assamese manuscript paintings
- Physical-to-digital access via QR codes placed in Sattras
- Multi-language audio descriptions (English, Hindi, Assamese)
- Admin content management system for updating the archive

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Astro** | 5.x | SSR framework with island architecture |
| **React** | 19.x | Interactive UI components (islands) |
| **TypeScript** | 5.9.x | Type-safe development |
| **Tailwind CSS** | 4.0 | Utility-first styling |
| **FrontQL** | v7 | Backend-as-a-service (database & API) |
| **Cloudflare Workers** | - | Edge deployment |
| **Lenis** | 1.3.x | Smooth scroll experience |
| **Framer Motion** | 12.x | Animation library for React |

### Base Template

This project uses the [Astro + React Islands + TypeScript + Tailwind v4.0 + FrontQL Template](file://../Astro%20+%20React%20Istands%20+%20TypeScript%20+%20Tailwind%20v4.0%20+%20FrontQL%20Template) as its foundation.

---

## FrontQL Database Configuration

The project uses the same database as the Artifex template: `s5_intern_database`

### Environment Variables (.env)

```env
PUBLIC_DATABASE=s5_intern_database
PUBLIC_BASE_URL=https://v7.frontql.dev
PUBLIC_FRONTQL_local_host=http://localhost:4466

PUBLIC_FILE_UPLOAD_URL=https://uploads.backendservices.in/api
PUBLIC_IMAGE_URL=https://uploads.backendservices.in/storage/
PUBLIC_FILE_UPLOAD_ID=your_upload_id
PUBLIC_FILE_UPLOAD_PASS=your_upload_password
```

### FrontQL Collections

The database contains the following collections (from Artifex template):

| Collection | Purpose |
|------------|---------|
| `artifex-users` | User authentication |
| `artifex-collections` | Gallery/collections data |
| `artifex-artifacts` | Individual paintings with metadata |
| `artifex-audio-player` | Audio descriptions (EN, HI, AS) |
| `artifex-feedback` | User feedback submissions |
| `artifex-questionnaire` | Visitor questionnaire & certificates |
| `artifex-visitors` | Visitor counter data |
| `artifex-visitors-history` | Visitor history tracking |
| `artifex-events` | Events management |
| `artifex-news` | News/bulletin posts |
| `artifex-contactUs` | Contact form submissions |

---

## Project Structure

```
Assamese Manuscript Archive Website/
├── src/
│   ├── backend/
│   │   ├── actions/          # FrontQL CRUD operations
│   │   │   ├── auth.js       # Authentication
│   │   │   ├── collections.js
│   │   │   ├── artifact.js
│   │   │   ├── player.js
│   │   │   ├── feedback.js
│   │   │   ├── questionnaire.js
│   │   │   ├── visitorApi.js
│   │   │   ├── events.js
│   │   │   ├── news.js
│   │   │   └── contact.js
│   │   └── apis/
│   │       ├── Api.ts        # FrontQL v7 API client
│   │       ├── server.js     # Local dev server
│   │       └── tokens.json   # Generated tokens
│   ├── components/
│   │   ├── astro/            # Astro components
│   │   │   ├── Navbar.astro
│   │   │   └── Footer.astro
│   │   ├── react/            # React island components
│   │   │   ├── hero/         # Hero sections
│   │   │   ├── navbar/       # Navigation
│   │   │   ├── sections/     # Page sections
│   │   │   └── Admin/        # Admin panel
│   │   ├── ui/               # UI primitives
│   │   └── common/           # Shared components
│   ├── layouts/              # Astro layouts
│   │   ├── BaseLayout.astro
│   │   ├── LandingLayout.astro
│   │   └── AdminLayout.astro
│   ├── pages/                # Astro routes
│   │   ├── index.astro       # Home
│   │   ├── collections.astro
│   │   ├── about.astro
│   │   ├── visit.astro
│   │   ├── events.astro
│   │   ├── news.astro
│   │   ├── feedback.astro
│   │   ├── audioplayer.astro
│   │   ├── qrcanner.astro
│   │   └── admin/
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities
│   └── globals.css           # Tailwind + custom styles
├── public/                   # Static assets
├── astro.config.mjs          # Astro configuration
├── wrangler.jsonc           # Cloudflare Workers config
└── package.json
```

---

## Features

### Public Features

| Feature | Description |
|---------|-------------|
| **Home Page** | Hero section, collections preview, latest news |
| **Collections Gallery** | Browse manuscript paintings with metadata |
| **Painting Detail** | High-res images, descriptions, audio player |
| **Audio Player** | Multi-language audio (English, Hindi, Assamese) |
| **QR Scanner** | Scan QR codes to access painting pages |
| **Search** | Advanced search by keywords, categories, artists |
| **Events** | Upcoming events and exhibitions |
| **News** | Latest news and bulletins |
| **Visit** | Visit planning information |
| **About** | About Assamese Manuscript Archive |
| **Feedback** | User feedback form |
| **Chatbot** | AI-powered real-time assistance |

### Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats overview (visitors, feedback, ratings) |
| **Collection Manager** | Manage gallery collections |
| **Artifact Manager** | Add/edit/delete paintings |
| **Audio Manager** | Upload audio descriptions |
| **Events Admin** | Manage events |
| **News Admin** | Manage news posts |
| **Feedback Admin** | View and manage feedback |
| **Contact Admin** | View contact submissions |
| **Visitor Counter** | Track visitor statistics |

---

## Porting from Artifex Template

This project ports features from [Artifex - Client MVP](file://../Artifex%20-%20Client%20MVP) to the Astro + React Islands architecture.

### Key Differences from Artifex

| Aspect | Artifex | This Project |
|--------|---------|--------------|
| Framework | React + Vite | Astro + React Islands |
| Routing | React Router | Astro file-based routing |
| API Client | FrontQL v5 | FrontQL v7 |
| Database URL | v5.frontql.dev | v7.frontql.dev |
| Deployment | Vercel | Cloudflare Workers |

### Actions to Port

All action modules from `Artifex - Client MVP/src/actions/` need to be recreated in `src/backend/actions/`:

- [users.js](file://../Artifex%20-%20Client%20MVP/src/actions/users.js) → `src/backend/actions/auth.js`
- [collections.js](file://../Artifex%20-%20Client%20MVP/src/actions/collections.js) → `src/backend/actions/collections.js`
- [artifact.js](file://../Artifex%20-%20Client%20MVP/src/actions/artifact.js) → `src/backend/actions/artifact.js`
- [player.js](file://../Artifex%20-%20Client%20MVP/src/actions/player.js) → `src/backend/actions/player.js`
- [feedback.js](file://../Artifex%20-%20Client%20MVP/src/actions/feedback.js)
- [questionnaire.js](file://../Artifex%20-%20Client%20MVP/src/actions/questionnaire.js)
- [visitorApi.js](file://../Artifex%20-%20Client%20MVP/src/actions/visitorApi.js)
- [events.js](file://../Artifex%20-%20Client%20MVP/src/actions/events.js)
- [news.js](file://../Artifex%20-%20Client%20MVP/src/actions/news.js)
- [contact.js](file://../Artifex%20-%20Client%20MVP/src/actions/contact.js)

---

## Client Requirements

From [Notes and Suggestions from Client.txt](file://../Client%20Assets/Notes%20and%20Suggestions%20from%20Client.txt):

1. **User-friendly website and mobile app** for digital archive access
2. **Photo gallery** with high-resolution images and metadata
3. **Audio descriptions** for each painting (English, Hindi, Assamese)
4. **QR codes** in Sattras for scanning to access digital content
5. **Advanced search** by keywords, categories, artists, time periods
6. **Chatbot integration** for real-time assistance
7. **Focus on Assamese manuscript paintings and Sattras** (not masks)

### Architecture Notes

The website follows the architecture from [WhatsApp Image analysis](file://../Client%20Assets/WhatsApp%20Image%202026-05-12%20at%2012.46.57%20PM.jpeg):

- **User Actors**: Browse paintings, scan QR, listen to audio, search, provide feedback, interact with chatbot
- **Admin Actors**: Upload/delete paintings, add audio notes, manage metadata
- **QR Workflow**: Physical painting → QR code → Digital page with image, metadata, audio

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env with PUBLIC_DATABASE=s5_intern_database

# Start local dev server (runs FrontQL token generator)
bun src/backend/apis/server.js

# Start Astro dev server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare Workers
npx wrangler deploy
```

---

## Key Components

### React Islands (client:load / client:visible)

Only interactive components load as React islands:
- Hero sections
- Navigation (desktop + mobile)
- Audio player
- QR Scanner
- Chatbot
- Search functionality
- Admin dashboard
- Forms (feedback, contact)

### Astro Components (Server-side rendered)

Static content rendered on server:
- Footer
- Navbar structure
- Page layouts
- SEO metadata

---

## Design Notes

### Theme

The website inherits its design from Artifex with Assamese Manuscript Archive branding:
- Color scheme: Traditional Assamese aesthetics
- Typography: Mix of traditional and modern
- Imagery: Assamese manuscript paintings, Sattras

### Content Focus

As per client requirements, the website focuses on:
- Assamese manuscript paintings (not masks)
- Sattras (monasteries) of Assam
- Historical and cultural significance
- Multi-language support (English, Hindi, Assamese)

---

## References

- [Astro + React Template README](../Astro%20+%20React%20Istands%20+%20TypeScript%20+%20Tailwind%20v4.0%20+%20FrontQL%20Template/README.md)
- [Artifex Client MVP package.json](../Artifex%20-%20Client%20MVP/package.json)
- [Client Requirements](../Client%20Assets/Notes%20and%20Suggestions%20from%20Client.txt)
- [FrontQL Documentation](https://frontql.dev)