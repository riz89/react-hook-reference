import { useEffect, useRef, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useRef
 * ------------------------------------------------------------------
 * Definition: Returns a mutable `{ current: value }` object that
 *   persists across renders WITHOUT causing a re-render when changed.
 * When to use: Storing a DOM node reference (focus/measure/scroll),
 *   or storing any mutable value you need to read/write across renders
 *   that should NOT trigger a re-render (timers, previous values,
 *   instance-like variables).
 * Interview question: What's the difference between useRef and
 *   useState, and why doesn't updating a ref re-render the component?
 * Answer: useState's setter schedules a re-render because React needs
 *   to reflect the new value in the UI; useRef's `.current` is just a
 *   plain mutable box React hands back untouched between renders — it
 *   exists outside the render/re-render cycle entirely, so mutating it
 *   has no signaling effect on React. That makes it perfect for values
 *   that affect behavior but not what's rendered (e.g. a DOM node, an
 *   interval ID, a "did this effect already run" flag).
 */
function UseRefDemo() {
  const inputRef = useRef(null)
  const renderCount = useRef(0)
  const intervalRef = useRef(null)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [text, setText] = useState('')
  const prevTextRef = useRef('')

  // Runs on every render, but reading/writing renderCount.current never
  // itself causes a re-render (unlike state).
  useEffect(() => {
    renderCount.current += 1
  })

  // Track the "previous value" pattern — a very common useRef use case.
  useEffect(() => {
    prevTextRef.current = text
  }, [text])

  const startTimer = () => {
    if (intervalRef.current) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRunning(false)
  }

  return (
    <div>
      <ConceptInfo
        title="useRef"
        definition="Holds a mutable value in a .current property that survives re-renders but doesn't trigger them."
        whenToUse="Accessing/focusing a DOM node, storing a timer/interval ID, or remembering a previous value without causing extra renders."
        question="Why is a ref, and not state, the right place to store a setInterval ID?"
        answer="The interval ID is bookkeeping the component needs to clean itself up later — it isn't something the UI renders. Storing it in state would cause a pointless re-render every time you start/stop the timer purely to update an ID nobody displays; a ref lets you stash it silently and read it back in the cleanup function."
      />

      <div className="demo-panel">
        <h3>Focus a DOM node</h3>
        <div className="demo-row">
          <input ref={inputRef} placeholder="Click the button to focus me" />
          <button onClick={() => inputRef.current.focus()}>Focus input</button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>Mutable value that skips re-renders</h3>
        <p>
          This component has rendered <strong>{renderCount.current}</strong>{' '}
          time(s) so far (mutating the ref itself never causes a render —
          you're seeing this update only because other state changes in
          this demo force a re-render anyway).
        </p>
      </div>

      <div className="demo-panel">
        <h3>Timer using a ref to hold the interval ID</h3>
        <div className="demo-row">
          <span className="badge">{seconds}s</span>
          <button onClick={startTimer} disabled={running}>
            Start
          </button>
          <button onClick={stopTimer} disabled={!running}>
            Stop
          </button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>Previous value pattern</h3>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type to see previous value"
        />
        <p>
          Current: <strong>{text}</strong> | Previous:{' '}
          <strong>{prevTextRef.current}</strong>
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> never read or write <code>ref.current</code>{' '}
        during rendering (outside of event handlers/effects) for values
        that affect what's displayed — since mutating it doesn't trigger a
        re-render, the UI can silently go stale. Also, refs are not
        available during the very first render before the DOM has mounted;
        reading <code>inputRef.current</code> at the top of the component
        body (not inside an effect/handler) would be null.
      </div>
    </div>
  )
}

export default UseRefDemo
