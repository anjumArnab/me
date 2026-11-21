import './Pagination.css'

/**
 * Rectangular numbered page buttons (1, 2, 3, ...).
 * Rendered only when there is more than one page.
 */
export default function Pagination({ page, count, onChange }) {
  if (count <= 1) return null

  return (
    <nav className="pagination" aria-label="Pagination">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`pagination__dot ${i === page ? 'is-active' : ''}`}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i === page ? 'page' : undefined}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  )
}
