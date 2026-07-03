import { profile, education } from '../data/portfolio'
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

        <div className="about__body">
          <p className="about__summary">{profile.summary}</p>

          <div className="about__edu">
            <p className="about__edu-label">Education</p>
            <p className="about__edu-degree">{education.degree}</p>
            <p className="about__edu-meta">{education.school}</p>
            <p className="about__edu-meta">
              {education.period} · {education.cgpa}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
