# 🏛️ Assamese Manuscript Archive Website

[![Astro](https://img.shields.io/badge/Astro-v5.17%2B-ff5d01.svg?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-v19.2%2B-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-Deploy-f38020.svg?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Database](https://img.shields.io/badge/FrontQL-v7-7f00ff.svg)](https://frontql.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.9%2B-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The **Assamese Manuscript Archive Website** is a state-of-the-art digital heritage platform built for the **Assamese Manuscript Archive**, a cultural institution in Majuli, Assam, India. Dedicated to the digital preservation and propagation of historical Assamese manuscript paintings, the platform bridges physical museum galleries and digital experiences. 

Through physical-to-digital QR code integrations in Sattras (monasteries), visitors can unlock high-resolution media galleries, multilingual audio guides, and interactive exhibitions on their mobile devices, while curators can seamlessly manage the archives from a secure dashboard.

---

## 🌟 Key Features

### 👥 Public Visitor Experience
*   **🖼️ High-Resolution Manuscript Gallery:** Visualizing delicate manuscript paintings with complete cultural, historical, and artistic metadata.
*   **🔊 Interactive Multilingual Audio Guide:** Immersive audio narratives available in **English, Hindi, and Assamese**, with a custom audio player UI.
*   **🔍 Floating Search Bar with Intelligent Suggestions:** A prominent search engine with auto-suggestions categorizing manuscripts by time period, artist, and Satra.
*   **📱 Edge QR Code Scanner:** Allows in-person museum visitors to scan physical QR codes adjacent to artifacts in Sattras to instantly view their detailed digital record.
*   **🤖 "Sukanya" AI Assistant:** An interactive cultural helper powered by Groq AI (`llama-3.1-8b-instant`) delivering context-aware assistance on Assamese Sattras.
*   **🛕 Majuli Introduction & Collections Carousel:** Beautiful storytelling layout celebrating Majuli as the spiritual heart of Assam, complete with auto-scrolling collections.

### 🔑 Curator & Admin Operations
*   **📈 Telemetry & Analytics Dashboard:** Key statistics tracking visitor footfall, feedback, and submission metrics.
*   **📦 Collection & Artifact Manager:** A secure portal for curators to upload high-resolution images, set metadata, generate QR links, and update archives.
*   **🎙️ Audio Upload Manager:** Effortless audio clip mapping for English, Hindi, and Assamese files corresponding to each painting.
*   **📅 Event & News Bulletins:** Systems to broadcast notifications regarding upcoming physical exhibitions, seminars, and news updates.
*   **📝 Feedback & Contact Hub:** Administration interface to review guest submissions and respond to inquiries.

---

## 🛠️ Technology Stack & Architecture

The application adopts the modern **Astro Island Architecture**, delivering lightning-fast static-site rendering (SSR) combined with isolated, high-performance interactive widgets where needed.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Astro](https://astro.build/) | `5.17.x` | Edge-side SSR & Routing |
| **Component Library** | [React](https://react.dev/) | `19.2.x` | Interactive client-side islands |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `4.0.0` | Utility-first responsive styling |
| **Backend-as-a-Service** | [FrontQL](https://frontql.dev/) | `v7` | Distributed database and token generator |
| **Edge Hosting** | [Cloudflare Workers](https://workers.cloudflare.com/) | `-` | Global deployment and assets server |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) / [Anime.js](https://animejs.com/) | `12.x` / `4.x` | Dynamic visual micro-interactions |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) | `1.3.x` | Premium scrolling feedback |
| **Scanner Interface** | [jsQR](https://github.com/cozmo/jsQR) / [React Webcam](https://github.com/mozmorris/react-webcam) | `1.4.x` | Browser-based camera QR code decoding |

---

## 📐 Design System & Visual Aesthetics

The project implements a bespoke **heritage-focused editorial theme** drawing heavily on Claude.com's layout guidelines, styled around the textures of traditional Assamese art.

```
                  ┌────────────────────────────────────────┐
                  │          Warm Cream Canvas             │
                  │              #faf9f5                   │
                  └──────────────────┬─────────────────────┘
                                     │
                  ┌──────────────────┴─────────────────────┐
                  │          Coral Accent Color            │
                  │              #cc785c                   │
                  └──────────────────┬─────────────────────┘
                                     │
                  ┌──────────────────┴─────────────────────┐
                  │          Dark Navy surfaces            │
                  │              #181715                   │
                  └────────────────────────────────────────┘
```

*   **Colors:**
    *   `canvas` (`#faf9f5`): Tinted warm cream representing aged, traditional manuscript paper.
    *   `primary` (`#cc785c`): Earthy coral accent matching Majuli's traditional Sattras tapestries.
    *   `surface-dark` (`#181715`): Immersive dark navy used exclusively for dark page blocks, audio players, scanning bays, and artifact viewers.
*   **Typography:**
    *   *Display Headlines:* **Cormorant Garamond** (or EB Garamond) at weight `500` for an elegant, scholarly museum catalog look.
    *   *Body Sans:* **Inter** (weight `400`–`500`) for clear, accessible reading.
    *   *Technical Identifiers:* **JetBrains Mono** for serial tokens, QR values, and logs.
*   **Alternating Surfaces:** Layout rhythms alternate page sections: `Cream Canvas` → `Light Cream Cards` → `Dark Navy Surfaces` → `Cream Canvas` → `Coral Callout` → `Dark Navy Footer`.

---

## 📂 Project Directory Structure

```filepath
Samaguri Satra Website/
├── src/
│   ├── backend/
│   │   ├── actions/          # FrontQL CRUD logic
│   │   │   ├── auth.js       # Authorization & Sessions
│   │   │   ├── artifact.js   # Artifact management
│   │   │   ├── collections.js# Category setups
│   │   │   ├── player.js     # Audio file linking
│   │   │   └── ...           # visitorApi, events, feedback, etc.
│   │   └── apis/
│   │       ├── Api.ts        # FrontQL API client instance
│   │       ├── server.js     # Dev token management server
│   │       └── tokens.json   # Generated temporary session tokens
│   ├── components/
│   │   ├── astro/            # Server-rendered layout parts
│   │   │   ├── Navbar.astro  # Top nav skeletal layout
│   │   │   └── Footer.astro  # Center-aligned 4-column footer
│   │   ├── react/            # React interactivity Islands
│   │   │   ├── hero/         # Interactive hero components
│   │   │   ├── navbar/       # Responsive mobile-to-desktop navigation
│   │   │   ├── sections/     # Modular collection lists & sliders
│   │   │   └── Admin/        # Curator control dashboard
│   │   └── ui/               # Tailored UI design elements
│   ├── layouts/              # Core layout frameworks
│   │   ├── BaseLayout.astro  # Base document head & script config
│   │   ├── LandingLayout.astro# Specific landing configuration
│   │   └── AdminLayout.astro # Secured dashboard wrapper
│   ├── pages/                # File-system router entries
│   │   ├── index.astro       # Home landing page
│   │   ├── collections.astro # Multi-category archives viewer
│   │   ├── audioplayer.astro # Single-media play layout
│   │   ├── qrcanner.astro    # QR verification panel
│   │   ├── admin/            # Dashboard page views
│   │   └── ...               # about, visit, events, news, feedback
│   ├── hooks/                # Customized React hooks
│   ├── lib/                  # Shared utility code
│   └── globals.css           # Global custom CSS and Tailwind v4.0 targets
├── public/                   # Static icons, pictures, and graphics
├── astro.config.mjs          # Astro integration & adapter setup
├── wrangler.jsonc            # Cloudflare Workers configuration
├── package.json              # Dependency manifests
└── tsconfig.json             # TypeScript configuration
```

---

## 🛡️ Database & Environment Variables

This codebase integrates with **FrontQL v7** targeting the `s5_intern_database`. Create a `.env` file at the root of the project by copying `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` contains the following active variables:

```env
PUBLIC_DATABASE=s5_intern_database
PUBLIC_BASE_URL=https://v7.frontql.dev
PUBLIC_FRONTQL_local_host=http://localhost:4466

# Media Storage Credentials
PUBLIC_FILE_UPLOAD_URL=https://uploads.backendservices.in/api
PUBLIC_IMAGE_URL=https://uploads.backendservices.in/storage/
PUBLIC_FILE_UPLOAD_ID=your_file_upload_identifier
PUBLIC_FILE_UPLOAD_PASS=your_file_upload_secret_password
```

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### 📋 Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or above)
*   [pnpm](https://pnpm.io/) (v9.x or above)
*   [Bun](https://bun.sh/) (required to run the FrontQL token generator server)

### 📥 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/assamese-manuscript-archive.git
cd assamese-manuscript-archive

# Install node dependencies
pnpm install
```

### 🔑 2. Start FrontQL Token Server
In a separate terminal window, launch the token generator server to authorize local FrontQL connections:
```bash
bun run server
# This maps to 'bun src/backend/apis/server.js'
```

### 💻 3. Run Dev Client
Run the Astro dev client:
```bash
pnpm dev
```
Open your browser and navigate to **`http://localhost:3000`**.

### 🏗️ 4. Build for Production
To construct the optimized production build locally:
```bash
pnpm build
```

---

## ☁️ Deployment

The project is optimized for deployment on **Cloudflare Workers** utilizing Wrangler CLI tools.

### Initial Setup
1.  Authenticate Wrangler with your Cloudflare account:
    ```bash
    npx wrangler login
    ```
2.  Deploy the project to your Cloudflare dashboard:
    ```bash
    pnpm deploy
    # Runs 'astro build' and immediately triggers 'wrangler deploy'
    ```

---

## 🤝 Contribution Guidelines

We welcome contributions to help preserve cultural heritage.
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License
Distributed under the MIT License. See [LICENSE](file:///b:/College%20Stuff/Samaguri%20Satra/Samaguri%20Satra%20Website/LICENSE) for more information.
