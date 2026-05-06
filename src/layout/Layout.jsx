import { Link, NavLink, Outlet } from 'react-router-dom'

const CORE_ARTICLES = [
  { label: 'The Nature of Intelligence', to: '/articles/nature-of-intelligence' },
  { label: 'When Models Disagree', to: '/articles/when-models-disagree' },
  { label: 'Prompting as a Discipline', to: '/articles/prompting-as-discipline' },
]

export function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-brand">
            <div className="site-brand__logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18 Q3 12 4 5 L10 12"/>
                <path d="M20 18 Q21 12 20 5 L14 12"/>
                <path d="M4 18 Q5 23 12 23 Q19 23 20 18"/>
                <path d="M7 17.5 Q9 15.5 10.5 17"/>
                <path d="M13.5 17 Q15 15.5 17 17.5"/>
                <circle cx="9.5" cy="15" r="0.9" fill="currentColor" stroke="none"/>
                <circle cx="14.5" cy="15" r="0.9" fill="currentColor" stroke="none"/>
                <path d="M10.5 20 Q12 21.5 13.5 20"/>
              </svg>
            </div>
            <Link to="/" className="site-brand__name">The AI Oracles</Link>
          </div>

          <nav className="site-nav" aria-label="Main navigation">
            <div className="site-nav__dropdown">
              <button className="site-nav__link site-nav__dropdown-trigger" type="button">
                Core Articles
              </button>
              <div className="site-nav__menu">
                {CORE_ARTICLES.map((article) => (
                  <NavLink key={article.to} to={article.to} className="site-nav__menu-item">
                    {article.label}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink to="/articles" className="site-nav__link">Articles</NavLink>
            <NavLink to="/pricing" className="site-nav__link">Pricing</NavLink>
            <NavLink to="/about" className="site-nav__link">About</NavLink>
          </nav>

          <div className="site-auth">
            <button type="button" className="btn-reset">Log In</button>
            <button type="button" className="btn-ask">Sign Up</button>
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  )
}
