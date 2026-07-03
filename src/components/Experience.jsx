import { experience } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Experience.css'

export default function Experience() {
  const ref = useReveal()

  return (
    <section className="section experience" id="experience">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">experience</p>
        <h2 className="section-title">Where I've worked</h2>

        <ol className="timeline">
          {experience.map((job) => (
            <li className="timeline__row" key={job.role + job.period}>
              <div className="timeline__rail">
                <span className="timeline__node" aria-hidden="true" />
              </div>

              <div className="timeline__body">
                <h3 className="timeline__role">{job.role}</h3>
                <p className="timeline__company">{job.company}</p>
                <p className="timeline__period">{job.period}</p>
                <p className="timeline__project">{job.project}</p>

                <ul className="timeline__list">
                  {job.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <div className="timeline__stack">
                  {job.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
