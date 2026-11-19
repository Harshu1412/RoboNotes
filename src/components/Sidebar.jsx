import { NavLink } from 'react-router-dom'
import { SUBJECTS } from '../lib/constants'
import { useAdmin } from '../context/AdminContext'

const NAV_ITEMS = [
  { path: '/',           label: 'Overview',       icon: '⌂' },
  { path: '/resources',  label: 'All resources',  icon: '▤' },
  { path: '/papers',     label: 'Question papers', icon: '◎' },
  { path: '/videos',     label: 'Video library',  icon: '▶' },
]

export default function Sidebar({ onAdminClick }) {
  const { isAdmin, logout } = useAdmin()

  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand" aria-label="RoboNotes home">
        <span className="brand-mark">✦</span>
        <span>ROBO<span className="brand-accent">NOTES</span></span>
      </NavLink>

      <p className="side-label">WORKSPACE</p>
      <nav>
        {NAV_ITEMS.map((item, idx) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <p className="side-label subject-label">
        SUBJECTS <span>{SUBJECTS.length}</span>
      </p>
      <div className="subject-nav">
        {SUBJECTS.map(subject => (
          <NavLink key={subject.id} to={`/resources?subject=${encodeURIComponent(subject.name)}`}>
            <i className={`dot ${subject.color}`}></i>
            {subject.name}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-bottom">
        <div className="semester">
          <span className="pulse"></span>
          <div>
            <strong>Semester 01</strong>
            <small>2026 · M.Tech Robotics</small>
          </div>
        </div>
        {isAdmin ? (
          <>
            <button className="admin-link" onClick={onAdminClick}>⚙ Content Manager</button>
            <button className="admin-link" onClick={logout}>↪ Sign out admin</button>
          </>
        ) : (
          <button className="admin-link" onClick={onAdminClick}>⚙ Admin access</button>
        )}
      </div>
    </aside>
  )
}
