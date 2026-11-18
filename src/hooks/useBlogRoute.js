import { useCallback, useEffect, useState } from 'react'
import { blogs } from '../data/blogs'

// Reading a blog pushes /blog/<slug> under the deploy base
// ('' in dev, '/me' on GitHub Pages — from vite.config.js base).
const base = import.meta.env.BASE_URL.replace(/\/$/, '')

// Which article does a /blog/<slug> path point at? null = not a blog URL.
export const slugFromPath = (pathname) => {
  let p = pathname
  if (base && p.startsWith(base)) p = p.slice(base.length)
  p = p.replace(/^\/+|\/+$/g, '')
  if (!p || p === 'index.html' || p === '404.html') return null
  const segs = p.split('/')
  return segs.length === 2 && segs[0] === 'blog' && blogs.some((b) => b.slug === segs[1])
    ? segs[1]
    : null
}

// The site's only real path is the root — everything else is either a
// blog article (slugFromPath) or a dead URL.
export const isRootPath = (pathname) => {
  let p = pathname
  if (base && p.startsWith(base)) p = p.slice(base.length)
  return p.replace(/^\/+|\/+$/g, '') === ''
}

/**
 * URL-driven blog reader state: /blog/<slug> opens that article,
 * browser back/forward navigates, and closing returns to the list.
 */
export function useBlogRoute() {
  const [activeSlug, setActiveSlug] = useState(() =>
    typeof window === 'undefined' ? null : slugFromPath(window.location.pathname),
  )

  // Dead URLs (/blog/<unknown-slug>, /anything) still render the homepage —
  // normalize the address bar back to the root instead of keeping them.
  useEffect(() => {
    const { pathname } = window.location
    if (slugFromPath(pathname) === null && !isRootPath(pathname)) {
      window.history.replaceState({}, '', `${base}/`)
    }
  }, [])

  // Browser back/forward drives the reader.
  useEffect(() => {
    const onPop = () => setActiveSlug(slugFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openBlog = useCallback((slug) => {
    window.history.pushState({ blog: slug }, '', `${base}/blog/${slug}`)
    setActiveSlug(slug)
  }, [])

  const closeBlog = useCallback(() => {
    if (window.history.state?.blog) {
      // We pushed this entry on top of the list view — go back to it.
      window.history.back() // popstate listener closes the reader
    } else {
      // Deep-linked straight into the article: nothing to go back to,
      // so return to the blog list on the home page.
      window.history.replaceState({}, '', `${base}/#blog`)
      setActiveSlug(null)
      requestAnimationFrame(() => {
        document.getElementById('blog')?.scrollIntoView()
      })
    }
  }, [])

  return { activeSlug, openBlog, closeBlog }
}
