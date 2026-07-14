import { useDebugValue, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useDebugValue
 * ------------------------------------------------------------------
 * Definition: Attaches a label to a CUSTOM HOOK's value, visible in
 *   React DevTools next to that hook when inspecting a component — it
 *   has no effect on behavior or rendering, purely a debugging aid.
 * When to use: Inside a custom hook (never inside a component
 *   directly) that you or your team will reuse often, especially one
 *   whose internal state isn't self-explanatory from DevTools alone
 *   (e.g. showing "online" vs "offline" instead of a raw boolean).
 * Interview question: Why would you use the format-function overload
 *   `useDebugValue(value, formatFn)` instead of just
 *   `useDebugValue(someExpensiveLabel)`?
 * Answer: The plain form computes its argument on every render whether
 *   or not DevTools is even open. The format-function overload only
 *   calls `formatFn(value)` when the component is actually being
 *   inspected in DevTools, so you can defer expensive label formatting
 *   (e.g. JSON.stringify-ing a big object) until it's actually needed.
 */

// A custom hook other developers would import and reuse — useDebugValue
// makes its state legible in React DevTools without exposing internals.
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  // Shows up in DevTools as: useToggle: "ON" (or "OFF") next to this
  // hook, instead of just a bare `true`/`false`.
  useDebugValue(value, (v) => (v ? 'ON' : 'OFF'))

  const toggle = () => setValue((v) => !v)
  return [value, toggle]
}

function UseDebugValueDemo() {
  const [isOn, toggle] = useToggle(false)

  return (
    <div>
      <ConceptInfo
        title="useDebugValue"
        definition="Labels a custom hook's internal value for React DevTools inspection — purely a debugging aid with zero runtime/rendering effect."
        whenToUse="Inside reusable custom hooks whose raw state (a boolean, an enum-like string, a status object) benefits from a human-readable label when another developer inspects the component tree in DevTools."
        question="Would useDebugValue ever be appropriate to call directly inside a page component (not a custom hook)?"
        answer="No — useDebugValue only does something useful when called inside a custom hook, because DevTools displays it next to that hook's entry in the hooks list for a component. Calling it directly in a component body has no meaningful DevTools placement to attach to and is not its intended use."
      />

      <div className="demo-panel">
        <h3>Custom useToggle hook, labeled for DevTools</h3>
        <div className="demo-row">
          <button onClick={toggle}>Toggle</button>
          <span className="badge">{isOn ? 'ON' : 'OFF'}</span>
        </div>
        <p>
          Open React DevTools, select this component, and look at the
          "useToggle" hook entry — it shows{' '}
          <code>{isOn ? '"ON"' : '"OFF"'}</code> instead of a bare{' '}
          <code>{String(isOn)}</code>, thanks to{' '}
          <code>useDebugValue(value, v =&gt; v ? 'ON' : 'OFF')</code> inside{' '}
          <code>useToggle</code>.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useDebugValue is invisible in production
        behavior and invisible if you're not using React DevTools — it's
        easy to forget it does nothing for actual app logic, tests, or
        console logs; it's strictly a DevTools UX improvement for hook
        authors.
      </div>
    </div>
  )
}

export default UseDebugValueDemo
