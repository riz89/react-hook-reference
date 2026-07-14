import { useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * Conditional Rendering & List Rendering with Keys
 * ------------------------------------------------------------------
 * Definition: Conditional rendering shows/hides JSX based on a
 *   condition (ternaries, &&, early returns); list rendering maps an
 *   array to elements, each needing a stable, unique `key` prop so
 *   React can track identity across re-renders.
 * When to use: Conditional rendering for any UI that depends on
 *   state/props (loading states, empty states, role-based UI). List
 *   rendering + keys for anything backed by an array — always give keys
 *   that are stable and unique among siblings, ideally from your data
 *   (an id), not the array index.
 * Interview question: Why is using the array index as a key considered
 *   an anti-pattern, and when is it actually acceptable?
 * Answer: React uses keys to match list items between renders so it can
 *   reuse DOM nodes/state instead of destroying and recreating them. If
 *   the list can be reordered, filtered, or have items inserted/removed
 *   from the middle, index-as-key causes items to be matched to the
 *   WRONG data after the change — e.g. an input's local state can end up
 *   attached to the wrong row. It's acceptable only for lists that are
 *   fully static and never reordered/filtered/have items added or
 *   removed.
 */

const initialTodos = [
  { id: 1, text: 'Review closures', done: true },
  { id: 2, text: 'Practice useReducer', done: false },
  { id: 3, text: 'Mock interview', done: false },
]

function ConditionalAndLists() {
  const [todos, setTodos] = useState(initialTodos)
  const [showDoneOnly, setShowDoneOnly] = useState(false)
  const [useIndexAsKey, setUseIndexAsKey] = useState(false)

  const toggleTodo = (id) =>
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const removeFirst = () => setTodos((list) => list.slice(1))

  const visibleTodos = showDoneOnly ? todos.filter((t) => t.done) : todos

  return (
    <div>
      <ConceptInfo
        title="Conditional & List Rendering"
        definition="Conditionally include/exclude JSX based on logic; render arrays of data as elements, each needing a stable `key`."
        whenToUse="Conditional rendering: loading/empty/error/role-based states. List rendering: any array-backed UI — always pair with a real, stable id as the key."
        question="This todo list has a text input rendered per row (imagine each row also had an editable input). If you delete the first item while using array index as key, what visibly breaks?"
        answer="After deletion, React reuses each position's existing DOM node/component instance by key. Since indices shift up by one, the node that WAS index 1 (with its own input focus/typed text) is now matched to index 0's data — so the remaining rows visually show the wrong todo text still tied to the old input state/focus, even though the underlying array is correct. Using todo.id as key avoids this because each id always maps to the same row identity."
      />

      <div className="demo-panel">
        <h3>Conditional rendering</h3>
        <label className="demo-row">
          <input
            type="checkbox"
            checked={showDoneOnly}
            onChange={(e) => setShowDoneOnly(e.target.checked)}
          />
          Show completed only
        </label>
        {visibleTodos.length === 0 ? (
          <p>No todos to show.</p>
        ) : (
          <p>{visibleTodos.length} todo(s) shown.</p>
        )}
      </div>

      <div className="demo-panel">
        <h3>List rendering with keys</h3>
        <label className="demo-row">
          <input
            type="checkbox"
            checked={useIndexAsKey}
            onChange={(e) => setUseIndexAsKey(e.target.checked)}
          />
          Use array index as key (anti-pattern — toggle to compare)
        </label>
        <button onClick={removeFirst}>Remove first item</button>
        <ul className="log-list">
          {visibleTodos.map((todo, index) => (
            <li key={useIndexAsKey ? index : todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                {todo.done ? <s>{todo.text}</s> : todo.text}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> mixing <code>&&</code> with a value that
        can be <code>0</code> is a classic bug —{' '}
        <code>{'{count && <List />}'}</code> renders the literal text{' '}
        <code>0</code> when count is 0, instead of nothing. Use{' '}
        <code>{'{count > 0 && <List />}'}</code> or a ternary instead.
      </div>
    </div>
  )
}

export default ConditionalAndLists
