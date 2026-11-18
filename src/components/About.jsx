import { profile } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import './About.css'

export default function About() {
  const ref = useReveal()

  return (
    <section className="section" id="about">
      <div className="container about reveal" ref={ref}>
        <div className="about__head">
          <p className="eyebrow">about</p>
          <h2 className="section-title">
            Mobile-first engineer, shipping real features to real users.
          </h2>
        </div>

        <p className="about__summary">{profile.summary}</p>
      </div>
    </section>
  )
}
