import { useEffect, useState } from 'react'

// Cycles through `words`, rolling each new one up from below.
// Pauses (stays on the first word) when the user prefers reduced motion.
export default function RollingText({ words, interval = 1900 }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || words.length <= 1) return
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words, interval])

  return (
    <span className="roll" aria-live="polite">
      {/* key change remounts the span so the roll-in animation replays */}
      <span className="roll__word" key={i}>
        {words[i]}
      </span>
    </span>
  )
}
