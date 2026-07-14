import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useImperativeHandle (with forwardRef)
 * ------------------------------------------------------------------
 * Definition: Customizes the value exposed to a parent when it attaches
 *   a ref to a child component — instead of exposing the raw DOM node,
 *   you expose a curated object of methods/values (forwardRef is what
 *   lets the child accept a ref from its parent at all).
 * When to use: Building a reusable component (custom input, modal,
 *   video player) where the parent occasionally needs to imperatively
 *   trigger something (focus, scrollIntoView, play/pause, open/close)
 *   that doesn't fit naturally as a prop, while keeping the internal DOM
 *   structure encapsulated.
 * Interview question: Why is exposing `{ focus, clear }` via
 *   useImperativeHandle usually better than just forwarding the raw
 *   input ref to the parent?
 * Answer: Forwarding the raw DOM node gives the parent unrestricted
 *   access to the entire DOM API (it could set .value directly,
 *   bypassing React's state and causing the UI to desync, or remove
 *   attributes React relies on). useImperativeHandle lets the child
 *   define a minimal, intentional public API — only the specific
 *   imperative actions it wants to support — keeping the internal
 *   implementation free to change without breaking parents.
 */

const CustomInput = forwardRef(function CustomInput(props, ref) {
  const inputRef = useRef(null)

  // The parent's ref will receive THIS object, not the raw <input> DOM
  // node — a deliberately small, intentional API.
  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus()
    },
    clear() {
      inputRef.current.value = ''
    },
    // Note: no way for the parent to do inputRef.current.remove() or
    // read arbitrary DOM properties — only focus/clear are exposed.
  }))

  return <input ref={inputRef} placeholder="Custom input" {...props} />
})

function UseImperativeHandleDemo() {
  const customInputRef = useRef(null)
  const [log, setLog] = useState([])

  const addLog = (msg) => setLog((l) => [...l.slice(-4), msg])

  return (
    <div>
      <ConceptInfo
        title="useImperativeHandle + forwardRef"
        definition="forwardRef lets a component receive a ref from its parent; useImperativeHandle lets that component decide exactly what the ref exposes instead of the raw DOM node."
        whenToUse="Reusable UI primitives (inputs, modals, media players) where a parent occasionally needs imperative control (focus, open, play) that doesn't map cleanly to props/state."
        question="Can you use useImperativeHandle without forwardRef?"
        answer="In React 19, function components can receive `ref` directly as a regular prop, so forwardRef is becoming optional for the ref-passing part — but useImperativeHandle itself still needs an actual ref object to attach its custom handle to, whichever way that ref reaches the component. In React 18 and earlier, forwardRef was required to even receive a ref as the second argument."
      />

      <div className="demo-panel">
        <h3>Parent imperatively calls custom methods on the child</h3>
        <CustomInput ref={customInputRef} />
        <div className="demo-row">
          <button
            onClick={() => {
              customInputRef.current.focus()
              addLog('Called ref.current.focus()')
            }}
          >
            Focus
          </button>
          <button
            onClick={() => {
              customInputRef.current.clear()
              addLog('Called ref.current.clear()')
            }}
          >
            Clear
          </button>
        </div>
        <ul className="log-list">
          {log.length === 0 && <li>(no calls yet)</li>}
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> reaching for imperative refs is usually a
        last resort — most parent/child communication should flow through
        props and state ("declarative" React). Overusing
        useImperativeHandle to sidestep passing proper props/callbacks
        makes data flow harder to trace.
      </div>
    </div>
  )
}

export default UseImperativeHandleDemo
