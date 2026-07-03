import { skills } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './Skills.css'

export default function Skills() {
  const ref = useReveal()

  return (
    <section className="section" id="skills">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">skills</p>
        <h2 className="section-title">Tools I build with</h2>

        <div className="skills__grid">
          {skills.map((cat) => (
            <div className="skills__card" key={cat.group}>
              <h3 className="skills__group">{cat.group}</h3>
              <ul className="skills__items">
                {cat.items.map((item) => (
                  <li className="tag" key={item}>
                    {item}
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
