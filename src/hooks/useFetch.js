import { useEffect, useState } from 'react'

// Another custom hook: composes useState + useEffect to encapsulate the
// "fetch on mount / on dependency change, track loading & error" pattern
// so components using it don't repeat that boilerplate.
export function useFetch(url) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false // guards against setting state after unmount/URL change
    setLoading(true)
    setError(null)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!ignore) setData(json)
      })
      .catch((err) => {
        if (!ignore) setError(err)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [url])

  return { data, error, loading }
}
