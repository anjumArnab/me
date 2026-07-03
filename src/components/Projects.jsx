import { projects, links } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { ArrowUpRight } from './Icons'
import ProjectCard from './ProjectCard'
import './Projects.css'

export default function Projects() {
  const ref = useReveal()

  return (
    <section className="section" id="projects">
      <div className="container reveal" ref={ref}>
        <div className="projects__head">
          <div>
            <p className="eyebrow">projects</p>
            <h2 className="section-title">Selected work</h2>
          </div>
          <a className="projects__all" href={links.github} target="_blank" rel="noreferrer">
            All repositories <ArrowUpRight width={15} height={15} />
          </a>
        </div>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
