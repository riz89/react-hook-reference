import { useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useState
 * ------------------------------------------------------------------
 * Definition: Lets a function component hold local, mutable state that
 *   persists between renders and triggers a re-render when it changes.
 * When to use: Any time a component needs to remember a value across
 *   renders that isn't derivable from props — form fields, toggles,
 *   counters, UI state like "isOpen".
 * Interview question: Why does calling the setter with the same value
 *   sometimes still cause a re-render, and why does clicking a "+1"
 *   button 3 times in one handler only add 1?
 * Answer: React uses Object.is to bail out of re-rendering when the new
 *   state equals the old state by reference (primitives compare by
 *   value, objects/arrays by reference — mutating an object and calling
 *   setState with the same reference will NOT re-render). The "only
 *   adds 1" gotcha happens because state updates inside one handler
 *   are batched and each `setCount(count + 1)` closes over the same
 *   stale `count` from that render; use the updater function form
 *   `setCount(c => c + 1)` to base each update on the latest state.
 */
function UseStateDemo() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')
  const [user, setUser] = useState({ name: 'Ada', age: 30 })

  // Gotcha demo: naive +3 vs correct +3 using the updater function.
  const addThreeWrong = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1) // all three read the same stale `count`
  }

  const addThreeRight = () => {
    setCount((c) => c + 1)
    setCount((c) => c + 1)
    setCount((c) => c + 1) // each one sees the previous updater's result
  }

  const birthday = () => {
    // Must copy the object — mutating `user` directly and calling
    // setUser(user) would be a no-op because the reference is unchanged.
    setUser((prev) => ({ ...prev, age: prev.age + 1 }))
  }

  return (
    <div>
      <ConceptInfo
        title="useState"
        definition="Adds local state to a function component; the setter schedules a re-render."
        whenToUse="Simple, independent pieces of UI state (toggles, inputs, counters) that don't need complex transition logic."
        question='Why does calling setCount(count + 1) three times in a row only increase the count by 1?'
        answer="State updates inside a single event handler are batched, and count is a value captured from the render's closure — all three calls read the same stale value. Use the functional updater form setCount(c => c + 1) so each update builds on the previous one."
      />

      <div className="demo-panel">
        <h3>Counter</h3>
        <div className="demo-row">
          <button onClick={() => setCount((c) => c + 1)}>+1</button>
          <button onClick={() => setCount((c) => c - 1)}>-1</button>
          <span className="badge">count = {count}</span>
        </div>
        <div className="demo-row">
          <button onClick={addThreeWrong}>+3 (wrong, stale closure)</button>
          <button onClick={addThreeRight}>+3 (correct, functional updater)</button>
        </div>
      </div>

      <div className="demo-panel">
        <h3>Text input (primitive state)</h3>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
        />
        <p>You typed: {text || <em>(nothing yet)</em>}</p>
      </div>

      <div className="demo-panel">
        <h3>Object state (must copy, never mutate)</h3>
        <p>
          {user.name} is {user.age} years old.
        </p>
        <button onClick={birthday}>Birthday +1</button>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useState's initial value is only used on the
        very first render. If you pass an expensive computation directly
        (e.g. <code>useState(expensiveCalc())</code>), it runs on every
        render even though the result is discarded — pass a function instead:{' '}
        <code>useState(() =&gt; expensiveCalc())</code> (lazy initialization).
      </div>
    </div>
  )
}

export default UseStateDemo
