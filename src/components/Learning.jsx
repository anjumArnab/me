import { learning } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Learning.css'

export default function Learning() {
  const ref = useReveal()

  return (
    <section className="section learning" id="learning">
      <div className="container reveal" ref={ref}>
        <div className="learning__head">
          <p className="eyebrow">currently leveling up</p>
          <h2 className="section-title">Growing my range</h2>
          <p className="section-lead">{learning.intro}</p>
        </div>

        <div className="learning__grid">
          {learning.items.map((item) => (
            <div className="learning__card" key={item.area}>
              <h3 className="learning__area">{item.area}</h3>
              <p className="learning__note">{item.note}</p>
              <ul className="learning__repos">
                {item.repos.map((r) => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
