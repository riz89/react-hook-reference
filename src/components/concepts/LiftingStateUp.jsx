import { useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * Lifting State Up
 * ------------------------------------------------------------------
 * Definition: When two or more sibling components need to share/stay in
 *   sync with the same piece of state, move that state up to their
 *   closest common parent, which then passes it down as props (and
 *   passes down setters/callbacks for children to update it).
 * When to use: Any time sibling components need to reflect or react to
 *   the same value — a temperature input in Celsius and Fahrenheit that
 *   must stay in sync, a filter control and the list it filters, a
 *   master/detail view.
 * Interview question: You have two sibling inputs that both need to stay
 *   in sync (e.g. Celsius/Fahrenheit). Why can't each just keep its own
 *   local useState?
 * Answer: If each input owns its own independent state, updating one
 *   has no way to inform the other — they're siblings with no direct
 *   communication channel. React data flow is one-directional
 *   (parent -> child via props), so the fix is to lift the single source
 *   of truth (e.g. the temperature in Celsius) to their shared parent,
 *   have the parent compute derived values (Fahrenheit) for display, and
 *   pass an onChange callback down so either input can request an update
 *   through the parent.
 */

function CelsiusInput({ celsius, onCelsiusChange }) {
  return (
    <div className="demo-row">
      <label>Celsius:</label>
      <input
        type="number"
        value={celsius}
        onChange={(e) => onCelsiusChange(Number(e.target.value))}
      />
    </div>
  )
}

function FahrenheitInput({ fahrenheit, onFahrenheitChange }) {
  return (
    <div className="demo-row">
      <label>Fahrenheit:</label>
      <input
        type="number"
        value={fahrenheit}
        onChange={(e) => onFahrenheitChange(Number(e.target.value))}
      />
    </div>
  )
}

function LiftingStateUp() {
  // The parent owns the single source of truth (Celsius); both children
  // are "controlled" from here and stay perfectly in sync.
  const [celsius, setCelsius] = useState(20)
  const fahrenheit = Math.round((celsius * 9) / 5 + 32)

  const handleFahrenheitChange = (f) => {
    setCelsius(Math.round(((f - 32) * 5) / 9))
  }

  return (
    <div>
      <ConceptInfo
        title="Lifting State Up"
        definition="Moving shared state from sibling components to their nearest common parent, which owns the single source of truth and hands data + update callbacks back down."
        whenToUse="Sibling components need to read or update the same logical value — synced form fields, a search box + results list, a selected item shared between a list and a detail panel."
        question="In this Celsius/Fahrenheit example, why does the parent store only celsius (not both celsius and fahrenheit as separate state)?"
        answer="Storing both would let them drift out of sync — nothing forces fahrenheit to update when celsius changes unless you remember to update both together everywhere. Deriving fahrenheit from celsius on every render (a plain calculation, not even needing useMemo since it's cheap) guarantees they can never disagree, which is the same 'single source of truth' principle behind lifting state up in the first place."
      />

      <div className="demo-panel">
        <h3>Two siblings, one source of truth in the parent</h3>
        <CelsiusInput celsius={celsius} onCelsiusChange={setCelsius} />
        <FahrenheitInput
          fahrenheit={fahrenheit}
          onFahrenheitChange={handleFahrenheitChange}
        />
        <p>
          {celsius}°C is {fahrenheit}°F — editing either field updates the
          other because both are derived from/write to the same lifted
          state.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> over-lifting is also a real cost — hoisting
        every piece of state to the top-level App "just in case" causes
        unrelated parts of the tree to re-render on every change. Lift
        state only as far up as the actual sharing requires, not further.
      </div>
    </div>
  )
}

export default LiftingStateUp
