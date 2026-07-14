import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * useFormStatus (react-dom, React 19)
 * ------------------------------------------------------------------
 * Definition: Reads the pending/submission status of the nearest
 *   ancestor <form> — but ONLY from within a component rendered INSIDE
 *   that form, not the component that renders the <form> itself.
 * When to use: Building a reusable submit button / spinner / field
 *   that needs to know "is my parent form currently submitting?"
 *   without the form having to manually pass an `isPending` prop down
 *   to every child that cares.
 * Interview question: Why does calling useFormStatus() in the same
 *   component that renders the <form> element always return
 *   `{ pending: false }`?
 * Answer: useFormStatus reads status from context provided by the
 *   nearest PARENT <form> — a component can't read its own form's
 *   status because, from React's perspective, that form doesn't exist
 *   as an ancestor of itself yet during that component's render; the
 *   hook only works in components that are children/descendants of the
 *   <form>, e.g. a dedicated <SubmitButton /> rendered inside it.
 */

// This must be a SEPARATE component rendered as a descendant of the
// <form> below — that's what makes useFormStatus work here.
function SubmitButton() {
  const { pending, data } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? `Submitting "${data?.get('title') ?? ''}"…` : 'Create post'}
    </button>
  )
}

function FieldHint() {
  // Any descendant of the form can read status, not just the button —
  // useful for disabling inputs or showing a global "saving" indicator.
  const { pending } = useFormStatus()
  return pending ? <p className="badge">Form is busy — please wait</p> : null
}

async function createPostAction(previousState, formData) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { lastTitle: formData.get('title'), submitCount: previousState.submitCount + 1 }
}

function UseFormStatusDemo() {
  const [state, formAction] = useActionState(createPostAction, {
    lastTitle: '',
    submitCount: 0,
  })

  return (
    <div>
      <ConceptInfo
        title="useFormStatus"
        definition="Lets a component nested inside a <form> read that form's pending submission status (and submitted FormData) without prop drilling."
        whenToUse="Reusable submit buttons, loading spinners, or field-disabling logic that needs to react to 'is this form submitting right now' from anywhere inside the form tree."
        question="Could you get the same result by lifting isPending state up and passing it as a prop to the submit button instead of using useFormStatus?"
        answer="Yes, functionally — but useFormStatus avoids the prop-drilling / re-wiring needed every time you add another form-aware descendant, and it's especially valuable for building generic, reusable components (like a shared <SubmitButton>) that need to work inside ANY form without that form's author remembering to pass a pending prop."
      />

      <div className="demo-panel">
        <h3>Form with a status-aware submit button</h3>
        <form action={formAction}>
          <div className="demo-row">
            <input name="title" placeholder="Post title" required />
            <SubmitButton />
          </div>
          <FieldHint />
        </form>
        {state.lastTitle && (
          <p>
            Last created: <strong>{state.lastTitle}</strong> (submits:{' '}
            {state.submitCount})
          </p>
        )}
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> useFormStatus is imported from{' '}
        <code>react-dom</code>, not <code>react</code> — a common typo/
        import mistake — and it only works with native{' '}
        <code>&lt;form action={'{...}'}&gt;</code> submissions, not a
        form whose submit is handled purely by a custom onSubmit calling
        preventDefault and your own async logic.
      </div>
    </div>
  )
}

export default UseFormStatusDemo
