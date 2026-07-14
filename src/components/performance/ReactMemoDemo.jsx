import { memo, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * React.memo
 * ------------------------------------------------------------------
 * Definition: A higher-order component that skips re-rendering a
 *   component if its props are shallowly equal to the previous render's
 *   props (a component-level analog to useMemo/useCallback).
 * When to use: A component that renders often (because its parent
 *   re-renders often) but whose own output rarely changes given the
 *   same props — especially if it's expensive to render (large lists,
 *   complex trees, charts).
 * Interview question: You wrap a component in React.memo, but it still
 *   re-renders every time the parent renders. What's the most likely
 *   cause?
 * Answer: One of its props is a new reference every render — an inline
 *   object/array/function literal (e.g. `<Child options={{ a: 1 }} />`
 *   or `<Child onClick={() => ...} />`) is !== the previous render's
 *   object even if the contents are identical, so memo's shallow
 *   comparison sees a "change" and re-renders anyway. Fix by memoizing
 *   those props with useMemo/useCallback, or passing primitives instead.
 */

const PlainChild = ({ value }) => {
  console.log('PlainChild rendered')
  return <div className="demo-row">Plain child says: {value}</div>
}

const MemoChild = memo(function MemoChild({ value }) {
  console.log('MemoChild rendered')
  return <div className="demo-row">Memoized child says: {value}</div>
})

// A memoized child that still breaks because the object prop is a new
// reference every render — demonstrates the classic gotcha.
const MemoChildWithObjectProp = memo(function MemoChildWithObjectProp({ config }) {
  console.log('MemoChildWithObjectProp rendered')
  return <div className="demo-row">Config color: {config.color}</div>
})

function ReactMemoDemo() {
  const [parentTick, setParentTick] = useState(0)
  const [sharedValue] = useState('constant value')

  return (
    <div>
      <ConceptInfo
        title="React.memo"
        definition="Wraps a component so React can skip re-rendering it when its props are shallowly unchanged from the previous render."
        whenToUse="An expensive-to-render component whose parent re-renders often for unrelated reasons, and whose props are usually stable (primitives, or memoized objects/arrays/functions)."
        question="Does React.memo do a deep comparison of props?"
        answer="No — it does a shallow comparison (Object.is on each prop). Two different object/array literals with identical contents are still considered 'changed', which is why passing inline object/array/function props defeats memo unless they're memoized with useMemo/useCallback (or hoisted to module scope if truly constant)."
      />

      <div className="demo-panel">
        <h3>Open devtools console and click below</h3>
        <button onClick={() => setParentTick((t) => t + 1)}>
          Re-render parent ({parentTick})
        </button>
        <PlainChild value={sharedValue} />
        <MemoChild value={sharedValue} />
        <MemoChildWithObjectProp config={{ color: 'blue' }} />
        <p>
          Each click re-renders the parent. <code>PlainChild</code> logs
          every time. <code>MemoChild</code> only logs once — its prop
          (<code>sharedValue</code>) never changes, so memo skips it.{' '}
          <code>MemoChildWithObjectProp</code> logs every time too, even
          though it's wrapped in memo — the inline{' '}
          <code>{'{ color: "blue" }'}</code> object is a new reference on
          every render.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> React.memo only affects props-based
        re-rendering — if the memoized component itself uses useState,
        useContext, or a subscribed store internally, changes to that
        internal/context state still re-render it regardless of memo.
      </div>
    </div>
  )
}

export default ReactMemoDemo
