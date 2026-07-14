import { createContext, useContext, useState } from 'react'
import ConceptInfo from '../shared/ConceptInfo'

/**
 * Props, Prop Drilling, and how Context solves it
 * ------------------------------------------------------------------
 * Definition: Props are read-only data passed from parent to child.
 *   "Prop drilling" is passing a prop through several intermediate
 *   components that don't use it themselves, just to reach a deeply
 *   nested descendant that does.
 * When to use: Props for direct parent-child data flow (the default,
 *   most explicit option); Context when the same value is needed by
 *   many components at different depths and drilling it through every
 *   layer becomes noisy/brittle to refactor.
 * Interview question: Is prop drilling always bad, and should you reach
 *   for Context the moment you pass a prop through one intermediate
 *   component?
 * Answer: No — prop drilling through one or two levels is usually fine
 *   and keeps data flow explicit/traceable, which is a real advantage
 *   over Context (you can see exactly where a value comes from). Context
 *   pays off when drilling gets deep (many levels) or wide (many
 *   unrelated intermediate components), at the cost of making data flow
 *   less explicit and coupling components to a specific context.
 */

// ---- Prop drilling version: userName has to pass through Layout and
// Sidebar even though neither of them uses it, just to reach Profile.
function ProfileViaProps({ userName }) {
  return <p>Signed in as (via props): <strong>{userName}</strong></p>
}
function SidebarViaProps({ userName }) {
  return <div className="demo-row"><ProfileViaProps userName={userName} /></div>
}
function LayoutViaProps({ userName }) {
  return <SidebarViaProps userName={userName} />
}

// ---- Context version: userName skips straight to Profile.
const UserContext = createContext('')
function ProfileViaContext() {
  const userName = useContext(UserContext)
  return <p>Signed in as (via context): <strong>{userName}</strong></p>
}
function SidebarViaContext() {
  return <div className="demo-row"><ProfileViaContext /></div>
}
function LayoutViaContext() {
  return <SidebarViaContext />
}

function PropsAndDrilling() {
  const [userName, setUserName] = useState('Grace')

  return (
    <div>
      <ConceptInfo
        title="Props, Prop Drilling & Context"
        definition="Props flow data one level down explicitly; prop drilling threads a prop through uninterested intermediate components; Context lets deep descendants read a value without that threading."
        whenToUse="Default to props. Reach for Context only once drilling becomes genuinely painful — many levels deep, or many sibling branches needing the same value."
        question="Layout and Sidebar in the props example don't use userName at all — why is that a code smell worth naming in an interview?"
        answer="Every intermediate component that forwards a prop it doesn't use becomes coupled to that prop's existence — renaming it, changing its type, or adding a new similarly-drilled value means editing every layer in between, even though Layout/Sidebar have no logical relationship to 'userName'. That coupling-without-usage is exactly the pain Context is designed to remove."
      />

      <div className="demo-panel">
        <h3>Same data, two approaches</h3>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Change the user name"
        />
        <h4>Prop drilling (Layout → Sidebar → Profile)</h4>
        <LayoutViaProps userName={userName} />
        <h4>Context (Layout and Sidebar never touch userName)</h4>
        <UserContext.Provider value={userName}>
          <LayoutViaContext />
        </UserContext.Provider>
      </div>

      <div className="gotcha">
        <strong>Gotcha:</strong> introducing Context isn't free — it makes
        a component implicitly depend on "whatever Provider happens to be
        above it in the tree" instead of an explicit prop, which can make
        components harder to reuse/test in isolation and harder to trace
        data flow for newcomers to the codebase.
      </div>
    </div>
  )
}

export default PropsAndDrilling
