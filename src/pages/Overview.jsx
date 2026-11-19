import { useNavigate } from 'react-router-dom'
import { SUBJECTS } from '../lib/constants'
import ResourceRow from '../components/ResourceRow'

export default function Overview({ resources, papers, onDelete }) {
  const navigate = useNavigate()

  const totalVideos = resources.items.filter(i => ['VIDEO', 'YOUTUBE'].includes(i.kind)).length

  return (
    <>
      {/* ── Hero ── */}
      <section className="welcome">
        <div>
          <p className="eyebrow"></p>
          <h1>Your knowledge base,<br /><em>in one place.</em></h1>
          <p className="intro">
            Everything you need for your M.Tech journey in Robotics.<br />
            Pick up where you left off.
          </p>
        </div>
        <div className="welcome-art">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="bot-face"><span>• •</span><i></i></div>
          <div className="art-label">BUILD / LEARN / REPEAT</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats">
        <div><strong>{SUBJECTS.length}</strong><span>Subjects</span></div>
        <div><strong>{resources.items.length}</strong><span>Total resources</span></div>
        <div><strong>{totalVideos}</strong><span>Video lessons</span></div>
        <div><strong>{papers.items.length}</strong><span>Past papers</span></div>
        <div className="stats-note">
          <span className="green-check">✓</span>
         
        </div>
      </section>

      {/* ── Subjects ── */}
      <section className="section-heading">
        <div>
          <p className="eyebrow">EXPLORE YOUR CURRICULUM</p>
          <h2>Subjects <span>· {SUBJECTS.length} active</span></h2>
        </div>
        <button className="text-btn" onClick={() => navigate('/resources')}>
          View all subjects <span>↗</span>
        </button>
      </section>
      <section className="subject-grid">
        {SUBJECTS.map(subject => {
          const count = resources.items.filter(i => i.subject === subject.name).length
          return (
            <button
              key={subject.id}
              className={`subject-card ${subject.color}`}
              onClick={() => navigate(`/resources?subject=${encodeURIComponent(subject.name)}`)}
            >
              <div className="card-top">
                <span className="subject-icon">{subject.icon}</span>
                <span className="arrow">↗</span>
              </div>
              <p>{subject.code}</p>
              <h3>{subject.name}</h3>
              <footer>
                <span>{count} resources</span>
                <span>Supabase</span>
              </footer>
            </button>
          )
        })}
      </section>

      {/* ── Recent resources ── */}
      <section className="lower-grid">
        <div className="recent-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">KEEP LEARNING</p>
              <h2>Recently added</h2>
            </div>
            <button className="text-btn" onClick={() => navigate('/resources')}>
              See all <span>↗</span>
            </button>
          </div>
          <div className="resource-list">
            {resources.loading && <p className="empty-note">Loading…</p>}
            {!resources.loading && resources.items.slice(0, 4).map(item => (
              <ResourceRow key={item.id} item={item} onDelete={(id, pwd) => onDelete('resources', id, pwd)} />
            ))}
            {!resources.loading && !resources.items.length && (
              <p className="empty-note">No materials yet. Add your first file from Admin access.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
