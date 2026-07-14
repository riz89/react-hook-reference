import { useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useFetch } from '../../hooks/useFetch'

/**
 * Custom Hooks (composition)
 * ------------------------------------------------------------------
 * Definition: A plain JavaScript function, named starting with `use`,
 *   that calls one or more of React's built-in hooks internally —
 *   there's no special API for "creating" a hook, just normal function
 *   composition following the hook naming convention (which is what lets
 *   React's linter enforce the Rules of Hooks on it).
 * When to use: Whenever the SAME stateful logic (not just JSX) is
 *   needed in more than one component — data fetching, localStorage
 *   sync, form field logic, subscriptions — extract it into a custom
 *   hook instead of copy-pasting useState/useEffect blocks.
 * Interview question: If two components both call the same custom hook,
 *   e.g. useLocalStorage, do they share state?
 * Answer: No — each call to a custom hook gets its own, completely
 *   independent useState/useEffect internally. Calling useLocalStorage
 *   in two components creates two separate pieces of state that happen
 *   to run the same LOGIC (reading/writing the same mechanism), not a
 *   shared store. If you want components to share actual state, you
 *   need Context, prop passing, or an external store — not just calling
 *   the same custom hook in each.
 */
function CustomHookDemo() {
  const [name, setName] = useLocalStorage('interview-prep-name', '')
  const [todoId, setTodoId] = useState(1)
  const { data, error, loading } = useFetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
  )

  return (
    <div>
      <ConceptInfo
        title="Custom Hooks (useLocalStorage + useFetch)"
        definition="A reusable function, prefixed with 'use', that composes built-in hooks to package up stateful logic for reuse across components."
        whenToUse="Any repeated stateful pattern: persisting a value to storage, fetching data, subscribing to an event, managing a form field — extract once, reuse everywhere."
        question="Why must a custom hook's name start with 'use'?"
        answer="It's purely a naming convention, but a load-bearing one — the 'use' prefix is what the ESLint rules-of-hooks plugin (and React itself, conceptually) relies on to know a function follows the Rules of Hooks and can safely call other hooks inside it. A function with the same internal logic but named, say, `getUserData`, wouldn't be checked for hook-call-order violations and could be misused (e.g. called conditionally) without warning."
      />

      <div className="demo-panel">
        <h3>useLocalStorage — persists across page reloads</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name, then reload the page"
        />
        <p>
          Stored value: {name || <em>(empty)</em>} — check localStorage key{' '}
          <code>interview-prep-name</code> in devtools.
        </p>
      </div>

      <div className="demo-panel">
        <h3>useFetch — loading/error/data pattern, reused per id</h3>
        <div className="demo-row">
          <button onClick={() => setTodoId((id) => Math.max(1, id - 1))}>
            Prev
          </button>
          <span className="badge">todo #{todoId}</span>
          <button onClick={() => setTodoId((id) => id + 1)}>Next</button>
        </div>
        {loading && <p>Loading…</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <p>
            <strong>{data.title}</strong> — {data.completed ? 'done' : 'not done'}
          </p>
        )}
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> custom hooks must still follow the Rules
        of Hooks themselves (called at the top level, not conditionally) —
        wrapping a hook in your own function doesn't exempt it from those
        rules, it just relocates where they apply.
      </div>
    </div>
  )
}

export default CustomHookDemo
