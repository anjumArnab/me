import { GitHubIcon, PlayIcon, PackageIcon } from './Icons'

const LINK_META = {
  github: { label: 'Source', Icon: GitHubIcon },
  play: { label: 'Play Store', Icon: PlayIcon },
  pub: { label: 'pub.dev', Icon: PackageIcon },
}

export default function ProjectCard({ project, index }) {
  return (
    <article className="project">
      <div className="project__top">
        <span className="project__index">{String(index + 1).padStart(2, '0')}</span>
        {project.badge && <span className="project__badge">{project.badge}</span>}
      </div>

      <h3 className="project__name">{project.name}</h3>
      <p className="project__blurb">{project.blurb}</p>

      <ul className="project__highlights">
        {project.highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <div className="project__stack">
        {project.stack.map((s) => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>

      <div className="project__links">
        {project.links.map(({ type, url }) => {
          const meta = LINK_META[type] ?? LINK_META.github
          const { label, Icon } = meta
          return (
            <a
              className={`project__link ${type === 'play' || type === 'pub' ? 'is-primary' : ''}`}
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <Icon width={15} height={15} />
              {label}
            </a>
          )
        })}
      </div>
    </article>
  )
}
