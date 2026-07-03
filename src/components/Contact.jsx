import { profile, links } from '../data/portfolio'
import { useReveal } from '../hooks/useReveal'
import { MailIcon, PhoneIcon, GitHubIcon, LinkedInIcon } from './Icons'
import './Contact.css'

const channels = [
  { key: 'email', label: 'Email', value: links.email, href: `mailto:${links.email}`, Icon: MailIcon },
  { key: 'phone', label: 'Phone', value: links.phone, href: `tel:${links.phoneHref}`, Icon: PhoneIcon },
  { key: 'github', label: 'GitHub', value: 'github.com/anjumArnab', href: links.github, Icon: GitHubIcon, external: true },
  { key: 'linkedin', label: 'LinkedIn', value: 'in/anjumarnab', href: links.linkedin, Icon: LinkedInIcon, external: true },
]

export default function Contact() {
  const ref = useReveal()
  const year = new Date().getFullYear()

  return (
    <footer className="section contact" id="contact">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">contact</p>
        <h2 className="contact__title">Let's build something.</h2>
        <p className="contact__lead">
          I'm open to Flutter roles and freelance work. The fastest way to reach me is email —
          I usually reply within a day.
        </p>

        <div className="contact__row">
          {channels.map(({ key, label, value, href, Icon, external }) => (
            <a
              className="contact__icon-btn"
              key={key}
              href={href}
              aria-label={`${label}: ${value}`}
              title={value}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              <Icon width={20} height={20} />
            </a>
          ))}
        </div>

        <div className="contact__foot">
          <span>
            © {year} {profile.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
