import { useOptimistic, useState, useTransition } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useOptimistic (React 19)
 * ------------------------------------------------------------------
 * Definition: Shows a temporary "optimistic" version of state
 *   immediately while an async action is still in flight, then
 *   automatically reconciles back to the real state once the action
 *   finishes (or reverts if it fails and you don't commit the change).
 * When to use: Actions with a network round-trip where you want the UI
 *   to feel instant — posting a comment, liking a post, toggling a
 *   to-do — showing the expected result right away instead of waiting
 *   for the server to confirm.
 * Interview question: What are the two arguments to useOptimistic, and
 *   what happens if the underlying async action fails?
 * Answer: `useOptimistic(actualState, updateFn)` — actualState is the
 *   real, confirmed state, and updateFn(currentState, optimisticValue)
 *   describes how to merge an optimistic value into it for display.
 *   While the action is pending, the hook returns the optimistic
 *   version; once the action completes and the real state (actualState)
 *   is updated via its setter, React reconciles to that real value. If
 *   the action throws/fails and you never update the real state to
 *   include the optimistic item, React automatically reverts the UI
 *   back to the last real state — so error handling means simply NOT
 *   committing the optimistic change, rather than manually undoing it.
 */

let nextId = 4
const initialComments = [
  { id: 1, text: 'Great write-up!' },
  { id: 2, text: 'Following along, thanks.' },
  { id: 3, text: 'Bookmarked for interview prep.' },
]

async function saveCommentToServer(text) {
  await new Promise((resolve) => setTimeout(resolve, 1200)) // simulate latency
  if (text.toLowerCase().includes('fail')) {
    throw new Error('Server rejected the comment')
  }
  return { id: nextId++, text }
}

function UseOptimisticDemo() {
  const [comments, setComments] = useState(initialComments)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [draft, setDraft] = useState('')

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (currentComments, newText) => [
      ...currentComments,
      { id: 'optimistic-' + newText, text: newText, pending: true },
    ],
  )

  const submitComment = (text) => {
    if (!text.trim()) return
    setErrorMsg('')
    startTransition(async () => {
      addOptimisticComment(text) // shows immediately, tagged pending: true
      try {
        const saved = await saveCommentToServer(text)
        setComments((prev) => [...prev, saved]) // commits -> optimistic entry reconciles away
      } catch (err) {
        setErrorMsg(err.message) // no commit -> React reverts the optimistic entry automatically
      }
    })
    setDraft('')
  }

  return (
    <div>
      <ConceptInfo
        title="useOptimistic"
        definition="Renders a provisional version of state immediately during a pending async action, auto-reverting if the real state update never lands."
        whenToUse="Comment/like/follow buttons, to-do toggles, chat messages — any action with network latency where instant visual feedback matters more than waiting for server confirmation."
        question="Why is useOptimistic paired with useTransition (or a form action) instead of just calling addOptimisticComment directly in an onClick?"
        answer="Optimistic updates need to know when the async action is in flight so React can correctly reconcile/revert the temporary value once it settles. Wrapping the call in a transition (or a useActionState/form action) ties the optimistic update to that pending async work; calling it fully outside any transition-tracked async action leaves React with no clear point to reconcile against."
      />

      <div className="demo-panel">
        <h3>Comments — optimistic UI (try typing "fail" to see revert)</h3>
        <div className="demo-row">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder='Type a comment (or "fail this" to test revert)'
            style={{ flex: 1 }}
          />
          <button onClick={() => submitComment(draft)} disabled={isPending}>
            {isPending ? 'Posting…' : 'Post'}
          </button>
        </div>
        {errorMsg && <p className="badge">Error: {errorMsg} (reverted)</p>}
        <ul className="log-list" style={{ maxHeight: 220 }}>
          {optimisticComments.map((c) => (
            <li key={c.id} style={{ opacity: c.pending ? 0.5 : 1 }}>
              {c.text} {c.pending && '(saving…)'}
            </li>
          ))}
        </ul>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> the optimistic entry must be recognizable
        (here via a temporary id/`pending` flag) because on failure it
        simply disappears when React reverts — without a distinct visual
        state, users can be confused about which items are still
        unconfirmed vs. permanently saved.
      </div>
    </div>
  )
}

export default UseOptimisticDemo
