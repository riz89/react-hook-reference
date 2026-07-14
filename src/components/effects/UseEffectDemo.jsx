import { useEffect, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useEffect
 * ------------------------------------------------------------------
 * Definition: Runs a "synchronization" side effect after the browser
 *   has painted, and optionally re-runs it when its dependencies
 *   change; the function it returns is the cleanup, run before the
 *   next effect and on unmount.
 * When to use: Syncing a component with something outside React —
 *   subscriptions, timers, manual DOM changes, fetching data, logging
 *   analytics. Not for transforming data for rendering (use plain
 *   computation or useMemo) or for responding to user events (put that
 *   logic directly in the event handler).
 * Interview question: Explain what happens with each of these
 *   dependency arrays: no array, an empty array `[]`, and `[value]`.
 * Answer: No array → runs after every render. `[]` → runs once after
 *   the initial mount only (cleanup runs once on unmount). `[value]` →
 *   runs after the initial mount and again after any render where
 *   `value` changed (compared with Object.is); cleanup from the
 *   previous run fires right before the effect re-runs, and also on
 *   unmount.
 */
function UseEffectDemo() {
  const [renderNoDeps, setRenderNoDeps] = useState(0)
  const [count, setCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [log, setLog] = useState([])
  const [showTimer, setShowTimer] = useState(true)

  const addLog = (msg) =>
    setLog((l) => [...l.slice(-6), `${new Date().toLocaleTimeString()} ${msg}`])

  // 1) No dependency array: runs after EVERY render.
  useEffect(() => {
    addLog(`[no deps] effect ran (render #${renderNoDeps + 1})`)
  })

  // 2) Empty dependency array: runs once, after the first render only.
  useEffect(() => {
    addLog('[empty deps] mounted (runs once)')
    return () => addLog('[empty deps] unmounted (cleanup, runs once)')
  }, [])

  // 3) Dependency array with a value: runs on mount + whenever `count`
  //    changes; cleanup runs before each re-run and on unmount.
  useEffect(() => {
    addLog(`[count dep] syncing for count=${count}`)
    return () => addLog(`[count dep] cleanup before next run (was count=${count})`)
  }, [count])

  return (
    <div>
      <ConceptInfo
        title="useEffect (cleanup + dependency array)"
        definition="Synchronizes a component with an external system after paint; the returned function cleans up before the next run and on unmount."
        whenToUse="Subscriptions, event listeners, timers, manual DOM APIs, network requests tied to a component's lifetime — anything outside React's own render output."
        question="Why does an effect subscribing to window resize with an empty dependency array sometimes read a stale value inside its handler?"
        answer="The effect (and the handler closure it creates) only runs once on mount, so any state/props it references are captured from that first render — later updates to those values don't reach the handler, a classic 'stale closure'. Fix by adding the values to the dependency array (so the effect re-subscribes with a fresh closure) or using the functional state-updater form / a ref to always read the latest value."
      />

      <div className="demo-panel">
        <h3>1. No dependency array — runs after every render</h3>
        <button onClick={() => setRenderNoDeps((n) => n + 1)}>
          Force a re-render ({renderNoDeps})
        </button>
      </div>

      <div className="demo-panel">
        <h3>2 &amp; 3. Empty deps vs [count] deps</h3>
        <div className="demo-row">
          <button onClick={() => setCount((c) => c + 1)}>
            count = {count} (click to change)
          </button>
          <button onClick={() => setShowTimer((s) => !s)}>
            {showTimer ? 'Unmount' : 'Mount'} timer below
          </button>
        </div>
        {showTimer && <Timer seconds={seconds} setSeconds={setSeconds} />}
      </div>

      <div className="demo-panel">
        <h3>Effect log</h3>
        <ul className="log-list">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> forgetting cleanup is the #1 useEffect bug —
        an interval/subscription set up in the effect keeps running (and
        can update state on an unmounted-in-spirit closure) unless you
        return a cleanup function that clears it. In development,
        React&nbsp;18/19 StrictMode intentionally mounts, unmounts, and
        re-mounts effects once to help you catch missing cleanup.
      </div>
    </div>
  )
}

// A separate child so we can demonstrate an effect's own mount/cleanup
// (setInterval) independent from the parent's effects above.
function Timer({ seconds, setSeconds }) {
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    // Cleanup: without this, mounting/unmounting Timer repeatedly would
    // leak intervals that keep firing forever.
    return () => clearInterval(id)
  }, [setSeconds])

  return (
    <p>
      Timer running: <span className="badge">{seconds}s</span> (toggle
      "Unmount timer" to see the interval get cleaned up)
    </p>
  )
}

export default UseEffectDemo
