import { useState } from 'react'
import { blogs, mediumProfile } from '../data/blogs'
import { useReveal } from '../hooks/useReveal'
import { useBlogRoute, slugFromPath } from '../hooks/useBlogRoute'
import BlogCard from './BlogCard'
import BlogReader from './BlogReader'
import Pagination from './Pagination'
import './Blog.css'

// Two cards per row; a page is one 2x2 grid of cards.
const PER_PAGE = 4

export default function Blog() {
  const ref = useReveal()
  const { activeSlug, openBlog, closeBlog } = useBlogRoute()

  // A deep link to /blog/<slug> starts on the page that holds that article.
  const [page, setPage] = useState(() => {
    const slug = typeof window === 'undefined' ? null : slugFromPath(window.location.pathname)
    const idx = slug ? blogs.findIndex((b) => b.slug === slug) : -1
    return idx > 0 ? Math.floor(idx / PER_PAGE) : 0
  })

  const pages = Math.ceil(blogs.length / PER_PAGE)
  const shown = blogs.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const active = blogs.find((b) => b.slug === activeSlug)

  return (
    <section className="section" id="blog">
      <div className="container reveal" ref={ref}>
        <div className="blog__head">
          <div>
            <p className="eyebrow">blog</p>
            <h2 className="section-title">Blog</h2>
          </div>
          <a className="blog__all" href={mediumProfile} target="_blank" rel="noreferrer">
            All articles on Medium
          </a>
        </div>

        {/* key remounts the grid on page change so cards re-animate in */}
        <div className="blog__grid" key={page}>
          {shown.map((blog, i) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              index={page * PER_PAGE + i}
              onRead={() => openBlog(blog.slug)}
            />
          ))}
        </div>

        <Pagination page={page} count={pages} onChange={setPage} />
      </div>

      {active && <BlogReader blog={active} onClose={closeBlog} />}
    </section>
  )
}
