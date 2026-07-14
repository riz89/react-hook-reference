import { useReducer } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useReducer
 * ------------------------------------------------------------------
 * Definition: An alternative to useState for managing state via a
 *   reducer function `(state, action) => newState`, similar to Redux.
 * When to use: When the next state depends on the previous state in
 *   complex ways, when multiple sub-values update together, or when
 *   many event handlers need to update the same state shape — keeping
 *   the update logic in one place instead of scattered setters.
 * Interview question: How is useReducer different from useState under
 *   the hood, and when would you pick it over useState?
 * Answer: useState is actually implemented on top of the same
 *   reducer-based internal mechanism (its "reducer" just replaces the
 *   value). useReducer is preferable when state transitions are
 *   numerous/interrelated (e.g. a form wizard, undo/redo, a cart) because
 *   it centralizes "what happened" (the action) separately from "how
 *   state changes" (the reducer), making the logic easier to test and
 *   reason about, and easy to pass just `dispatch` down without
 *   re-creating callbacks.
 */

const initialState = { count: 0, history: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
        history: [...state.history, `+1 -> ${state.count + 1}`],
      }
    case 'decrement':
      return {
        count: state.count - 1,
        history: [...state.history, `-1 -> ${state.count - 1}`],
      }
    case 'reset':
      return initialState
    case 'setTo':
      return {
        count: action.payload,
        history: [...state.history, `set -> ${action.payload}`],
      }
    default:
      // Interview gotcha: always throw or return state unchanged for
      // unknown actions instead of silently returning undefined.
      throw new Error(`Unknown action: ${action.type}`)
  }
}

function UseReducerDemo() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <ConceptInfo
        title="useReducer"
        definition="Manages state transitions through a pure (state, action) => newState reducer function."
        whenToUse="Complex or interrelated state updates, e.g. multi-step forms, undo/redo stacks, or when several handlers mutate the same object."
        question="Why might useReducer be a better fit than several useState calls for a shopping cart?"
        answer="A cart has cross-cutting updates (add item can also change total, item count, and discount eligibility together). A reducer expresses all these transitions as one pure function keyed off action types, avoiding scattered setState calls that can get out of sync, and making the logic unit-testable without rendering a component."
      />

      <div className="demo-panel">
        <h3>Counter with history (reducer pattern)</h3>
        <div className="demo-row">
          <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
          <span className="badge">count = {state.count}</span>
          <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
          <button onClick={() => dispatch({ type: 'setTo', payload: 100 })}>
            Set to 100
          </button>
          <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
        <h4>Action history</h4>
        <ul className="log-list">
          {state.history.length === 0 && <li>(no actions yet)</li>}
          {state.history.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> the reducer must be a pure function — no
        API calls, no mutating `state` in place, no random values or
        `Date.now()` directly inside it. Side effects belong in an event
        handler or a useEffect that reacts to the resulting state.
      </div>
    </div>
  )
}

export default UseReducerDemo
