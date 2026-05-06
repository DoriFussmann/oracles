import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

function formatTitleFromSlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function ArticleDetailPage() {
  const { slug } = useParams()
  const title = useMemo(() => formatTitleFromSlug(slug), [slug])

  return (
    <section className="site-page">
      <div className="site-page__inner">
        <h1 className="site-page__title">{title || 'Article'}</h1>
        <p className="site-page__subtitle">Content coming soon.</p>
      </div>
    </section>
  )
}
