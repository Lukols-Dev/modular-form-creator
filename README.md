# Modular Form Creator

React and TypeScript frontend for the provided resource API: the resource list, the Basic Info and Project Details module forms, an overview with provisioning, and a read-only details page.

## How to run

Everything in Docker (MongoDB, backend and frontend):

```bash
docker compose up -d --build
```

Or the frontend locally against the backend from Docker (Node 20.19+, 22.13+ or 24+):

```bash
docker compose up -d backend mongo
npm ci
npm run dev
```

Open http://localhost:5173 exactly, because the backend allows only this origin through CORS. The API address comes from `VITE_API_URL` (see `.env.example`) and defaults to `http://localhost:5001`. `npm run lint` and `npm run build` pass with no errors or warnings.

The task limits changes to `src` and dependencies; the Docker bonus also needed `Dockerfile`, `.dockerignore` and a `frontend` service in `docker-compose.yml`. That service builds the app and serves it with `vite preview`.

## Tech decisions

- **TanStack Query** holds the server data: caching, retries and cache updates after each save, without fetching in effects.
- **React Hook Form with zod.** One schema per form mirrors the backend validation, so errors show at the field instead of as a 400.
- **Edits of completed resources live in a React context above the router.** They survive moving between pages and disappear on refresh, as the task requires. Nothing goes to `localStorage`, `sessionStorage` or the URL. The rule "a draft saves at once, a completed resource waits for Save changes" sits in one hook, `useModuleSubmit`.
- **A layout route** for `/resources/:resourceId` loads the resource once for its four pages and handles invalid ids, 404 and network errors in one place.
- **Business rules are pure functions** in `src/features/resources/domain/rules.ts`: module completeness, when provisioning is allowed, change detection and the PUT body.

## Business rules: who sends what

| Status | Action | Request |
| --- | --- | --- |
| draft | save Basic Info | `PATCH /:id/basic-info` |
| draft | save Project Details (locked until Basic Info is complete, also when opened by URL) | `PATCH /:id/project-details` |
| draft | "Complete resource" (locked, with an explanation, until both modules are complete) | `PATCH /:id/provisioning` |
| completed | apply a module form | none: kept in memory |
| completed | "Save changes" on the overview | one `PUT /:id` with the whole resource |
| completed | "Discard", refresh or closing the tab | none: the edits are dropped |
| completed | provisioning again | not available |

## Assumptions

- Applying a module form of a completed resource sends nothing; the PUT goes out only from "Save changes" on the overview. The form button reads "Apply changes".
- Unsaved edits show as a banner on the overview, with "Save changes" and "Discard", and as badges on the module cards, the resource header and the list. The banner says that the edits are lost on refresh, so there is no extra leave-page prompt.
- The Details page shows the data saved on the server and points to any unsaved edits.
- After creating a resource, the app opens its overview.
- The list uses the API's pagination, status filter, name search and sort, kept in the URL.
- Form input that was not applied or saved is discarded when you leave the form.

## Notes

The backend and the design system were not changed. Found while building against them:

- `budget` sent as a number, or a `PUT` without `name`, `basicInfo` or `projectDetails`, returns 500. The frontend always sends a string budget and a complete body.
- The list's `name` filter is an unescaped MongoDB `$regex`, so `(` returns 500. Searches with characters a name cannot contain are answered locally.
- New `resourceId` values are `max + 1`, so a deleted number comes back. Edits in memory are therefore keyed by Mongo `_id`.
- A fast double click could send a request twice, because TanStack Query reports `isPending` a tick later. Repeated clicks are ignored while a request runs.
- The design-system fonts never loaded: their `@import` only works as the first CSS rule, so `main.tsx` imports `GlobalStyles` before the app.
- A locked `Input` is disabled, so the resource name is shown outside the form and taken from the loaded resource. Small workarounds make `Drawer` keep and return keyboard focus, and make the `Checkbox` square clickable.
