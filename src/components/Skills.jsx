import { useEffect, useRef, useState } from 'react'
import { skills } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Skills.css'

const ROOT = 'anjum/skills'

// Render helpers -----------------------------------------------------------

function Ls({ dirs, files }) {
  return (
    <div className="term__ls">
      {dirs &&
        skills.map((s) => (
          <span className="term__dir" key={s.group}>
            {s.group}
          </span>
        ))}
      {files &&
        files.map((f) => (
          <span className="term__file" key={f}>
            {f}
          </span>
        ))}
    </div>
  )
}

function Help() {
  const rows = [
    ['ls', 'list what’s in the current directory'],
    ['cd <category>', 'enter a category'],
    ['cd ..', 'go back up'],
    ['clear', 'clear the screen'],
  ]
  return (
    <div className="term__help">
      {rows.map(([cmd, desc]) => (
        <div key={cmd}>
          <span className="term__dir">{cmd}</span>
          <span className="term__muted"> — {desc}</span>
        </div>
      ))}
    </div>
  )
}

// case-insensitive, exact match first then prefix (so `cd lang` works)
const findGroup = (arg) => {
  const a = arg.toLowerCase()
  return (
    skills.find((s) => s.group.toLowerCase() === a) ||
    skills.find((s) => s.group.toLowerCase().startsWith(a))
  )
}

const promptFor = (cwd) => `${ROOT}${cwd ? '/' + cwd : ''}>`

// Component ----------------------------------------------------------------

export default function Skills() {
  const ref = useReveal()
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  const [cwd, setCwd] = useState(null) // null = root, else a group name
  const [input, setInput] = useState('')
  const [past, setPast] = useState([]) // command history for arrow-recall
  const [pIdx, setPIdx] = useState(-1)
  const [history, setHistory] = useState(() => [
    {
      output: (
        <div className="term__muted">
          Sakib Anjum Arnab — skills shell · type{' '}
          <span className="term__dir">help</span> or{' '}
          <span className="term__dir">ls</span> to explore.
        </div>
      ),
    },
    { prompt: promptFor(null), cmd: 'ls', output: <Ls dirs /> },
  ])

  // keep the view scrolled to the newest line
  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  const exec = (cmd) => {
    const [name, ...rest] = cmd.split(/\s+/)
    const arg = rest.join(' ')

    switch (name) {
      case '':
        return { output: null }
      case 'ls': {
        if (!cwd) return { output: <Ls dirs /> }
        const g = skills.find((s) => s.group === cwd)
        return { output: <Ls files={g.items} /> }
      }
      case 'cd': {
        if (!arg || arg === '~' || arg === '/' || arg === '..')
          return { output: null, nextCwd: null }
        const g = findGroup(arg)
        if (!g)
          return {
            output: <span className="term__err">cd: no such category: {arg}</span>,
          }
        return { output: null, nextCwd: g.group }
      }
      case 'pwd':
        return { output: <span>/{promptFor(cwd).slice(0, -1)}</span> }
      case 'help':
        return { output: <Help /> }
      case 'whoami':
        return { output: <span>anjum</span> }
      default:
        return { output: <span className="term__err">command not found: {name}</span> }
    }
  }

  const submit = () => {
    const cmd = input.trim()
    const prompt = promptFor(cwd)

    if (cmd) setPast((p) => [...p, cmd])
    setPIdx(-1)
    setInput('')

    if (cmd === 'clear') {
      setHistory([])
      return
    }

    const { output, nextCwd } = exec(cmd)
    setHistory((h) => [...h, { prompt, cmd: input, output }])
    if (nextCwd !== undefined) setCwd(nextCwd)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!past.length) return
      const idx = pIdx < 0 ? past.length - 1 : Math.max(0, pIdx - 1)
      setPIdx(idx)
      setInput(past[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (pIdx < 0) return
      const idx = pIdx + 1
      if (idx >= past.length) {
        setPIdx(-1)
        setInput('')
      } else {
        setPIdx(idx)
        setInput(past[idx])
      }
    }
  }

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">skills</p>
        <h2 className="section-title">Tools I build with</h2>

        <div className="term">
          <div className="term__bar">
            <span className="term__dots">
              <i style={{ background: '#ff5f57' }} />
              <i style={{ background: '#febc2e' }} />
              <i style={{ background: '#28c840' }} />
            </span>
            <span className="term__title">skills — zsh</span>
          </div>

          <div
            className="term__body"
            ref={bodyRef}
            onClick={() => inputRef.current?.focus()}
          >
            {history.map((e, i) => (
              <div className="term__entry" key={i}>
                {e.prompt != null && (
                  <div className="term__line">
                    <span className="term__prompt">{e.prompt}</span>
                    <span className="term__cmd">{e.cmd}</span>
                  </div>
                )}
                {e.output && <div className="term__out">{e.output}</div>}
              </div>
            ))}

            <div className="term__line term__input-line">
              <span className="term__prompt">{promptFor(cwd)}</span>
              <input
                ref={inputRef}
                className="term__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="ls"
                aria-label="Skills terminal input"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
