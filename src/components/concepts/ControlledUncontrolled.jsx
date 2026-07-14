import { useRef, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * Controlled vs Uncontrolled Form Inputs
 * ------------------------------------------------------------------
 * Definition: A controlled input's value is driven entirely by React
 *   state (`value` + `onChange`) — the DOM never has a value React
 *   doesn't know about. An uncontrolled input manages its own value
 *   internally in the DOM; React reads it on demand via a ref instead
 *   of on every keystroke.
 * When to use: Controlled for anything needing live validation,
 *   conditional disabling, formatting-as-you-type, or syncing multiple
 *   inputs. Uncontrolled for simple forms where you only need the value
 *   on submit, file inputs (which MUST be uncontrolled — you can't set
 *   their value programmatically), or integrating non-React widgets.
 * Interview question: Why can't a file input (`<input type="file">`)
 *   be a controlled component?
 * Answer: For security reasons, browsers don't allow JavaScript to set
 *   a file input's `value` — it can only be set by the user through the
 *   file picker UI, so React can't drive it via a `value` prop the way
 *   it does text inputs. File inputs must be uncontrolled: read the
 *   selected file(s) via a ref (`inputRef.current.files`) when needed.
 */

function ControlledUncontrolled() {
  // Controlled: React state is the single source of truth.
  const [controlledValue, setControlledValue] = useState('')

  // Uncontrolled: the DOM owns the value; we only read it via ref.
  const uncontrolledRef = useRef(null)
  const [lastSubmittedUncontrolled, setLastSubmittedUncontrolled] = useState('')

  const handleUncontrolledSubmit = (e) => {
    e.preventDefault()
    setLastSubmittedUncontrolled(uncontrolledRef.current.value)
  }

  return (
    <div>
      <ConceptInfo
        title="Controlled vs Uncontrolled Inputs"
        definition="Controlled: React state drives the input's value on every render. Uncontrolled: the DOM holds the value; React reads it imperatively via a ref when needed."
        whenToUse="Controlled by default for interactive validation/formatting; uncontrolled for simple submit-time-only forms, file inputs, or wrapping non-React input widgets."
        question="What breaks if you set an input's `value` prop from state but forget the `onChange` handler?"
        answer="React logs a warning and the field becomes read-only from the user's perspective — because the value is pinned to state that never updates, every keystroke re-renders the input back to the same fixed value, so nothing the user types appears to register. Either add onChange to update the state, or drop `value` entirely and use defaultValue for an uncontrolled field."
      />

      <div className="demo-panel">
        <h3>Controlled input</h3>
        <input
          value={controlledValue}
          onChange={(e) => setControlledValue(e.target.value)}
          placeholder="React state drives this on every keystroke"
        />
        <p>Live value: {controlledValue || <em>(empty)</em>}</p>
      </div>

      <div className="demo-panel">
        <h3>Uncontrolled input</h3>
        <form onSubmit={handleUncontrolledSubmit} className="demo-row">
          <input
            ref={uncontrolledRef}
            defaultValue=""
            placeholder="DOM owns this until submit reads it"
          />
          <button type="submit">Read value via ref</button>
        </form>
        <p>Last submitted value: {lastSubmittedUncontrolled || <em>(none yet)</em>}</p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> switching an input between controlled and
        uncontrolled during its lifetime (e.g. `value={undefined}` on some
        renders, a real string on others) triggers a React warning — pick
        one mode for a given input and stick with it; use{' '}
        <code>value={'{state ?? \'\'}'}</code> to avoid accidentally
        passing <code>undefined</code>.
      </div>
    </div>
  )
}

export default ControlledUncontrolled
