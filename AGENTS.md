# TrustLens Agent Instructions

## Project Snapshot

- This is a TanStack Start application using React, TypeScript, Vite, and TanStack Router.
- The current implementation is a minimal starter. Do not assume planned services or folders exist yet.
- Product and security requirements are documented in [context/trustlens-project-overview.md](context/trustlens-project-overview.md).
- Coding and security conventions are documented in [context/trustlens-coding-standards.md](context/trustlens-coding-standards.md).
- Collaboration and Git workflow rules are documented in [context/trustlens-ai-interaction-guidelines.md](context/trustlens-ai-interaction-guidelines.md).

## Development Commands

```bash
pnpm install
pnpm run dev
pnpm run generate-routes
pnpm run build
pnpm run preview
```

There are currently no configured test or lint scripts. Do not claim those checks were run unless they are added or invoked directly.

## Implementation Conventions

- Keep application code under `src/` and file-based routes under `src/routes/`.
- Treat `src/routeTree.gen.ts` as generated output; update route files and run `npm run generate-routes` instead of editing it manually.
- Follow the existing TypeScript strictness and avoid `any`, unused declarations, and unsafe assertions.
- Keep route files focused on routing and page composition. Keep server-only operations and secrets out of client code as server functionality is introduced.
- Preserve the existing TanStack Start/Vite setup. Do not introduce Next.js APIs or conventions.
- Keep changes minimal and avoid unrelated formatting or dependency changes.

## Security Expectations

- Treat submitted URLs and scanned website content as untrusted input.
- Do not bypass URL/SSRF validation, expose secrets or internal services, or render untrusted HTML.
- Keep deterministic risk findings and verdicts separate from AI-generated explanations; AI must not invent evidence or silently override security decisions.
- For security-sensitive changes, explain the affected boundary and add focused validation or tests.

## Workflow

- Read the relevant files in `context/` before implementing non-trivial features.
- Make the smallest complete change, then run the narrowest relevant check and `npm run build` when applicable.
- Review the diff for unrelated changes and accidental secret exposure.
- Ask before large architectural changes, destructive Git/database operations, dependency replacements, commits, or merges.
