import { Fragment, useEffect } from 'react'
import { MediumIcon, GitHubIcon, ArrowIcon } from './Icons'
import CodeBlock from './CodeBlock'

/**
 * Minimal inline formatter for article text.
 * Supports **bold**, `code`, and [label](url) — enough for the Medium mirrors.
 */
const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

function renderInline(text) {
  const nodes = []
  let last = 0
  let match
  INLINE_RE.lastIndex = 0

  while ((match = INLINE_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index))
    const token = match[0]

    if (token.startsWith('**')) {
      nodes.push(<strong key={match.index}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={match.index} className="reader__icode">{token.slice(1, -1)}</code>)
    } else {
      const label = token.slice(1, token.indexOf(']'))
      const href = token.slice(token.indexOf('(') + 1, -1)
      nodes.push(
        <a key={match.index} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>,
      )
    }
    last = match.index + token.length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/* One content block from blogs.js -> one element. */
function Block({ block }) {
  switch (block.type) {
    case 'lede':
      return <p className="reader__lede">{renderInline(block.text)}</p>
    case 'h2':
      return <h3 className="reader__h2">{renderInline(block.text)}</h3>
    case 'h3':
      return <h4 className="reader__h3">{renderInline(block.text)}</h4>
    case 'p':
      return <p className="reader__p">{renderInline(block.text)}</p>
    case 'quote':
      return (
        <blockquote className="reader__quote">
          {block.text.split('\n').map((line, i, lines) => (
            <Fragment key={i}>
              {renderInline(line)}
              {i < lines.length - 1 && <br />}
            </Fragment>
          ))}
        </blockquote>
      )
    case 'list': {
      // Plain strings, or { text, sub: [...] } for nested bullets.
      // NB: check with Array.isArray — a string's `.sub` is a legacy
      // function (String.prototype.sub), so a truthy check would crash.
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className="reader__list">
          {block.items.map((item, i) => {
            const text = typeof item === 'string' ? item : item.text
            const sub = typeof item === 'object' ? item.sub : null
            return (
              <li key={i}>
                {renderInline(text)}
                {Array.isArray(sub) && (
                  <ul className="reader__list reader__list--sub">
                    {sub.map((s, j) => (
                      <li key={j}>{renderInline(s)}</li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ListTag>
      )
    }
    case 'code':
      return <CodeBlock lang={block.lang} code={block.code} />
    default:
      return null
  }
}

/* Full-screen article page — covers the whole viewport, scrolls itself. */
export default function BlogReader({ blog, onClose }) {
  // Escape closes; lock the page behind while the article is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Show the article title in the tab while reading.
  useEffect(() => {
    const prev = document.title
    document.title = blog.title
    return () => {
      document.title = prev
    }
  }, [blog.title])

  return (
    <div className="reader" role="dialog" aria-label={blog.title}>
      <header className="reader__bar">
        <button className="reader__back" onClick={onClose}>
          <ArrowIcon width={15} height={15} /> All articles
        </button>
        <a className="reader__medium-link" href={blog.url} target="_blank" rel="noreferrer">
          <MediumIcon width={15} height={15} /> Read on Medium
        </a>
      </header>

      <article className="reader__article">
        <header className="reader__head">
          <h2 className="reader__title">{blog.title}</h2>
          {blog.subtitle && <p className="reader__subtitle">{renderInline(blog.subtitle)}</p>}
          <div className="reader__tags">
            {blog.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </header>

        <div className="reader__body">
          {blog.content.map((block, i) => (
            <Block block={block} key={i} />
          ))}
        </div>

        <footer className="reader__foot">
          {blog.repo && (
            <a className="reader__foot-link" href={blog.repo.url} target="_blank" rel="noreferrer">
              <GitHubIcon width={15} height={15} /> {blog.repo.label}
            </a>
          )}
          <a
            className="reader__foot-link is-primary"
            href={blog.url}
            target="_blank"
            rel="noreferrer"
          >
            <MediumIcon width={15} height={15} /> Read on Medium
          </a>
        </footer>
      </article>
    </div>
  )
}
