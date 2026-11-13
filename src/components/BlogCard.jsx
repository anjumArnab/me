import { MediumIcon } from './Icons'

export default function BlogCard({ blog, index, onRead }) {
  return (
    <article className="blog-card">
      <span className="blog-card__index">{String(index + 1).padStart(2, '0')}</span>

      <h3 className="blog-card__title">{blog.title}</h3>
      <p className="blog-card__excerpt">{blog.excerpt}</p>

      <div className="blog-card__tags">
        {blog.tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>

      <div className="blog-card__actions">
        <button className="blog-card__read" onClick={onRead}>
          Read article
        </button>
        <a className="blog-card__medium" href={blog.url} target="_blank" rel="noreferrer">
          <MediumIcon width={15} height={15} /> Medium
        </a>
      </div>
    </article>
  )
}
