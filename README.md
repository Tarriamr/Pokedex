# Pokedex Application (Training Project)

## Project Description

A simple Pokedex web application created as a programming exercise. It allows browsing a list of Pokemon, managing favorites, editing statistics, creating custom Pokemon, and simulating battles in the Arena. The project focuses on the practical application of modern frontend technologies.

The application is intended for Polish-speaking users.

## Features

### Basic
*   Displaying a list of all available Pokemon (first 150 from [PokeAPI](https://pokeapi.co/) combined with user-created Pokemon).
*   **Pagination** of the Pokemon list.
*   Filtering the Pokemon list by name (frontend-side).
*   Displaying details of a selected Pokemon in a **modal** (including stats, types, weight, height, ID).
*   Responsive design (adapting to mobile and desktop views).
*   Theme switcher (light/dark).

### User (JSON Server)
*   Registering a new user (saved in `BE-service/db.json`) - via **modal**.
*   Logging in an existing user (with Notistack notification for success or error) - via **modal**.
*   Logging out a user (with Notistack notification).
*   Maintaining user session (recognizing a logged-in user after refresh).

### Interactions (for logged-in users)
*   **Favorites:**
    *   Marking/unmarking Pokemon as favorites (heart icon, filled/outline, in the details modal).
    *   Changes saved in the user's profile in `db.json`.
    *   Dedicated `/favourites` subpage displaying only favorite Pokemon.
    *   Notistack notification on error during favorite update.
*   **Arena:**
    *   Adding up to 2 Pokemon to the Arena (Add/Remove button in the details modal).
    *   Displaying selected Pokemon on the `/arena` page.
    *   Ability to remove a Pokemon from the Arena on the `/arena` page (X button on the card).
    *   Starting a battle with the "FIGHT!" button.
    *   Battle outcome calculated based on the formula: `base_experience * weight`.
    *   Visual feedback for the loser (e.g., grayscale) and winner (e.g. type-based shadow).
    *   Displaying a message **on the page** about the battle result (e.g., "[Winner] defeats [Loser]!" or "Draw!").
    *   Updating stats after the battle (saved in `db.json`):
        *   Winner: `wins + 1`, `base_experience + 10` (or `modified_base_experience + 10` for API Pokemon).
        *   Loser: `losses + 1`.
        *   Draw: no stat changes.
    *   "Leave Arena" button removing Pokemon from the Arena (clears `arenaPokemonIds` in `db.json`).
    *   Notistack notification on error during post-battle stat update, leaving the Arena, removing a Pokemon from the Arena, or when the Arena is full.
*   **Editing and Creating (Page `/edit`):**
    *   Displaying a list of all available Pokemon (API + user-created).
    *   "Create Pokemon" button opening the creation modal (button adjusts position on mobile view).
    *   **Creating:**
        *   Selecting graphics for the new Pokemon (from IDs >= 151, fetched from PokeAPI).
        *   Blocking graphics already used by other user Pokemon.
        *   Entering Name, Weight, Height, Experience (experience > 0).
        *   Saving the new Pokemon in the user's profile in `db.json` with the `isCustom: true` flag (types are *not* saved).
        *   Notistack notification on creation success or save error.
    *   **Editing:**
        *   "Edit" button next to each Pokemon on the list opening the edit modal.
        *   Ability to change Weight, Height, Experience.
        *   Saving modified stats in the user's profile in `db.json`. For API Pokemon (ID 1-150), modified experience is saved as `modified_base_experience`; for created Pokemon (ID > 150), `base_experience` is overwritten.
        *   Notistack notification on edit success, no changes made, or save error.
*   **Ranking (Page `/ranking`):**
    *   Displaying a table with all Pokemon (API + created).
    *   Ability to sort the table ascending/descending by: ID (#), Name, Wins, Experience, Weight, Height.
    *   Displaying Pokemon types (also in mobile view, vertically).
    *   No ability to open the details modal from this page.

## Technologies

*   **Frontend:**
    *   React (v18+)
    *   Vite
    *   JavaScript (ES6+)
    *   HTML5, CSS3
    *   React Router DOM (v6+)
    *   Tailwind CSS (with JIT)
    *   clsx (for conditional CSS class joining)
    *   React Query (`@tanstack/react-query`) (server state management, cache, mutations)
    *   Axios (HTTP requests)
    *   React Hook Form (form management)
    *   Zod (form schema validation)
    *   Notistack (snackbar notifications)
    *   Headless UI (for Dialog/Modal components)
    *   Lucide React / Heroicons (icons)
*   **Backend (Mock):**
    *   JSON Server
*   **Tooling:**
    *   Node.js
    *   npm

## Project Structure

```
.
├── BE-service/         # Backend (JSON Server)
│   ├── db.json         # Database file (users, their stats, favorites, arena)
│   ├── backup/         # Backup db files
│   │   └── original_db.json
│   └── package.json    # Backend dependencies and scripts
├── FE-service/         # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/     # Images, icons, fonts (including arena backgrounds)
│   │   ├── components/ # Reusable components (e.g., cards, modals, navigation, arena components)
│   │   ├── config/     # Configuration constants (constants.js)
│   │   ├── context/    # React Contexts (AuthContext, ThemeContext)
│   │   ├── hooks/      # Custom Hooks (e.g., usePokemonList, usePokemonFight, useArenaData)
│   │   ├── services/   # API logic (apiClient, auth.js, pokemon.js, apiUtils.js)
│   │   ├── shared/     # Simple shared components (e.g., FormInput, BaseModal)
│   │   ├── subpages/   # Components representing views/pages
│   │   ├── utils/      # Helper functions (e.g., stringUtils, numberUtils, pokemonUtils)
│   │   ├── App.jsx     # Main application component (routing, layout)
│   │   ├── index.css   # Global Tailwind styles
│   │   ├── main.jsx    # React application entry point
│   │   └── queryClient.js # React Query client configuration
│   ├── eslint.config.js
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── package.json    # Frontend dependencies and scripts
│   └── vite.config.js  # Vite configuration (incl. backend proxy)
├── doc/                # Documentation
│   └── POKEDEX.txt     # Detailed project specification
├── .gitignore
├── package.json        # Root package.json (for workspaces)
└── README.md           # This file
```

## Running the Application

### Prerequisites
*   [Node.js](https://nodejs.org/) installed (LTS version recommended)
*   `npm` package manager installed (usually comes with Node.js)

### Installation

1.  Clone the project repository.
2.  Install dependencies for **both** backend and frontend using npm workspaces from the **root** directory:
    ```bash
    npm install
    ```

### Running Backend and Frontend Concurrently

From the **root** directory, run:

```bash
npm run dev
```
This command uses `npm-run-all` to start both the JSON Server (backend on `http://localhost:3001`) and the Vite development server (frontend on `http://localhost:5173`) in parallel.

The Vite server is configured with a proxy that forwards `/api` requests to the running JSON Server.

### Resetting the Database

To reset the `db.json` file to its original state (useful for testing), run the following command from the **root** directory:

```bash
npm run reset
```

## Active Notistack Notifications

The application uses Notistack notifications to inform the user in the following situations:

*   **Login:** Success or Error.
*   **Logout:** Success.
*   **Registration:** Error.
*   **Pokemon Editing/Creation:** Success, Save Error, No Changes Made.
*   **Favorites:** Update Error.
*   **Arena:** Stat Update Error, Leave Error, Remove Pokemon Error, Arena Full Warning.
*   **Pokemon Details:** Data Fetching Error.

## Key Conventions and Assumptions

*   **Data Sources:** Basic Pokemon data (including for IDs > 150) is fetched from the public PokeAPI. User-specific data is stored and managed by JSON Server (`db.json`).
*   **Data Merging:** Data from PokeAPI and JSON Server is merged on the frontend (primarily within the `usePokemonList.jsx` and `useArenaData.js` hooks).
*   **User Stats:** Interactions save/modify data within the `pokemonStats` object or dedicated fields (`favoritePokemonIds`, `arenaPokemonIds`) in the user's record in `db.json`.
*   **Pokemon Types:** Types are *always* fetched dynamically from PokeAPI based on the Pokemon's ID and are *not* saved in `db.json`.
*   **Server State Management:** React Query (`@tanstack/react-query`) is used to manage the lifecycle of server data.
*   **Global State Management:** React Context API (`AuthContext`, `ThemeContext`) is used for global application state.
*   **Business Logic:** Complex logic is encapsulated within dedicated custom hooks.
*   **Forms:** React Hook Form and Zod provide form management and validation.
*   **Styling:** Tailwind CSS is the primary styling tool.
*   **Language:** The user interface is in Polish.
