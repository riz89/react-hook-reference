import { createContext, useContext, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useContext
 * ------------------------------------------------------------------
 * Definition: Reads the current value of a Context, subscribing the
 *   component to updates whenever the nearest matching Provider's
 *   value changes.
 * When to use: Sharing data that many components at different nesting
 *   depths need (theme, current user, locale, auth) without manually
 *   threading props through every intermediate component (see the
 *   separate "Props & Prop Drilling" example for the problem this
 *   solves).
 * Interview question: If a Context value is an object created inline
 *   in the Provider's render (e.g. `value={{ a, b }}`), what problem
 *   can that cause?
 * Answer: A new object is created every render, so every consumer of
 *   that context re-renders even if `a` and `b` didn't actually change,
 *   because Object.is comparison sees a new reference each time. Fix it
 *   by memoizing the value with useMemo, or splitting into multiple
 *   contexts / stable primitive values.
 */

const ThemeContext = createContext(null)

function ThemedButton() {
  // No props were passed down to get here — this button reads theme
  // directly from context, however deep it is in the tree.
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'dark' ? '#1e1e2e' : '#fff',
        color: theme === 'dark' ? '#fff' : '#1e1e2e',
        border: '1px solid #888',
      }}
    >
      Current theme: {theme} (click to toggle)
    </button>
  )
}

function Toolbar() {
  // Toolbar doesn't use theme at all — it's just a pass-through layer,
  // and with context it needs zero knowledge of theme to render its child.
  return (
    <div className="demo-row">
      <ThemedButton />
    </div>
  )
}

function UseContextDemo() {
  const [theme, setTheme] = useState('light')
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  return (
    <div>
      <ConceptInfo
        title="useContext"
        definition="Subscribes a component to a Context's current value, provided by the nearest ancestor <Context.Provider>."
        whenToUse="Global-ish, rarely-changing data needed by many components at different depths: theming, authenticated user, locale, feature flags."
        question="Why shouldn't Context be used as a general-purpose replacement for all prop passing / state management?"
        answer="Every component consuming a context re-renders whenever the provider's value changes, with no built-in way to subscribe to just part of it — so a context holding lots of unrelated fast-changing state causes broad re-renders. Context is best for stable/low-frequency values; for complex or frequently-updating state, dedicated state management (useReducer, a store library) with more granular subscriptions works better."
      />

      <div className="demo-panel">
        <h3>Theme toggled from deep inside the tree via useContext</h3>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Toolbar />
        </ThemeContext.Provider>
        <p>
          <code>Toolbar</code> renders <code>ThemedButton</code> without ever
          touching <code>theme</code> as a prop.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> a Provider's <code>value</code> prop
        created inline (a new object literal every render) causes every
        consumer to re-render on every Provider render, even when the
        meaningful data hasn't changed. Wrap it in{' '}
        <code>useMemo(() =&gt; ({'{'} theme, toggleTheme {'}'}), [theme])</code>{' '}
        to keep the reference stable.
      </div>
    </div>
  )
}

export default UseContextDemo
