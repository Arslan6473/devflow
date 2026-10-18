# DevFlow Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js 15 project called DevFlow with Tailwind CSS v4, TypeScript strict mode, App Router, Vitest, and shadcn/ui in an existing git repo directory.

**Architecture:** Use create-next-app to scaffold the project into an existing non-empty directory by temporarily relocating the `docs/` folder. Install runtime and dev dependencies, configure Vitest with jsdom and React Testing Library, then initialize shadcn/ui and add all required UI primitives.

**Tech Stack:** Next.js 15, React 19, TypeScript 5 (strict), Tailwind CSS v4, Vitest, shadcn/ui, Zustand, Framer Motion, Zod, react-hook-form, Monaco Editor, Jose, Sonner, Lucide React, next-themes.

## Global Constraints

- Working directory: `/home/hp/Projects/Test-Project/devflow`
- Do NOT delete `.git`, `.gitignore`, or `docs/` folder
- Do NOT run `git commit` or `git add`
- All commands must be non-interactive (use `--yes`, `-y`, `-d` flags)
- All dependencies must be open-source
- Tailwind CSS v4, TypeScript strict, App Router (no src/ dir)
- Import alias: `@/*`
- Package manager: npm

---

### Task 0.1: Initialize Next.js Scaffold

**Files:**
- Create: all Next.js scaffold files at `/home/hp/Projects/Test-Project/devflow/`
- Preserve: `.git/`, `.gitignore`, `docs/`

**Interfaces:**
- Produces: working Next.js 15 app with TypeScript, Tailwind v4, App Router, ESLint

- [ ] **Step 1: Move docs/ out temporarily**

```bash
mv /home/hp/Projects/Test-Project/devflow/docs /home/hp/Projects/Test-Project/devflow-docs-tmp
```

- [ ] **Step 2: Run create-next-app scaffold**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx --yes create-next-app@latest . --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --no-turbopack --yes
```

Expected: scaffold succeeds, creates `app/`, `public/`, `package.json`, `tsconfig.json`, etc.

- [ ] **Step 3: Restore docs/**

```bash
mv /home/hp/Projects/Test-Project/devflow-docs-tmp /home/hp/Projects/Test-Project/devflow/docs
```

- [ ] **Step 4: Install runtime dependencies**

```bash
cd /home/hp/Projects/Test-Project/devflow && npm i framer-motion next-themes zustand sonner lucide-react @monaco-editor/react jose react-hook-form @hookform/resolvers zod
```

- [ ] **Step 5: Install dev dependencies**

```bash
cd /home/hp/Projects/Test-Project/devflow && npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 6: Verify TypeScript passes**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit
```

Expected: no errors output, exit code 0.

---

### Task 0.2: Configure Vitest

**Files:**
- Create: `/home/hp/Projects/Test-Project/devflow/vitest.config.ts`
- Create: `/home/hp/Projects/Test-Project/devflow/vitest.setup.ts`
- Modify: `/home/hp/Projects/Test-Project/devflow/package.json` (add test scripts)

**Interfaces:**
- Consumes: `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/jest-dom` (from Task 0.1)
- Produces: `npm test` and `npm run test:watch` scripts; vitest configured for React with jsdom

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 2: Create vitest.setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add test scripts to package.json**

In `package.json`, under `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Run tests to confirm "no test files found" pass**

```bash
cd /home/hp/Projects/Test-Project/devflow && npm test
```

Expected: exit 0, output contains "No test files found" or similar (this is acceptable).

---

### Task 0.3: Initialize shadcn/ui and Add Primitives

**Files:**
- Create: `/home/hp/Projects/Test-Project/devflow/components.json`
- Create: `/home/hp/Projects/Test-Project/devflow/lib/utils.ts`
- Create: `/home/hp/Projects/Test-Project/devflow/components/ui/` (all primitives)
- Modify: `/home/hp/Projects/Test-Project/devflow/app/globals.css` (CSS variables + base layer)

**Interfaces:**
- Consumes: Tailwind CSS v4, Next.js App Router scaffold (from Task 0.1)
- Produces: `cn()` utility at `@/lib/utils`, all UI primitives at `@/components/ui/*`

- [ ] **Step 1: Initialize shadcn/ui with defaults**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx --yes shadcn@latest init -d
```

Expected: creates `components.json`, `lib/utils.ts`, updates `app/globals.css`.

- [ ] **Step 2: Add all required UI primitives**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx --yes shadcn@latest add button card input textarea label tabs dialog command badge tooltip dropdown-menu separator switch sonner accordion
```

Expected: all components written to `components/ui/`.

- [ ] **Step 3: Verify lib/utils.ts exports cn**

```bash
grep -n "export.*cn" /home/hp/Projects/Test-Project/devflow/lib/utils.ts
```

Expected: line matching `export function cn(` or `export const cn`.

- [ ] **Step 4: Final TypeScript check**

```bash
cd /home/hp/Projects/Test-Project/devflow && npx tsc --noEmit
```

Expected: no errors, exit code 0.

---

## Reporting Checklist

After all tasks complete, report:
1. Next.js and Tailwind versions from `package.json`
2. Confirmation all deps installed
3. Top-level file listing (`ls /home/hp/Projects/Test-Project/devflow/`)
4. Output of `npx tsc --noEmit`
5. Output of `npm test`
6. Full contents of `app/globals.css`
7. Full contents of `components.json`
8. Any deviations from the plan and why
