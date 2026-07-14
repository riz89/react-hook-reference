import { memo, useCallback, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useCallback
 * ------------------------------------------------------------------
 * Definition: Memoizes a FUNCTION reference itself (not its return
 *   value), only creating a new function when its dependencies change.
 *   `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.
 * When to use: Passing a callback down to a memoized child
 *   (React.memo) so the child doesn't see a "new" prop (and skip its
 *   re-render check) on every parent render, or when a callback is a
 *   dependency of another hook (useEffect/useMemo) and you need it to
 *   stay referentially stable.
 * Interview question: If a component isn't wrapped in React.memo, does
 *   wrapping its callback prop in useCallback help performance?
 * Answer: No — useCallback only pays off when something downstream
 *   actually compares the function's reference (React.memo's shallow
 *   prop comparison, or a dependency array). If the child re-renders
 *   regardless because it isn't memoized, useCallback just adds bookkeeping
 *   overhead for no benefit. useCallback and React.memo are a matched pair.
 */

// Wrapped in memo() so it only re-renders when its props actually change
// by reference/value — this is what makes useCallback meaningful here.
const ExpensiveChild = memo(function ExpensiveChild({ onIncrement, label }) {
  console.log(`ExpensiveChild (${label}) rendered`)
  return (
    <div className="demo-row">
      <button onClick={onIncrement}>Increment via "{label}" child</button>
    </div>
  )
})

function UseCallbackDemo() {
  const [count, setCount] = useState(0)
  const [unrelatedText, setUnrelatedText] = useState('')

  // Without useCallback, this arrow function is a brand-new reference on
  // every render, so ExpensiveChild's memo() comparison would always see
  // a "changed" prop and re-render anyway.
  const badHandler = () => setCount((c) => c + 1)

  // With useCallback and an empty dep array, this reference stays stable
  // across renders, so ExpensiveChild ("good") skips re-rendering when
  // only unrelatedText changes.
  const goodHandler = useCallback(() => setCount((c) => c + 1), [])

  return (
    <div>
      <ConceptInfo
        title="useCallback"
        definition="Returns the same function reference across renders as long as its dependencies haven't changed, instead of creating a new one each time."
        whenToUse="Stabilizing a callback passed to a React.memo-wrapped child, or as a dependency of another hook to prevent that hook from re-running unnecessarily."
        question="You wrap every event handler in a component with useCallback out of habit. Is that a good practice?"
        answer="Not by default — useCallback has its own cost, and if the handler is only ever used inline (e.g. onClick={handler} on a plain <button>, not passed to a memoized child or hook dependency), memoizing it buys nothing. Use it deliberately where reference stability actually matters, not everywhere."
      />

      <div className="demo-panel">
        <h3>Open devtools console to see which child re-renders</h3>
        <p>
          count = <span className="badge">{count}</span>
        </p>
        <input
          value={unrelatedText}
          onChange={(e) => setUnrelatedText(e.target.value)}
          placeholder="Type here — unrelated state, triggers a re-render"
        />
        <ExpensiveChild onIncrement={badHandler} label="bad (new fn every render)" />
        <ExpensiveChild onIncrement={goodHandler} label="good (useCallback)" />
        <p>
          Typing above re-renders the parent. Watch the console: the "bad"
          child logs a render every keystroke (new function reference every
          time defeats memo), while the "good" child only logs once, on
          mount, and again only if <code>count</code>'s logic actually
          required a new callback.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useCallback with a stale dependency array is
        a common bug — if `goodHandler` needed to read `count` directly
        (instead of using the functional updater{' '}
        <code>{'c => c + 1'}</code>), omitting
        `count` from the deps would capture a stale value forever. The
        functional updater form sidesteps needing `count` as a dependency
        at all.
      </div>
    </div>
  )
}

export default UseCallbackDemo
