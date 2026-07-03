import { profile, links } from '../data/portfolio'
import { MailIcon, GitHubIcon, ArrowIcon, PinIcon } from './Icons'
import meImg from '../assets/Me.jpg'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="container hero__grid">
        <div className="hero__col">
          {/* Terminal-style status line — the signature motif */}
          <p className="hero__status">
            <span className="hero__prompt">$</span> {profile.statusLine}
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
            <a className="hero__jump" href="#projects">
              See projects <ArrowIcon width={16} height={16} />
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
