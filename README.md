# Modular Form Creator

React and TypeScript frontend for the provided resource API. It covers the resource list, the two module forms (Basic Info and Project Details), an overview with provisioning, and a read-only summary page.

## How to run

### Everything in Docker

```bash
docker compose up -d --build
```

Then open http://localhost:5173. This starts MongoDB, the backend (http://localhost:5001, Swagger at http://localhost:5001/docs) and the frontend.

Open the app at exactly `http://localhost:5173`: the backend allows only this origin through CORS, so `127.0.0.1` or another port will fail.

The frontend container builds the app and serves the production bundle with `vite preview`. That is enough for a local demo; a real deployment would use a static file server such as nginx.

### Frontend locally

Requires Node 20.19+, 22.13+ or 24+, as required by Vite 8 and ESLint 10.

```bash
docker compose up -d backend mongo   # API on http://localhost:5001
npm ci
npm run dev                          # http://localhost:5173
```

The API address comes from `VITE_API_URL` (see `.env.example`; put local overrides in `.env.local`). It defaults to `http://localhost:5001`, so a fresh clone works without configuration.

Quality checks: `npm run lint` and `npm run build` both pass with no errors or warnings.

## Tech decisions

- **TanStack Query for server state.** It provides caching, deduplicated requests, retries and cache updates after mutations, without hand-written `useEffect` fetching. Every successful write puts the server's response into the cache, so pages update without an extra request, and lists are invalidated. 4xx answers are not retried, so "not found" appears immediately.
- **React Hook Form with zod.** Each form has one schema that mirrors the backend rules one to one: trimming, patterns, lengths and allowed values. Users see the error next to the field instead of a 400. `register` works directly with the design-system `Input` and `Select`. `CheckboxGroup` is connected through `Controller`.
- **Pending changes for completed resources.** This is the in-memory buffer the task asks for: a React context with a reducer, placed above the router. Edits survive moving between pages and back to the list, and disappear on refresh. Nothing is written to `localStorage`, `sessionStorage` or the URL.
- **Data router with a layout route.** `/resources/:resourceId` loads the resource once for its four child routes and handles invalid ids, 404 and network errors in one place.
- **Route-level code splitting.** Pages load per route, so zod and React Hook Form arrive only with the pages that use them. This also keeps the build under Vite's 500 kB chunk warning.
- **Business rules as pure functions** in `src/features/resources/domain/rules.ts`. They cover module completeness (the same rule as the backend), when provisioning is allowed, change detection and building the PUT body. Components call them and do not repeat the logic.
- **Only the provided design system.** The UI uses its components and theme through styled-components, with no other UI library.

## Business rules: who sends what

| Status | Situation | What the UI does | Request |
| --- | --- | --- | --- |
| draft | Save Basic Info | saves immediately | `PATCH /:id/basic-info` |
| draft | Project Details while Basic Info is incomplete | module locked, also when opened by URL | none |
| draft | Save Project Details | saves immediately | `PATCH /:id/project-details` |
| draft | "Complete resource" with both modules complete | changes the status to completed | `PATCH /:id/provisioning` |
| draft | "Complete resource" with a module incomplete | button locked, with an explanation of what is missing | none |
| completed | Apply a module form | change goes to the pending changes in memory | none |
| completed | "Save changes" on the overview | sends the whole resource in one request | `PUT /:id` |
| completed | "Discard" | clears the pending changes | none |
| completed | refresh or close the tab | pending changes are lost (the browser warns first) | none |
| completed | provisioning again | action not available | none |

## Assumptions

The task leaves these decisions open. This is how I resolved them:

- **Applying a module form of a completed resource does not send a PUT.** The PUT goes out only from "Save changes" on the overview, as the task asks for an explicit submission through the full update. The form button reads "Apply changes", not "Save", and the form explains that nothing is sent yet.
- **Pending changes live above the router, kept per resource.** They survive navigating to the list and back, and several completed resources can have unsaved changes at the same time.
- **Unsaved changes are visible.** The overview shows a banner with "Save changes" and "Discard". "Unsaved changes" badges appear on the module cards, the resource header and the list row.
- **Leaving the page warns.** With unsaved changes, the browser's `beforeunload` confirmation appears. It only asks for confirmation and does not persist anything.
- **Details shows saved data.** With unsaved changes, the page says so and links to the overview.
- **After creating a resource, the app opens its overview.**
- **The list has pagination, filter, search and sort.** Pagination is required, because otherwise the eleventh resource is invisible. The status filter, name search and sort cost little because the API supports them. All four live in the URL.
- **Values equal to the saved ones are not counted as changes.**
- **Deleting a resource also discards its unsaved changes.** The confirmation says so.

## Edge cases handled

- **Bad addresses.** Invalid ids (`/resources/abc`), missing resources (`/resources/999999`) and unknown paths get a clear message instead of a blank screen.
- **Network errors.** They show a message with a "Retry" button.
- **Two tabs.** "Complete resource" in a stale tab explains that the resource is already completed, and the page reloads its current state. A draft form saved after another tab completed the resource shows the server's message, and the page switches to editing with pending changes.
- **Double clicks.** A fast double click on any submit button sends one request.
- **Pagination.** Deleting the only item on the last page moves the list to the new last page.
- **Search.** A term with characters that names cannot contain is answered locally, because of the backend `$regex` issue below.
- **Slow saves.** A user who leaves a page while its save is running is not pulled back when it finishes. Edits applied while "Save changes" is running are kept as pending.
- **Resources deleted elsewhere.** Their pending changes are dropped once the app learns about it.

## Backend observations

I found these while building against the API. The backend was not changed. The frontend works around each one:

- **`budget` sent as a number returns 500.** The service calls `.trim()` on it. The frontend always sends a string of digits.
- **`PUT /:id` without `name`, `basicInfo` or `projectDetails` returns 500 instead of 400.** The frontend always sends all three, taking unchanged modules from the saved resource.
- **The list's `name` filter goes into a MongoDB `$regex` unescaped.** `(` returns 500, and `.` matches any character. Names can contain only letters, digits, spaces and hyphens, so the frontend answers a search with any other character locally: it shows an empty result and a hint.
- **New `resourceId` values are `max + 1`.** Deleting the newest resource frees its number for the next one. Pending changes are therefore keyed by Mongo `_id`, so stale edits can never attach to a different resource.
- **Provisioning has no atomic status check.** Two parallel requests can both return 200. The UI ignores repeated clicks while a request is running, because TanStack Query reports `isPending` only on the next tick.

## Design system notes

The design system was not modified either:

- **Web fonts did not load at first.** `GlobalStyles` loads them with an `@import`, which browsers ignore unless it is the first CSS rule, and styled-components orders rules by definition. `main.tsx` therefore imports `GlobalStyles` before the app.
- **`Drawer` neither traps nor restores focus.** The list page makes the content behind an open drawer `inert` and moves focus back to the button that opened it.
- **A locked `Input` is disabled.** It cannot act as a form field, so the resource name is shown outside the form, and the request body takes the name from the loaded resource.
- **`CheckboxGroup` takes no `ref`.** React Hook Form gets the first checkbox instead, so focus still moves to the field when it is invalid.
- **There is no link styled as a button.** Actions that open another page use `Button` with `navigate()`; plain navigation uses links.

## Project structure

```
src/
  app/                 router, providers, layout, not-found and error pages
  shared/              API client, hooks, small UI pieces built on the design system
  features/resources/
    api/               one function per endpoint
    domain/            constants, types, zod schemas, business rules
    queries/           TanStack Query hooks and mutations
    pending/           pending changes of completed resources
    components/        forms, cards, drawers, table
    pages/             route components
  design-system/       provided, unchanged
```

Outside `src`, the only changes are:

- the new dependencies in `package.json` and `package-lock.json`;
- `Dockerfile`, `.dockerignore` and the `frontend` service in `docker-compose.yml`, for the Docker bonus.

The task limits changes to `src` and dependencies, but the bonus needs files at the repository root.

## With more time

- Unit tests for `domain/rules.ts` and the zod schemas (Vitest is already installed), and component tests for both form modes.
- Detection of edit conflicts between tabs: compare `updatedAt` before the PUT and offer to reload instead of overwriting.
- Focus management after route changes and async actions, such as moving focus to the page heading.
- Focus handling inside the design-system `Drawer`, so every drawer gets it without page-level code.
