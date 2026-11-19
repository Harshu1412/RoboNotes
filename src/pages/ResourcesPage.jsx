import { useSearchParams } from 'react-router-dom'
import { SUBJECTS } from '../lib/constants'
import ResourceRow from '../components/ResourceRow'

export default function ResourcesPage({ items, loading, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSubject = searchParams.get('subject') || ''

  const filtered = activeSubject
    ? items.filter(i => i.subject === activeSubject)
    : items

  return (
    <section className="page-view">
      <p className="eyebrow">ROBONOTES / ALL RESOURCES</p>
      <h1>All resources</h1>
      <p className="intro">Every file, link, and video uploaded for Semester 01.</p>

      {/* Subject filter chips */}
      <div className="filter-chips">
        <button
          className={`chip ${!activeSubject ? 'chip-active' : ''}`}
          onClick={() => setSearchParams({})}
        >All</button>
        {SUBJECTS.map(s => (
          <button
            key={s.id}
            className={`chip ${activeSubject === s.name ? 'chip-active' : ''}`}
            onClick={() => setSearchParams({ subject: s.name })}
          >
            <i className={`dot ${s.color}`}></i> {s.name}
          </button>
        ))}
      </div>

      <div className="resource-list full-list">
        {loading && <p className="empty-note">Loading…</p>}
        {!loading && filtered.length === 0 && (
          <p className="empty-note">
            {activeSubject ? `No resources for ${activeSubject} yet.` : 'No resources uploaded yet.'}
          </p>
        )}
        {filtered.map(item => (
          <ResourceRow key={item.id} item={item} onDelete={(id, pwd) => onDelete('resources', id, pwd)} />
        ))}
      </div>
    </section>
  )
}
