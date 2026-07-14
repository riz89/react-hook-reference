import { useMemo, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useMemo
 * ------------------------------------------------------------------
 * Definition: Memoizes the RESULT of an expensive calculation, only
 *   recomputing it when one of its dependencies changes.
 * When to use: An expensive computation (heavy loop, filtering/sorting
 *   a large list, complex derived data) that would otherwise re-run on
 *   every render, including renders triggered by unrelated state.
 * Interview question: Does useMemo guarantee the cached value is never
 *   recomputed unnecessarily, and should you use it for every
 *   calculation "just in case"?
 * Answer: No — useMemo is a performance hint, not a semantic guarantee;
 *   React may discard the cache and recompute in some cases (e.g. under
 *   certain memory-pressure/future compiler optimizations). It also has
 *   its own cost (storing deps and diffing them each render), so wrapping
 *   cheap calculations in useMemo can be net-negative — reserve it for
 *   computations that are measurably expensive or that need to keep a
 *   stable reference (e.g. an array/object passed to React.memo children
 *   or another hook's dependency array).
 */

function expensiveSum(n) {
  // Deliberately slow, to make the difference between "memoized" and
  // "recomputed every render" visible in the render-time readout below.
  let total = 0
  for (let i = 0; i < n * 5_000_000; i++) {
    total += i % 3
  }
  return total
}

function UseMemoDemo() {
  const [n, setN] = useState(20)
  const [unrelatedCount, setUnrelatedCount] = useState(0)

  const start = performance.now()
  const memoizedSum = useMemo(() => expensiveSum(n), [n])
  const memoDuration = (performance.now() - start).toFixed(2)

  return (
    <div>
      <ConceptInfo
        title="useMemo"
        definition="Caches the return value of a function between renders, recomputing only when its dependency array changes."
        whenToUse="A genuinely expensive derived value (sorting/filtering large lists, heavy math), or when you need a stable object/array reference so a memoized child or another hook's deps don't see a 'new' value every render."
        question="Your component wraps a cheap calculation like `a + b` in useMemo. Is this a good idea?"
        answer="No — useMemo itself has overhead (allocating a slot, storing the previous deps, comparing them each render). For a trivial calculation like `a + b`, that bookkeeping costs more than just recomputing it, so it should be a plain expression, not memoized. Reserve useMemo for calculations that are actually expensive to redo."
      />

      <div className="demo-panel">
        <h3>Expensive calculation, memoized by `n`</h3>
        <div className="demo-row">
          <label>
            n = {n}{' '}
            <input
              type="range"
              min="1"
              max="40"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </label>
        </div>
        <p>
          Result: <span className="badge">{memoizedSum}</span> — this render
          took <strong>{memoDuration}ms</strong>
        </p>
        <div className="demo-row">
          <button onClick={() => setUnrelatedCount((c) => c + 1)}>
            Trigger unrelated re-render ({unrelatedCount})
          </button>
        </div>
        <p>
          Clicking the button above re-renders this component but does NOT
          change <code>n</code>, so useMemo skips recalculating{' '}
          <code>expensiveSum</code> — notice the render time stays low.
          Dragging the slider changes <code>n</code>, forcing recomputation
          and a visibly slower render.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useMemo runs its function during rendering,
        so it must stay pure (no side effects, no DOM mutations) — side
        effects belong in useEffect, not inside a useMemo callback.
      </div>
    </div>
  )
}

export default UseMemoDemo
