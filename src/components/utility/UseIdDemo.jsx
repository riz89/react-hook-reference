import { useId } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useId
 * ------------------------------------------------------------------
 * Definition: Generates a stable, unique ID string for a component
 *   instance, consistent between server-rendered and client-hydrated
 *   markup.
 * When to use: Linking form elements to labels (`htmlFor` / `id`), or
 *   any `aria-*` attribute that needs to reference another element's ID
 *   — especially inside a reusable component that might be rendered
 *   multiple times on the same page (so hardcoded IDs would collide).
 * Interview question: Why not just use a hardcoded string or an
 *   incrementing counter (e.g. `id={'input-' + count++}`) for form IDs?
 * Answer: A hardcoded ID collides the moment the component is rendered
 *   twice on the same page (e.g. two instances of the same form field
 *   component), breaking label association and a11y. A plain module-level
 *   counter works client-side but can produce different IDs on the
 *   server vs. during client hydration (component render order/timing
 *   can differ), causing a hydration mismatch — useId is specifically
 *   designed to stay consistent across server and client rendering.
 */

// A reusable field component — rendered multiple times below to show
// that each instance gets its own unique, collision-free ID.
function LabeledField({ label }) {
  const id = useId()
  return (
    <div className="demo-row">
      <label htmlFor={id}>{label}:</label>
      <input id={id} type="text" />
      <code>id={id}</code>
    </div>
  )
}

function UseIdDemo() {
  return (
    <div>
      <ConceptInfo
        title="useId"
        definition="Generates a unique, stable ID per component instance that matches between server and client renders."
        whenToUse="Associating <label htmlFor> with an <input id>, or wiring up aria-describedby/aria-labelledby, inside components that might render more than once on a page."
        question="Should useId be used as a React `key` when rendering a list?"
        answer="No — useId generates one ID per component instance, not per list item, and it's not meant for keys (which should come from stable, unique data in the list itself, like a database ID). useId is for accessibility attribute wiring (label/input association, aria-* references)."
      />

      <div className="demo-panel">
        <h3>Same component, rendered 3 times — no ID collisions</h3>
        <LabeledField label="First name" />
        <LabeledField label="Last name" />
        <LabeledField label="Email" />
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useId values look like{' '}
        <code>:r0:</code>, not sequential numbers — don't rely on their
        exact format, and don't use them as data keys or as CSS selectors
        expecting a particular shape; treat them as an opaque string.
      </div>
    </div>
  )
}

export default UseIdDemo
