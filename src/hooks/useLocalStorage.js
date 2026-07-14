import { useEffect, useState } from 'react'

// A custom hook: a plain JS function starting with "use" that composes
// React's own hooks (useState + useEffect) into a reusable behavior —
// this is the entire mechanism behind "custom hooks", no special API.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage can throw in private-browsing/quota-exceeded cases;
      // swallow it here since this is a study demo, not production code.
    }
  }, [key, value])

  return [value, setValue]
}
