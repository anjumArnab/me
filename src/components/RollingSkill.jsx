import { useEffect, useState } from 'react'

// Rolls through {path, word} pairs, showing `~/skills/<path> · <word>`.
// The path (category) and word (skill) roll together in sync.
// Pauses on the first pair when the user prefers reduced motion.
export default function RollingSkill({ items, interval = 1900 }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || items.length <= 1) return
    const id = setInterval(() => setI((v) => (v + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items, interval])

  const cur = items[i]

  return (
    <>
      ~/skills/
      <span className="roll roll--path">
        {/* keyed on the path so it only rolls when the category changes */}
        <span className="roll__word" key={cur.path}>
          {cur.path}
        </span>
      </span>
      {' > '}
      <span className="roll">
        <span className="roll__word" key={i}>
          {cur.word}
        </span>
      </span>
    </>
  )
}
