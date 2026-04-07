# TDY Portfolio

Professional portfolio website for Thow Deng Yuel, focused on Human Nutrition, Global Health, and digital health solutions.

## Overview

This project is a modern React single-page portfolio with:

- responsive design across mobile, tablet, and desktop
- animated, low-noise particle background
- interactive profile and project sections
- real-world styled global impact globe using Three.js
- professional contact experience with EmailJS integration

## Tech Stack

- React 18
- Vite
- Three.js
- EmailJS Browser SDK
- React Icons

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel / Netlify)

This project is deployment-ready for both Vercel and Netlify.

- Vercel config: `vercel.json`
- Netlify config: `netlify.toml`

### Vercel

1. Import the repository in Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add environment variables (see below), then deploy.

### Netlify

1. Import the repository in Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add environment variables (see below), then deploy.

The included redirect rule supports SPA refreshes and deep links.

## Project Structure

```text
.
|- index.html
|- package.json
|- vite.config.js
|- src/
|  |- App.jsx
|  |- App.css
|  \- main.jsx
\- README.md
```

## Contact Form Setup (EmailJS)

The contact form uses EmailJS service and template IDs.

Set these environment variables in Vercel/Netlify project settings:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`

For production hardening:

- allow your deployed domain in EmailJS dashboard settings

Optional local `.env` example:

```bash
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

## License

This portfolio is provided for personal/professional presentation use.
