<div align="center">

# Portfolio App — Pragadeeswaran K

Beautiful, blazing-fast personal portfolio built with Next.js App Router. Showcase projects, experience, and contact details with a modern, accessible design.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38b2ac?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## About Me

I'm **Pragadeeswaran K**, an **AI & Computer Vision Engineer** passionate about building intelligent systems that see, understand, and interact with the world.

- Advanced Computer Vision & Image Processing
- Deep Learning & Neural Networks
- ML Model Deployment & Optimization
- Transfer Learning & Domain Adaptation

Profiles: [GitHub: @Pragadees15](https://github.com/Pragadees15)

### Table of Contents

- [About Me](#about-me)
- [Features](#features)
- [Featured Projects](#featured-projects)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Contact API](#contact-api)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Modern, responsive UI optimized for performance and accessibility
- Projects, skills, experience, and blog-ready sections
- SEO-friendly metadata and Open Graph tags
- Contact form with server-side email handler
- Dark mode and theme-ready styles
- Image optimization, font loading, and route-based code splitting

## Featured Projects

- AdSmart Age-Gender Advertisement — Targeted ad display using face, age, and gender detection. [Repo](https://github.com/Pragadees15/AdSmart-Age-Gender-Based-Advertisement-Display)
- Sign Language Detection Using Deep Learning — ISL gesture recognition with CNN. [Repo](https://github.com/Pragadees15/-Sign-Language-Detection-Using-Deep-Learning)
- EduSimplify — Streamlit app that scrapes and simplifies educational content using Gemini API. [Repo](https://github.com/Pragadees15/EduSimplify)
- Fruit Quality Detection — Classifies healthiness of fruits with InceptionResNetV2. [Repo](https://github.com/Pragadees15/Fruit-quality-detection)

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (or CSS Modules)
- **Fonts**: `next/font` with Geist
- **Forms**: Next.js API routes
- **Deploy**: Vercel (recommended)

## Quick Start

Prerequisites:

- Node.js 18+ (LTS recommended)
- pnpm, npm, yarn, or bun

Clone and install:

```bash
git clone <your-repo-url> portfolio-app
cd portfolio-app
npm install
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project Structure

```text
portfolio-app/
└─ src/
   └─ app/
      ├─ page.tsx           // Home page
      ├─ layout.tsx         // Root layout & metadata
      └─ api/
         └─ contact/
            └─ route.ts     // POST /api/contact
```

## Available Scripts

```bash
# Start local dev server
npm run dev

# Type-check and build for production
npm run build

# Start production server (after build)
npm start

# Lint source files
npm run lint
```

## Configuration

Environment variables live in `.env.local` during development.

Common variables:

- `NEXT_PUBLIC_SITE_URL` – canonical site URL
- `CONTACT_TO_EMAIL` – destination email for contact form
- `CONTACT_FROM_EMAIL` – sender email identity
- `SMTP_*` or provider-specific keys if using SMTP/Email service

Create `.env.local`:

```bash
cp .env.example .env.local # if provided
# then fill in real values
```

## Contact API

This project includes a serverless route to handle form submissions at `POST /api/contact`.

- **Endpoint**: `/api/contact`
- **Method**: `POST`
- **Body**: `{ name: string; email: string; message: string }`
- **Responses**:
  - `200` – message accepted
  - `400` – validation error
  - `500` – server error

Example fetch:

```ts
await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message }),
});
```

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Add environment variables in Vercel Project Settings
4. Deploy

### Self-Host

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT © Pragadeeswaran K
