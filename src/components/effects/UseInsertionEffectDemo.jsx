import { useInsertionEffect, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useInsertionEffect
 * ------------------------------------------------------------------
 * Definition: Fires even earlier than useLayoutEffect — right when
 *   React is committing DOM mutations, before any layout effects read
 *   the DOM. It's designed almost exclusively for CSS-in-JS libraries
 *   to inject <style> tags before useLayoutEffect measures layout.
 * When to use: Almost never in application code. Only when writing a
 *   CSS-in-JS library (styled-components, emotion, etc.) that needs to
 *   inject dynamic styles into the document before any effect measures
 *   layout, to avoid layout thrashing / stale style reads.
 * Interview question: Why doesn't useInsertionEffect give you access to
 *   refs, and why can't it schedule further state updates the way
 *   useEffect can?
 * Answer: It runs during the DOM mutation/commit phase itself, before
 *   React has attached the updated refs and before layout effects run —
 *   so ref.current may not yet reflect the latest DOM, and reading
 *   layout at that point isn't safe either. Its sole job is to insert
 *   style rules into the document as early as possible; using it for
 *   general side effects (data fetching, subscriptions) is unsupported
 *   and the wrong tool — use useEffect/useLayoutEffect instead.
 */

// A tiny fake "CSS-in-JS" style injector, the kind of thing this hook
// exists for. Real libraries like styled-components use useInsertionEffect
// internally so that by the time useLayoutEffect runs elsewhere in the
// tree, the stylesheet is already present and layout measurements are
// accurate.
let styleTagInserted = false
function injectDynamicStyle(colorValue) {
  let styleTag = document.getElementById('demo-insertion-style')
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = 'demo-insertion-style'
    document.head.appendChild(styleTag)
    styleTagInserted = true
  }
  styleTag.textContent = `.insertion-demo-box { background: ${colorValue}; transition: background 0.2s; }`
}

function UseInsertionEffectDemo() {
  const [color, setColor] = useState('#e8e8ff')

  useInsertionEffect(() => {
    injectDynamicStyle(color)
  }, [color])

  return (
    <div>
      <ConceptInfo
        title="useInsertionEffect"
        definition="The earliest-firing effect hook — runs during DOM commit, before layout effects, intended for injecting CSS-in-JS style rules."
        whenToUse="Practically only inside CSS-in-JS libraries. Application code should reach for useEffect (side effects) or useLayoutEffect (measure-then-mutate layout) instead."
        question="Why does React even need a third effect timing (useInsertionEffect) in addition to useEffect and useLayoutEffect?"
        answer="Without it, CSS-in-JS libraries had to inject <style> tags inside useLayoutEffect (or worse, during render), which could run after some layout effects elsewhere in the tree had already measured elements using the OLD styles, causing layout thrashing or incorrect measurements. useInsertionEffect guarantees styles are in the DOM before ANY layout effect runs, anywhere in the tree."
      />

      <div className="demo-panel">
        <h3>Dynamic style injected via useInsertionEffect</h3>
        <div className="demo-row">
          <button onClick={() => setColor('#e8e8ff')}>Lavender</button>
          <button onClick={() => setColor('#ffe8cc')}>Peach</button>
          <button onClick={() => setColor('#d9f7d9')}>Mint</button>
        </div>
        <div
          className="insertion-demo-box"
          style={{ padding: 20, borderRadius: 6, marginTop: 10 }}
        >
          This box's background comes from a &lt;style&gt; tag inserted by
          useInsertionEffect ({styleTagInserted ? 'tag created' : 'tag reused'}
          ).
        </div>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> you will almost certainly never write
        useInsertionEffect yourself in app code — it exists for library
        authors. Reaching for it in a normal component is a strong signal
        you actually want useEffect or useLayoutEffect.
      </div>
    </div>
  )
}

export default UseInsertionEffectDemo
