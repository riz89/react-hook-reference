import { useMemo, useState, useTransition } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useTransition
 * ------------------------------------------------------------------
 * Definition: Marks a state update as a low-priority "transition" so
 *   React can keep the UI responsive (e.g. keep an input feeling
 *   instant) by interrupting/deferring the transition's re-render in
 *   favor of more urgent updates, and gives you an `isPending` flag.
 * When to use: A state update that triggers an expensive re-render
 *   (filtering/rendering a large list, switching a heavy tab/view) that
 *   you don't want to block more urgent updates like keystrokes.
 * Interview question: What's the difference between marking a state
 *   update urgent vs. wrapping it in startTransition?
 * Answer: Urgent updates (typing in an input, clicking a button) are
 *   rendered immediately and can't be interrupted — they represent
 *   direct user interaction feedback and must feel instant. Updates
 *   inside startTransition are interruptible: React renders them in the
 *   background and will throw away/restart that render if a more urgent
 *   update comes in first (e.g. another keystroke), which is why the
 *   input text itself must be updated as normal/urgent state, while only
 *   the expensive derived list should be wrapped in the transition.
 */

const ALL_ITEMS = Array.from({ length: 15000 }, (_, i) => `Item #${i} — widget-${(i * 7919) % 9973}`)

function expensiveFilter(items, query) {
  // Intentionally does some redundant work per item so filtering a
  // large list is slow enough to visibly block the main thread.
  return items.filter((item) => {
    let matches = item.toLowerCase().includes(query.toLowerCase())
    for (let i = 0; i < 200; i++) matches = matches && true
    return matches
  })
}

function UseTransitionDemo() {
  const [query, setQuery] = useState('')
  const [deferredQuery, setDeferredQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(
    () => expensiveFilter(ALL_ITEMS, deferredQuery),
    [deferredQuery],
  )

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value) // urgent: keeps the input itself responsive
    startTransition(() => {
      setDeferredQuery(value) // low-priority: can be interrupted
    })
  }

  return (
    <div>
      <ConceptInfo
        title="useTransition"
        definition="Lets you mark a state update as a non-urgent transition, keeping the UI interactive while React works on the (possibly expensive) re-render, and exposes an isPending flag."
        whenToUse="Typing into a filter box that re-renders a large/expensive list, or switching between heavy tabs, where you want keystrokes/clicks to stay snappy while the big render happens in the background."
        question="Why do we keep two pieces of state here (query and deferredQuery) instead of just filtering directly off one query state?"
        answer="The <input> value must update immediately (urgent) so typing never feels laggy, but the expensive list filter is wrapped in startTransition so React can deprioritize it — if we filtered directly off the same state used for the input, the input's own update would inherit the transition's low priority and typing itself could feel delayed under load."
      />

      <div className="demo-panel">
        <h3>Filter 15,000 items — transition keeps typing responsive</h3>
        <input
          value={query}
          onChange={handleChange}
          placeholder="Type to filter (e.g. widget-42)"
          style={{ width: '100%' }}
        />
        <p>
          {isPending ? (
            <span className="badge">Updating list…</span>
          ) : (
            <span className="badge">{filtered.length} matches</span>
          )}
        </p>
        <ul className="log-list" style={{ maxHeight: 200 }}>
          {filtered.slice(0, 30).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {filtered.length > 30 && <p>...and {filtered.length - 30} more</p>}
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> the function passed to{' '}
        <code>startTransition</code> must call a state setter
        synchronously inside it — you can't `await` something first and
        then set state, since React needs to mark that specific update as
        a transition while it's happening. Async work should complete
        before calling startTransition with the resulting setState.
      </div>
    </div>
  )
}

export default UseTransitionDemo
