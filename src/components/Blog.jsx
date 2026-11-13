import { useState } from 'react'
import { blogs, mediumProfile } from '../data/blogs'
import { useReveal } from '../hooks/useReveal'
import BlogCard from './BlogCard'
import BlogReader from './BlogReader'
import './Blog.css'

export default function Blog() {
  const ref = useReveal()
  const [activeSlug, setActiveSlug] = useState(null)
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

        <div className="blog__grid">
          {blogs.map((blog, i) => (
            <BlogCard
              key={blog.slug}
              blog={blog}
              index={i}
              onRead={() => setActiveSlug(blog.slug)}
            />
          ))}
        </div>
      </div>

      {active && <BlogReader blog={active} onClose={() => setActiveSlug(null)} />}
    </section>
  )
}
