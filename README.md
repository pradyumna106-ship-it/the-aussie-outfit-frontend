# The Aussie Outfit Frontend

A modern React + Vite frontend application for The Aussie Outfit, built with JavaScript and styled with Tailwind CSS.

## Tech Stack

- **React 19** with Vite for fast development and production builds
- **Tailwind CSS 4** for utility-first styling
- **React Router v7** for client-side routing
- **Axios** for HTTP requests
- **React Toastify & Sonner** for notifications
- **Lucide React** for icons
- **React Helmet Async** for dynamic document head management
- **ESLint** for code quality
- **Hot Module Replacement (HMR)** enabled in development

## Features

- JavaScript-only codebase (no TypeScript)
- Environment variable support via `dotenv`
- API proxy configuration for backend communication
- Fully responsive design with Tailwind CSS
- Toast notifications for user feedback
- Icon library integration
- SEO-friendly with helmet support

## Prerequisites

- Node.js 16 or later
- npm or yarn

## Getting Started

### Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

### Environment Setup

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:3000
```

Update the `VITE_API_BASE_URL` to match your backend API server.

### Run the development server

```bash
npm run dev
```

or

```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for production

```bash
npm run build
```

or

```bash
yarn build
```

### Preview the production build

```bash
npm run preview
```

or

```bash
yarn preview
```

### Lint code

```bash
npm run lint
```

## Project Structure

```
src/
├── api/              # API integration and service calls
├── assets/           # Static images and media files
├── components/       # Reusable React components
├── context/          # React Context for state management
├── datas/            # Static data and constants
├── layout/           # Layout components (header, footer, etc.)
├── pages/            # Page components for routes
├── utils/            # Utility functions and helpers
├── App.jsx           # Main App component
├── App.css           # App-level styles
├── main.jsx          # React DOM entry point
├── index.css         # Global styles
├── fonts.css         # Custom fonts
└── routes.js         # Route definitions
public/              # Static assets served as-is
index.html           # Application entry HTML file
vite.config.js       # Vite configuration with API proxy
```

## Configuration

### Vite Configuration

The `vite.config.js` file includes:
- React plugin for JSX support
- API proxy configuration that routes `/api` requests to your backend server
- Environment variable loading

### Tailwind CSS

Tailwind CSS v4 is integrated with the Vite plugin for optimized styling.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests (currently not configured) |

## Docker Support

A Dockerfile is included for containerized deployment.

## Deployment

The project includes configuration for Vercel deployment via `vercel.json`.

## Notes

This repository is configured as a JavaScript project without TypeScript, providing a lightweight and straightforward development experience.
