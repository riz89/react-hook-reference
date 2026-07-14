import { useState } from 'react'

import UseStateDemo from './components/state/UseStateDemo'
import UseReducerDemo from './components/state/UseReducerDemo'
import UseRefDemo from './components/state/UseRefDemo'
import UseContextDemo from './components/state/UseContextDemo'

import UseEffectDemo from './components/effects/UseEffectDemo'
import UseLayoutEffectDemo from './components/effects/UseLayoutEffectDemo'
import UseInsertionEffectDemo from './components/effects/UseInsertionEffectDemo'

import UseMemoDemo from './components/performance/UseMemoDemo'
import UseCallbackDemo from './components/performance/UseCallbackDemo'
import ReactMemoDemo from './components/performance/ReactMemoDemo'

import UseTransitionDemo from './components/concurrent/UseTransitionDemo'
import UseDeferredValueDemo from './components/concurrent/UseDeferredValueDemo'

import UseIdDemo from './components/utility/UseIdDemo'
import UseImperativeHandleDemo from './components/utility/UseImperativeHandleDemo'
import UseDebugValueDemo from './components/utility/UseDebugValueDemo'
import UseSyncExternalStoreDemo from './components/utility/UseSyncExternalStoreDemo'

import UseHookDemo from './components/react19/UseHookDemo'
import UseActionStateDemo from './components/react19/UseActionStateDemo'
import UseOptimisticDemo from './components/react19/UseOptimisticDemo'
import UseFormStatusDemo from './components/react19/UseFormStatusDemo'

import PropsAndDrilling from './components/concepts/PropsAndDrilling'
import ConditionalAndLists from './components/concepts/ConditionalAndLists'
import ControlledUncontrolled from './components/concepts/ControlledUncontrolled'
import LiftingStateUp from './components/concepts/LiftingStateUp'
import CustomHookDemo from './components/concepts/CustomHookDemo'
import LifecycleDemo from './components/concepts/LifecycleDemo'

// Central registry of every example: grouping drives the sidebar nav,
// and each item's `id` is used both as the React key and to pick which
// component renders in the content pane.
const NAV_SECTIONS = [
  {
    title: 'State & Core',
    items: [
      { id: 'useState', label: 'useState', Component: UseStateDemo },
      { id: 'useReducer', label: 'useReducer', Component: UseReducerDemo },
      { id: 'useRef', label: 'useRef', Component: UseRefDemo },
      { id: 'useContext', label: 'useContext', Component: UseContextDemo },
    ],
  },
  {
    title: 'Effects',
    items: [
      { id: 'useEffect', label: 'useEffect', Component: UseEffectDemo },
      { id: 'useLayoutEffect', label: 'useLayoutEffect', Component: UseLayoutEffectDemo },
      { id: 'useInsertionEffect', label: 'useInsertionEffect', Component: UseInsertionEffectDemo },
    ],
  },
  {
    title: 'Performance',
    items: [
      { id: 'useMemo', label: 'useMemo', Component: UseMemoDemo },
      { id: 'useCallback', label: 'useCallback', Component: UseCallbackDemo },
      { id: 'reactMemo', label: 'React.memo', Component: ReactMemoDemo },
    ],
  },
  {
    title: 'Concurrent Features',
    items: [
      { id: 'useTransition', label: 'useTransition', Component: UseTransitionDemo },
      { id: 'useDeferredValue', label: 'useDeferredValue', Component: UseDeferredValueDemo },
    ],
  },
  {
    title: 'Utility',
    items: [
      { id: 'useId', label: 'useId', Component: UseIdDemo },
      { id: 'useImperativeHandle', label: 'useImperativeHandle + forwardRef', Component: UseImperativeHandleDemo },
      { id: 'useDebugValue', label: 'useDebugValue', Component: UseDebugValueDemo },
      { id: 'useSyncExternalStore', label: 'useSyncExternalStore', Component: UseSyncExternalStoreDemo },
    ],
  },
  {
    title: 'React 19',
    items: [
      { id: 'use', label: 'use', Component: UseHookDemo },
      { id: 'useActionState', label: 'useActionState', Component: UseActionStateDemo },
      { id: 'useOptimistic', label: 'useOptimistic', Component: UseOptimisticDemo },
      { id: 'useFormStatus', label: 'useFormStatus (react-dom)', Component: UseFormStatusDemo },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'propsDrilling', label: 'Props & Prop Drilling', Component: PropsAndDrilling },
      { id: 'conditionalLists', label: 'Conditional & List Rendering', Component: ConditionalAndLists },
      { id: 'controlledUncontrolled', label: 'Controlled vs Uncontrolled', Component: ControlledUncontrolled },
      { id: 'liftingStateUp', label: 'Lifting State Up', Component: LiftingStateUp },
      { id: 'customHook', label: 'Custom Hooks', Component: CustomHookDemo },
      { id: 'lifecycle', label: 'Lifecycle via Hooks', Component: LifecycleDemo },
    ],
  },
]

const ALL_ITEMS = NAV_SECTIONS.flatMap((section) => section.items)

function App() {
  const [activeId, setActiveId] = useState(ALL_ITEMS[0].id)
  const ActiveComponent = ALL_ITEMS.find((item) => item.id === activeId).Component

  return (
    <div className="app-shell">
      <nav className="app-sidebar">
        <h1>React Hooks Reference</h1>
        {NAV_SECTIONS.map((section) => (
          <div className="nav-category" key={section.title}>
            <div className="nav-category-title">{section.title}</div>
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item${item.id === activeId ? ' active' : ''}`}
                onClick={() => setActiveId(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <main className="app-content">
        <ActiveComponent />
      </main>
    </div>
  )
}

export default App
