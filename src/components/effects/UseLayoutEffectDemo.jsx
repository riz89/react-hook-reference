import { useLayoutEffect, useRef, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useLayoutEffect
 * ------------------------------------------------------------------
 * Definition: Same API as useEffect, but fires synchronously after DOM
 *   mutations and BEFORE the browser paints the screen.
 * When to use: When you need to read layout (measure a DOM node's
 *   size/position) and then synchronously make a DOM change before the
 *   user sees anything, to avoid a visible flicker — e.g. positioning a
 *   tooltip based on measured element size.
 * Interview question: Why would using useLayoutEffect everywhere
 *   instead of useEffect hurt performance?
 * Answer: useLayoutEffect blocks the browser from painting until it
 *   finishes running, so any expensive work in it delays the user
 *   seeing the update — whereas useEffect runs after paint
 *   asynchronously and doesn't block rendering. Reach for
 *   useLayoutEffect only for the specific case of measure-then-mutate
 *   layout work; default to useEffect for everything else (data
 *   fetching, subscriptions, logging).
 */
function UseLayoutEffectDemo() {
  const [text, setText] = useState('Short')
  const boxRef = useRef(null)
  const tooltipRef = useRef(null)
  const [tooltipLeft, setTooltipLeft] = useState(0)

  // Measures the box synchronously and positions the tooltip BEFORE the
  // browser paints, so the tooltip never visibly "jumps" after appearing
  // in the wrong spot.
  useLayoutEffect(() => {
    if (!boxRef.current || !tooltipRef.current) return
    const boxWidth = boxRef.current.offsetWidth
    const tooltipWidth = tooltipRef.current.offsetWidth
    setTooltipLeft(boxWidth / 2 - tooltipWidth / 2)
  }, [text])

  return (
    <div>
      <ConceptInfo
        title="useLayoutEffect"
        definition="Fires synchronously after the DOM is updated but before the browser paints — lets you measure and adjust layout with zero visible flicker."
        whenToUse="Measuring a DOM node (size, scroll position) and synchronously applying a layout-dependent style/position before the user sees the frame, e.g. tooltips, auto-scrolling, animations that depend on measured size."
        question="You have a component that fetches data and one that measures/repositions a tooltip. Which uses useEffect and which uses useLayoutEffect, and why?"
        answer="Data fetching should use useEffect — it's not layout-related, doesn't need to block painting, and blocking the paint on a network request would freeze the UI. The tooltip positioning should use useLayoutEffect because it reads layout (element size) and must apply a corresponding style change before the browser paints, otherwise the user briefly sees the tooltip in the wrong position (a flicker)."
      />

      <div className="demo-panel">
        <h3>Tooltip centered via measured width (no flicker)</h3>
        <div className="demo-row">
          <button onClick={() => setText('Short')}>Short label</button>
          <button onClick={() => setText('A much longer label here')}>
            Long label
          </button>
        </div>
        <div style={{ position: 'relative', marginTop: 40, display: 'inline-block' }}>
          <div
            ref={boxRef}
            style={{
              padding: '10px 24px',
              background: '#e8e8ff',
              borderRadius: 6,
              minWidth: 200,
              textAlign: 'center',
            }}
          >
            {text}
          </div>
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              top: -30,
              left: tooltipLeft,
              background: '#1e1e2e',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: '0.8em',
              whiteSpace: 'nowrap',
            }}
          >
            I'm centered above the box
          </div>
        </div>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useLayoutEffect doesn't run at all during
        server-side rendering (there's no DOM to measure), and React logs
        a warning if it's used in an SSR component — for SSR-safe
        measuring effects, either guard for the browser environment or use
        `useEffect` and accept a possible one-frame flicker.
      </div>
    </div>
  )
}

export default UseLayoutEffectDemo
