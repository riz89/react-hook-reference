import { useEffect, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * Component Lifecycle, mapped to Hooks
 * ------------------------------------------------------------------
 * Definition: Class components had explicit lifecycle methods
 *   (componentDidMount, componentDidUpdate, componentWillUnmount).
 *   Function components express the same three moments using
 *   useEffect's dependency array and cleanup function instead.
 * When to use: Anywhere you'd have reached for a lifecycle method in a
 *   class — but think in terms of "synchronize with X" rather than
 *   "run this at mount/update/unmount", since that framing leads to
 *   correct dependency arrays more naturally than porting class-based
 *   thinking directly.
 * Interview question: Map componentDidMount, componentDidUpdate, and
 *   componentWillUnmount to their useEffect equivalents.
 * Answer: componentDidMount ≈ useEffect(fn, []) (runs once after first
 *   render). componentDidUpdate ≈ useEffect(fn, [dep1, dep2]) (runs
 *   after the initial render AND after any render where a listed
 *   dependency changed — note this differs from class components, where
 *   componentDidMount and componentDidUpdate are separate methods; a
 *   single effect can cover both by including the deps you care about).
 *   componentWillUnmount ≈ the function RETURNED from useEffect (its
 *   cleanup), which also re-runs before every subsequent execution of
 *   that same effect, not just on final unmount — a key difference from
 *   the class lifecycle's single unmount-only method.
 */

function LifecycleChild({ label }) {
  const [renderCount, setRenderCount] = useState(1)

  // Mount only — analogous to componentDidMount.
  useEffect(() => {
    console.log(`[${label}] mounted (componentDidMount equivalent)`)
    return () => {
      console.log(`[${label}] unmounted (componentWillUnmount equivalent)`)
    }
  }, [label])

  // Runs on mount AND whenever `label` changes — analogous to
  // componentDidMount + componentDidUpdate combined (the class version
  // would need an if-check inside componentDidUpdate to detect which
  // prop changed; useEffect's dependency array does that for you).
  useEffect(() => {
    if (renderCount > 1) {
      console.log(`[${label}] updated (componentDidUpdate equivalent)`)
    }
  }, [label, renderCount])

  return (
    <div className="demo-row">
      <span className="badge">{label}</span>
      <button onClick={() => setRenderCount((c) => c + 1)}>
        Force update ({renderCount})
      </button>
    </div>
  )
}

function LifecycleDemo() {
  const [mounted, setMounted] = useState(true)
  const [label, setLabel] = useState('child-A')

  return (
    <div>
      <ConceptInfo
        title="Lifecycle via Hooks"
        definition="Mount, update, and unmount — previously three separate class lifecycle methods — are all expressed through useEffect's dependency array and cleanup function in function components."
        whenToUse="Any time you're porting class-component intuition ('run on mount', 'clean up on unmount') to hooks, or explaining to an interviewer how the two models relate."
        question="A class component's componentWillUnmount runs exactly once, right before the component is removed. Does a useEffect cleanup function behave the same way?"
        answer="Only for an effect with an empty dependency array ([]) — its cleanup runs once, on unmount, matching componentWillUnmount exactly. But for an effect WITH dependencies, the cleanup runs before EVERY re-run of that effect (i.e. before each dependency change) in addition to running on final unmount — there's no single class equivalent for that repeated 'clean up before the next update' behavior, since class components separate componentDidUpdate and componentWillUnmount."
      />

      <div className="demo-panel">
        <h3>Open devtools console to see lifecycle logs</h3>
        <div className="demo-row">
          <button onClick={() => setMounted((m) => !m)}>
            {mounted ? 'Unmount child' : 'Mount child'}
          </button>
          <button onClick={() => setLabel((l) => (l === 'child-A' ? 'child-B' : 'child-A'))}>
            Change label prop ({label})
          </button>
        </div>
        {mounted && <LifecycleChild label={label} />}
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> in development, React 18/19 StrictMode
        deliberately mounts, unmounts, and re-mounts every component once
        extra (so you'll see double mount/unmount logs) to help surface
        effects with missing/incorrect cleanup — this doesn't happen in
        production builds.
      </div>
    </div>
  )
}

export default LifecycleDemo
