import { profile, links, skills } from '../data/portfolio'
import { MailIcon, GitHubIcon, PinIcon } from './Icons'
import RollingSkill from './RollingSkill'
import meImg from '../assets/Me.jpg'
import './Hero.css'

// {path, word} pairs to roll through: category becomes the shell path,
// skill becomes the value. Parentheticals trimmed for a tidy pill.
const slug = (group) => group.toLowerCase().split(' ')[0]
const clean = (item) => item.replace(/\s*\(.*\)/, '').trim()
const rollingSkills = [
  { path: 'main', word: 'Flutter' },
  ...skills.flatMap((g) => g.items.map((i) => ({ path: slug(g.group), word: clean(i) }))),
]

export default function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="container hero__grid">
        <div className="hero__col">
          {/* Terminal-style status line — the signature motif */}
          <p className="hero__status">
            <RollingSkill items={rollingSkills} />
          </p>

          <h1 className="hero__name">{profile.name}</h1>

          <p className="hero__role">
            {profile.role} <span className="hero__accent">· {profile.focus}</span>
          </p>

          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__actions">
            <a className="btn btn-primary" href={`mailto:${links.email}`}>
              <MailIcon width={16} height={16} /> Get in touch
            </a>
            <a className="btn btn-ghost" href={links.github} target="_blank" rel="noreferrer">
              <GitHubIcon width={16} height={16} /> View GitHub
            </a>
          </div>
        </div>

        <div className="hero__col hero__media">
          <div className="hero__photo">
            <img
              src={meImg}
              alt={`${profile.name}, ${profile.role}`}
              width="320"
              height="380"
              loading="eager"
            />
            {profile.available && (
              <span className="hero__badge">
                <span className="hero__dot" /> Open to work
              </span>
            )}
          </div>
          <p className="hero__loc">
            <PinIcon width={15} height={15} /> {profile.location}
          </p>
        </div>
      </div>
    </section>
  )
}
