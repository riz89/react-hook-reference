import { Suspense, use, useState, createContext } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * use (React 19)
 * ------------------------------------------------------------------
 * Definition: Reads the value of a resource — a Promise (suspending
 *   the component via Suspense until it resolves) or a Context —
 *   directly during render. Unlike other hooks, `use` CAN be called
 *   conditionally / inside loops or after early returns.
 * When to use: Reading an already-in-flight promise (typically one
 *   created by a framework's data layer or a cache, not created fresh
 *   inline every render) to suspend rendering until it resolves, or
 *   reading context conditionally without restructuring the component.
 * Interview question: Why does `use` break the "hooks can't be called
 *   conditionally" rule that applies to useState/useEffect/etc, and
 *   what's the catch with passing it a promise created during render?
 * Answer: `use` isn't tracked by call-order/index like other hooks — it
 *   reads directly from the nearest Suspense/Context mechanism, so
 *   React doesn't need a stable call order for it, which is why it's
 *   safe in conditionals/loops. The catch: if you create a NEW promise
 *   inline on every render (e.g. `use(fetch(...))` directly in the
 *   component body), you get an infinite suspend-retry loop — the
 *   promise must be cached/memoized outside the render (e.g. in a
 *   module-level cache, or created by a framework's data-fetching layer)
 *   so the same promise instance is reused across re-renders.
 */

// A tiny promise cache so the same request isn't re-created every render
// (the classic `use` gotcha called out above).
const userPromiseCache = new Map()
function getUserPromise(id) {
  if (!userPromiseCache.has(id)) {
    userPromiseCache.set(
      id,
      new Promise((resolve) => {
        setTimeout(() => resolve({ id, name: `User #${id}`, joined: 2020 + id }), 1000)
      }),
    )
  }
  return userPromiseCache.get(id)
}

function UserProfile({ id }) {
  // Suspends this component (shows the nearest <Suspense> fallback)
  // until the promise resolves.
  const user = use(getUserPromise(id))
  return (
    <div className="demo-row">
      <span className="badge">{user.name}</span> joined {user.joined}
    </div>
  )
}

// Demonstrates the "use can be conditional" property: unlike
// useContext, this reads context only when `show` is true.
const GreetingContext = createContext('Hello')
function ConditionalGreeting({ show }) {
  if (!show) return <p>(greeting hidden — use() was never called this render)</p>
  const greeting = use(GreetingContext)
  return <p>{greeting}, from a conditionally-called use(context)!</p>
}

function UseHookDemo() {
  const [userId, setUserId] = useState(1)
  const [showGreeting, setShowGreeting] = useState(true)

  return (
    <div>
      <ConceptInfo
        title="use"
        definition="Reads a Promise (suspending until resolved) or a Context during render; unlike other hooks it can be called conditionally."
        whenToUse="Suspending on data-fetching promises (typically from a framework's loader/cache layer), or reading context inside a condition/loop without needing to restructure the component."
        question="What happens if you call use(fetch('/api/user')) directly in a component body with no caching?"
        answer="fetch() creates a brand-new Promise every render. The component suspends, React retries the render, use() sees ANOTHER new promise, suspends again — an infinite loop that never resolves. The promise passed to use() must be a stable reference across renders, typically from a cache, a framework data layer, or state/ref that only creates it once."
      />

      <div className="demo-panel">
        <h3>Suspending on a promise with use()</h3>
        <div className="demo-row">
          <button onClick={() => setUserId((id) => id + 1)}>
            Load next user
          </button>
        </div>
        <Suspense fallback={<p>Loading user…</p>}>
          <UserProfile id={userId} />
        </Suspense>
      </div>

      <div className="demo-panel">
        <h3>Conditionally calling use() on a context</h3>
        <button onClick={() => setShowGreeting((s) => !s)}>
          Toggle greeting
        </button>
        <GreetingContext.Provider value="Hi there">
          <ConditionalGreeting show={showGreeting} />
        </GreetingContext.Provider>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> `use` is not a replacement for
        useEffect-based data fetching in most app code — it's the
        low-level primitive frameworks (like Next.js/Router loaders) build
        on. In hand-rolled apps without a caching data layer, reach for a
        library (React Query, SWR) or useEffect instead of hand-managing a
        promise cache like the one above.
      </div>
    </div>
  )
}

export default UseHookDemo
