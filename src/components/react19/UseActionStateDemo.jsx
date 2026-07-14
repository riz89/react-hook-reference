import { useActionState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useActionState (React 19)
 * ------------------------------------------------------------------
 * Definition: Wires a form (or any) action function to React state,
 *   returning `[state, formAction, isPending]` — `state` is the action's
 *   last return value, `formAction` is what you pass to a <form
 *   action={formAction}>, and `isPending` tracks in-flight submissions,
 *   all without manually wiring useState + isLoading + try/catch.
 * When to use: Handling form submissions (especially with Server
 *   Actions in a framework, but works with plain async client functions
 *   too) where you want submission status and the resulting
 *   success/error state managed for you.
 * Interview question: Before React 19, how would you have built this
 *   "pending + result" pattern, and what does useActionState save you?
 * Answer: Typically with useState for the result, a separate useState
 *   for isSubmitting/isPending, and manual try/catch/finally around an
 *   async handler to flip those flags — repeated in every form.
 *   useActionState collapses all of that into one hook: it automatically
 *   tracks pending status for you, threads the previous state into the
 *   action function as its first argument (handy for cumulative
 *   results), and integrates with <form action={...}> so it also works
 *   with progressive enhancement (no JS) when used with Server Actions.
 */

// The action function: receives the PREVIOUS state and the submitted
// FormData, returns the new state. Can be async — useActionState tracks
// the pending period for you.
async function subscribeAction(previousState, formData) {
  const email = formData.get('email')
  await new Promise((resolve) => setTimeout(resolve, 900)) // simulate network

  if (!email || !email.includes('@')) {
    return { status: 'error', message: 'Please enter a valid email.', count: previousState.count }
  }
  return {
    status: 'success',
    message: `Subscribed ${email}!`,
    count: previousState.count + 1,
  }
}

function UseActionStateDemo() {
  const [state, formAction, isPending] = useActionState(subscribeAction, {
    status: 'idle',
    message: '',
    count: 0,
  })

  return (
    <div>
      <ConceptInfo
        title="useActionState"
        definition="Connects a (possibly async) action function to a <form>, tracking pending status and the action's returned state without manual boilerplate."
        whenToUse="Form submissions where you want built-in pending/error/success state tracking — newsletter signups, comment forms, any 'submit and show a result' flow."
        question="Why does the action function receive `previousState` as its first argument instead of just the FormData?"
        answer="Getting the previous state lets the action build on prior results — e.g. accumulating a submission count, appending to a list of errors, or preserving fields across a failed attempt — without needing a separate useState to track that history alongside useActionState's own state."
      />

      <div className="demo-panel">
        <h3>Newsletter signup using useActionState</h3>
        <form action={formAction}>
          <div className="demo-row">
            <input type="email" name="email" placeholder="you@example.com" required />
            <button type="submit" disabled={isPending}>
              {isPending ? 'Submitting…' : 'Subscribe'}
            </button>
          </div>
        </form>
        {state.status !== 'idle' && (
          <p>
            <span className="badge">
              {state.status === 'success' ? 'Success' : 'Error'}
            </span>{' '}
            {state.message}
          </p>
        )}
        <p>Total successful subscriptions this session: {state.count}</p>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> the action function's signature is{' '}
        <code>(previousState, formData) =&gt; newState</code> — it's easy
        to forget the leading `previousState` parameter and accidentally
        treat the first argument as FormData, which silently breaks field
        reads like <code>formData.get('email')</code>.
      </div>
    </div>
  )
}

export default UseActionStateDemo
