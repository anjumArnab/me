import { useState } from 'react'
import { projects, links } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import ProjectCard from './ProjectCard'
import Pagination from './Pagination'
import './Projects.css'

// Two cards per row; a page is one 2x2 grid of cards.
const PER_PAGE = 4

export default function Projects() {
  const ref = useReveal()
  const [page, setPage] = useState(0)

  const pages = Math.ceil(projects.length / PER_PAGE)
  const shown = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <section className="section" id="projects">
      <div className="container reveal" ref={ref}>
        <div className="projects__head">
          <div>
            <p className="eyebrow">projects</p>
            <h2 className="section-title">Selected work</h2>
          </div>
          <a className="projects__all" href={links.github} target="_blank" rel="noreferrer">
            All repositories
          </a>
        </div>

        {/* key remounts the grid on page change so cards re-animate in */}
        <div className="projects__grid" key={page}>
          {shown.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={page * PER_PAGE + i} />
          ))}
        </div>

        <Pagination page={page} count={pages} onChange={setPage} />
      </div>
    </section>
  )
}
