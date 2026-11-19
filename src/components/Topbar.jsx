import { Link } from 'react-router-dom'

export default function Topbar({ query, onSearch, onAdminClick }) {
  return (
    <header className="topbar">
      <Link to="/" className="mobile-brand">✦ ROBONOTES</Link>
      <div className="crumb">
        SCHOOL OF ROBOTICS <span>/</span> SEMESTER 01
      </div>
      <div className="top-actions">
        <label className="search">
          <span>⌕</span>
          <input
            value={query}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search resources..."
          />
        </label>
        <button className="icon-btn" title="Notifications">♧<b></b></button>
      </div>
    </header>
  )
}
