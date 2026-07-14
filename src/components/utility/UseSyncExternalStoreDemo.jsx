import { useSyncExternalStore } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useSyncExternalStore
 * ------------------------------------------------------------------
 * Definition: Safely subscribes a component to a store that lives
 *   OUTSIDE React (browser APIs, a third-party state library, a
 *   WebSocket connection) by taking a `subscribe` function and a
 *   `getSnapshot` function, and re-rendering the component whenever the
 *   store notifies of a change.
 * When to use: Reading any state that isn't owned by React itself —
 *   window.navigator.onLine, window size, a Redux-like external store,
 *   localStorage changes from another tab — anywhere you'd otherwise be
 *   tempted to useState + useEffect(subscribe/unsubscribe) by hand.
 * Interview question: Before useSyncExternalStore existed, people
 *   subscribed to external stores with useState + useEffect. What
 *   problem did useSyncExternalStore specifically fix?
 * Answer: The manual useState+useEffect pattern is prone to "tearing"
 *   under React's concurrent rendering — different parts of the tree
 *   could read the external store at different points in time during a
 *   single render, showing inconsistent values. useSyncExternalStore
 *   guarantees a consistent snapshot across the whole render, and forces
 *   a synchronous re-render when the store changes, avoiding tearing.
 */

// A tiny store that lives entirely outside React — plain module state
// with a subscribe/notify mechanism, similar to how a state library or
// a browser API might be shaped.
const externalStore = {
  count: 0,
  listeners: new Set(),
  increment() {
    this.count += 1
    this.listeners.forEach((listener) => listener())
  },
  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  },
  getSnapshot() {
    return this.count
  },
}

function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
      return () => {
        window.removeEventListener('online', callback)
        window.removeEventListener('offline', callback)
      }
    },
    () => navigator.onLine, // client snapshot
    () => true, // server snapshot (SSR fallback)
  )
}

function UseSyncExternalStoreDemo() {
  const count = useSyncExternalStore(
    (listener) => externalStore.subscribe(listener),
    () => externalStore.getSnapshot(),
  )
  const isOnline = useOnlineStatus()

  return (
    <div>
      <ConceptInfo
        title="useSyncExternalStore"
        definition="Subscribes to and reads a store outside React's own state system in a way that's safe under concurrent rendering (no tearing)."
        whenToUse="Any external data source: browser APIs (online status, media queries), third-party state containers, WebSocket/event-emitter driven state."
        question="What are the three arguments to useSyncExternalStore, and why is the third one optional?"
        answer="subscribe(callback) registers a listener and returns an unsubscribe function; getSnapshot() returns the current value and must return a cached/stable reference if nothing changed (else it can cause infinite loops); the optional getServerSnapshot() provides a value for server-side rendering, since something like navigator.onLine doesn't exist on the server — omitting it (when not doing SSR) is fine, but including it prevents a hydration mismatch error for SSR apps."
      />

      <div className="demo-panel">
        <h3>External (non-React) store</h3>
        <div className="demo-row">
          <button onClick={() => externalStore.increment()}>
            Increment external store
          </button>
          <span className="badge">count = {count}</span>
        </div>
        <p>
          <code>externalStore</code> is a plain JS object defined outside
          any component — useSyncExternalStore is what makes React
          re-render this component when it changes.
        </p>
      </div>

      <div className="demo-panel">
        <h3>Browser API: navigator.onLine</h3>
        <p>
          Status:{' '}
          <span className="badge">{isOnline ? 'Online' : 'Offline'}</span>{' '}
          — try toggling your network connection or devtools "offline"
          throttling.
        </p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> getSnapshot must return a value that is
        reference-stable when nothing has changed (e.g. don't return a
        brand-new object/array literal every call) — otherwise React sees
        a "different" snapshot on every render and can loop or re-render
        excessively.
      </div>
    </div>
  )
}

export default UseSyncExternalStoreDemo
