import { dartOop } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { GitHubIcon } from './Icons'
import './DartOop.css'

const SIGN = { del: '-', add: '+' }

export default function DartOop() {
  const ref = useReveal()
  const { diff } = dartOop

  return (
    <section className="section dartoop" id="dart-oop">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">open source</p>
        <h2 className="section-title">{dartOop.title}</h2>

        <div className="dartoop__row">
          <div className="dartoop__body">
            {dartOop.problem.map((p, i) => (
              <p key={i} className="dartoop__para">
                {p}
              </p>
            ))}
            <p className="dartoop__solution">{dartOop.solution}</p>

            <a
              className="btn btn-primary dartoop__cta"
              href={dartOop.repo.url}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon width={16} height={16} /> View the reference
            </a>
          </div>

          <figure className="diff">
            <figcaption className="diff__head">
              <span className="diff__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="diff__file">{diff.file}</span>
            </figcaption>

            <div className="diff__code">
              {diff.lines.map((line, i) => (
                <div key={i} className={`diff__line diff__line--${line.type}`}>
                  <span className="diff__sign" aria-hidden="true">
                    {SIGN[line.type] || ''}
                  </span>
                  <span className="diff__text">{line.text || ' '}</span>
                </div>
              ))}
            </div>

            <figcaption className="diff__note">{diff.note}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
