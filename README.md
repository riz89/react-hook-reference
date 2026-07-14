# React Hooks Interview Reference

A hands-on reference app covering every React hook (through React 19) and the
core concepts that come up in React interviews. Every example is a working,
interactive demo with an inline comment block explaining what it is, when to
use it, and a likely interview question with its answer.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173). Use the
left sidebar to jump between sections — every example is self-contained and
interactive, so play with the buttons/inputs and open your browser's
DevTools console where noted (several demos log render/lifecycle behavior
that's easiest to understand by watching the console).

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint     # run ESLint
```

## Project structure

- `src/components/state/` — useState, useReducer, useRef, useContext
- `src/components/effects/` — useEffect, useLayoutEffect, useInsertionEffect
- `src/components/performance/` — useMemo, useCallback, React.memo
- `src/components/concurrent/` — useTransition, useDeferredValue
- `src/components/utility/` — useId, useImperativeHandle, useDebugValue, useSyncExternalStore
- `src/components/react19/` — use, useActionState, useOptimistic, useFormStatus
- `src/components/concepts/` — props/drilling, conditional & list rendering, controlled vs
  uncontrolled inputs, lifting state up, custom hooks, lifecycle via hooks
- `src/hooks/` — the custom hooks (`useLocalStorage`, `useFetch`) used by the custom-hook demo
- `src/components/shared/ConceptInfo.jsx` — the reusable "definition / when to use / interview
  Q&A" card shown at the top of every example
- `src/App.jsx` — the sidebar navigation and section registry that ties everything together

Every demo file starts with a comment block (definition, when to use it, and an
interview Q&A) directly above the component, and most also include a
`.gotcha` callout in the UI highlighting a common mistake.

## Suggested review order

This roughly goes from foundational to advanced, and groups related hooks so
the contrasts between them (the kind of thing interviewers love to ask about)
are easy to compare back-to-back.

1. **useState** — the baseline; study the stale-closure gotcha first, it recurs everywhere.
2. **Props & Prop Drilling** → **useContext** — see the problem before the solution.
3. **Lifting State Up** — how sibling components share state without Context.
4. **Controlled vs Uncontrolled Inputs**
5. **Conditional & List Rendering** — especially the `key` gotcha.
6. **useReducer** — compare directly against useState.
7. **useEffect** (cleanup + dependency array) — the most-asked hook in interviews.
8. **Lifecycle via Hooks** — map useEffect back to class lifecycle methods.
9. **useLayoutEffect** → **useInsertionEffect** — timing differences, rarest first is fine to skim.
10. **useRef** — DOM refs and the "mutate without re-render" pattern.
11. **useImperativeHandle + forwardRef** — builds on useRef.
12. **useMemo** → **useCallback** → **React.memo** — study together; useCallback/memo are a matched pair.
13. **Custom Hooks** (`useLocalStorage`, `useFetch`) — composition of the hooks above.
14. **useTransition** → **useDeferredValue** — compare the two approaches to the same problem.
15. **useId** — quick, low-stakes.
16. **useDebugValue** → **useSyncExternalStore** — niche but occasionally asked.
17. **React 19: use** → **useActionState** → **useOptimistic** → **useFormStatus** — newest
    material, do this last and in this order since useFormStatus's demo builds on the
    useActionState pattern.

If you're short on time, prioritize steps 1–9 and 12 — those cover the hooks
and gotchas that come up most often in practice, then circle back for the
React 19 additions and the more niche utility hooks.
