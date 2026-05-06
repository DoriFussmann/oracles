const ARTICLES = [
  {
    title: 'The Nature of Intelligence',
    date: 'May 05, 2026',
    excerpt: 'What makes a model feel intelligent in practice, and where does simulation of reasoning stop and genuine utility begin?',
  },
  {
    title: 'When Models Disagree',
    date: 'May 01, 2026',
    excerpt: 'Conflicting answers can be signal, not noise. Learn how disagreement patterns reveal uncertainty and edge cases.',
  },
  {
    title: 'Prompting as a Discipline',
    date: 'Apr 29, 2026',
    excerpt: 'Prompting is repeatable craft: constraints, context shape, and evaluation loops beat one-off clever wording.',
  },
  {
    title: 'Latency vs. Depth Tradeoffs',
    date: 'Apr 21, 2026',
    excerpt: 'Fast models improve UX, deeper models improve confidence. Product quality depends on balancing both intentionally.',
  },
  {
    title: 'Choosing a Judge Model',
    date: 'Apr 16, 2026',
    excerpt: 'A synthesis model should optimize for consistency and justification, not only writing style or raw creativity.',
  },
  {
    title: 'Designing Oracle Workflows',
    date: 'Apr 10, 2026',
    excerpt: 'Parallel model calls, clear failure states, and deterministic formatting create reliable multi-model operations.',
  },
]

export function ArticlesPage() {
  return (
    <section className="site-page site-page--articles">
      <div className="site-page__inner">
        <h1 className="site-page__title">Articles</h1>
        <p className="site-page__subtitle">Ideas and operating principles behind multi-model systems.</p>

        <div className="article-grid">
          {ARTICLES.map((article) => (
            <article key={article.title} className="article-card">
              <p className="article-card__date">{article.date}</p>
              <h2 className="article-card__title">{article.title}</h2>
              <p className="article-card__excerpt">{article.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
