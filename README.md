# Unsplash Clone - Demo App (Built with T3 Stack & Pexels API)

This is a demo application that replicates some of the functionalities and interface of Unsplash, using the Pexels API to fetch images. The project is built on the robust **T3 Stack**.

## Main Features

- **Image exploration:** Browse high-quality images.
- **Image search:** Search for images by keywords using the Pexels API.
- **Popular/curated photos:** Sections to view popular photos and the latest curated photos by the Pexels team.
- **Infinite scroll:** Automatically loads more images as the user scrolls down.
- **Responsive design:** The interface adapts to different screen sizes.
- **Server-side initial load (SSR):** The first batch of images is loaded on the server for better perceived performance and possible SEO benefits.
- **Client-side interactions:** Searching and loading additional pages of images are efficiently handled on the client.

## Tech Stack

This project is a [T3 Stack](https://create.t3.gg/) application and uses the following main technologies:

- **[Next.js](https://nextjs.org/):** React framework for production (with App Router).
- **[tRPC](https://trpc.io/):** End-to-end type-safe APIs.
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid UI development.
- **[TypeScript](https://www.typescriptlang.org/):** Statically typed superset of JavaScript.
- **[React Query (TanStack Query)](https://tanstack.com/query/latest):** Library for fetching, caching, and managing server state (used via tRPC).
- **Pexels API:** Source of the images displayed in the app.
- **[Lucide React](https://lucide.dev/):** Simple and beautiful SVG icons.
- **[Biome](https://biomejs.dev/):** Fast formatter and linter to maintain code quality.

## Project Structure

The project follows a typical T3 Stack structure with Next.js App Router:

```text
└── unpash-demo-app/
    ├── public/                # Public assets
    ├── src/
    │   ├── app/               # Routes and layouts (App Router)
    │   │   ├── layout.tsx     # Main layout
    │   │   ├── page.tsx       # Main page (Server Component)
    │   │   ├── _components/   # App-specific components
    │   │   └── api/
    │   │       └── trpc/
    │   │           └── [trpc]/
    │   │               └── route.ts # tRPC handler
    │   ├── components/
    │   │   ├── custom/        # Custom UI components
    │   │   └── ui/            # Reusable UI components
    │   ├── lib/               # Utility functions
    │   ├── server/
    │   │   └── api/
    │   │       ├── root.ts    # Main tRPC router
    │   │       ├── trpc.ts    # tRPC base config
    │   │       └── routers/
    │   │           ├── pexels.ts # tRPC router for Pexels
    │   │           └── post.ts   # Example router (can be removed)
    │   ├── styles/              # Global styles
    │   ├── trpc/                # tRPC client and React Query
    │   │   ├── query-client.ts
    │   │   ├── react.tsx
    │   │   └── server.ts
    │   └── env.js               # Environment variable validation
    ├── .env.example             # Example environment variables
    ├── next.config.js           # Next.js config
    ├── package.json
    ├── tsconfig.json
    └── biome.jsonc              # Biome config
```

## Setup and Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm, yarn, or pnpm

### Environment Variables

1. You need a **Pexels API Key**. You can get one by signing up at the [Pexels API site](https://www.pexels.com/api/).
2. Create a `.env` file at the root of the project (you can copy it from `.env.example`).
3. Add your environment variables to the `.env` file:

```env
# .env

# Pexels API variables (DO NOT expose to client)
PEXELS_API_URL="https://api.pexels.com/v1/"
PEXELS_API_KEY="YOUR_PEXELS_API_KEY"

# Optional: Development port (Next.js uses 3000 by default)
# PORT=3000
```

### Installation

1. Clone the repository (if applicable) or navigate to the project folder.
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running in Development

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port you configured) in your browser to view the app.

## Available Scripts

In `package.json` you will find several useful scripts:

- `dev`: Starts the development server.
- `build`: Builds the app for production.
- `start`: Starts the production server (after `build`).
- `preview`: Builds and then previews the production app.
- `typecheck`: Checks TypeScript types across the project.
- `check`, `check:unsafe`, `check:write`: Biome commands for formatting and linting.

## Implemented Functionality

- **Main page (`src/app/page.tsx`):**
  - Renders the main structure as a Server Component.
  - Performs the initial image load (popular, curated, or search) on the server based on URL `searchParams`.
  - Passes the initial data to the client component `ImageGridClient`.
- **Custom UI components (`src/components/custom/`):**
  - `Header.tsx`: Shows the logo, navigation, and a search input. Updates the URL with `?query=...` on search.
  - `Hero.tsx`: Main section with title and a large search input. Also updates the URL.
  - `ImageGridClient.tsx`: Client component that:
    - Receives initial data from the server.
    - Uses `api.pexels.searchPhotos.useInfiniteQuery` and `api.pexels.getCuratedPhotos.useInfiniteQuery` (with React Query) to fetch more images.
    - Implements infinite scroll with `IntersectionObserver`.
    - Displays images in a 3-column masonry grid.
  - `ImageCard.tsx`: Renders each image card with photographer info and actions (like, add, download - UI only).
  - `Loading.tsx`: Simple loading spinner.
- **tRPC router for Pexels (`src/server/api/routers/pexels.ts`):**
  - `searchPhotos`: Procedure to search photos on Pexels.
  - `getCuratedPhotos`: Procedure to get curated photos.
  - `getPhotoById`: Get photo by ID (currently not used in the main UI, but available).

## License

This project is licensed under the MIT License. See the LICENSE file for details.
