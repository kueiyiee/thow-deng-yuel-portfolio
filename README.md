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

The contact form uses EmailJS service and template IDs. For production hardening:

- move EmailJS keys into `.env` variables
- read them through `import.meta.env`
- allow your deployed domain in EmailJS dashboard settings

## License

This portfolio is provided for personal/professional presentation use.
