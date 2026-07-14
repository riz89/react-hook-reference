import { useDeferredValue, useMemo, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useDeferredValue
 * ------------------------------------------------------------------
 * Definition: Returns a "lagging" copy of a value that React updates at
 *   lower priority — it trails behind the real value during expensive
 *   renders instead of blocking them, then catches up once free.
 * When to use: Similar goal to useTransition (keep the UI responsive
 *   during an expensive render) but for when you're just handed a value
 *   (e.g. via props, or from a value you don't own the setter for) and
 *   can't wrap the original setState call in startTransition yourself.
 * Interview question: How is useDeferredValue different from debouncing
 *   or throttling the input?
 * Answer: Debounce/throttle are TIME-based — they wait a fixed delay
 *   before updating, regardless of how fast the device is, so they add
 *   artificial latency even on fast machines. useDeferredValue is
 *   render-based — React tries to render the deferred update immediately,
 *   and only falls behind if there's actually other urgent work
 *   competing for the main thread, so on a fast device it can feel
 *   instant, while on a slow device it naturally protects responsiveness
 *   without you tuning a delay constant.
 */

const ALL_ITEMS = Array.from({ length: 15000 }, (_, i) => `Row #${i} — sku-${(i * 104729) % 99991}`)

function expensiveFilter(items, query) {
  return items.filter((item) => {
    let matches = item.toLowerCase().includes(query.toLowerCase())
    for (let i = 0; i < 200; i++) matches = matches && true
    return matches
  })
}

function UseDeferredValueDemo() {
  const [query, setQuery] = useState('')
  // No second piece of state and no startTransition needed — deferredQuery
  // automatically trails behind `query` under load and catches up when idle.
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery

  const filtered = useMemo(
    () => expensiveFilter(ALL_ITEMS, deferredQuery),
    [deferredQuery],
  )

  return (
    <div>
      <ConceptInfo
        title="useDeferredValue"
        definition="Gives you a version of a value that 'lags behind' during expensive updates, letting the urgent parts of the UI (like the input) stay responsive without maintaining a second state variable."
        whenToUse="You receive a value (state, prop, or context) and want to use it to drive an expensive render without slowing down more urgent updates, but you don't control (or don't want to duplicate) the state setter — unlike useTransition, you don't need to wrap any setState call."
        question="Given both exist, when would you reach for useDeferredValue instead of useTransition?"
        answer="useTransition is for when YOU trigger the state update and can wrap the setState call in startTransition (e.g. inside an onChange handler). useDeferredValue is for when you only have the value itself — e.g. it arrives as a prop from a parent, or you want to defer rendering of a value without controlling where it's set — so you derive a deferred copy locally instead of needing access to the original setter."
      />

      <div className="demo-panel">
        <h3>Filter 15,000 items — useDeferredValue, no extra state needed</h3>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to filter (e.g. sku-42)"
          style={{ width: '100%' }}
        />
        <p>
          <span className="badge">{filtered.length} matches</span>{' '}
          {isStale && <span className="badge">showing stale results…</span>}
        </p>
        <ul
          className="log-list"
          style={{ maxHeight: 200, opacity: isStale ? 0.5 : 1 }}
        >
          {filtered.slice(0, 30).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {filtered.length > 30 && <p>...and {filtered.length - 30} more</p>}
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useDeferredValue doesn't make the
        expensive computation itself faster or debounce anything — it
        only changes WHEN React commits the render using the new value. If
        the child that consumes it isn't memoized (React.memo), it will
        still re-render for every intermediate deferred value as React
        catches up, so pair it with memoization for the full benefit.
      </div>
    </div>
  )
}

export default UseDeferredValueDemo
