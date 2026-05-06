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
            <div className="site-brand__logo" aria-hidden="true">◈</div>
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
