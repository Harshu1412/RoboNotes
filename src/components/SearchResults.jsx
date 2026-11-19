import ResourceRow from './ResourceRow'

const SECTION_LABELS = {
  resources: 'Resources',
  papers:    'Question Papers',
}

export default function SearchResults({ query, results, searching, onClose }) {
  if (!query) return null

  const grouped = results.reduce((acc, item) => {
    const s = item._section
    if (!acc[s]) acc[s] = []
    acc[s].push(item)
    return acc
  }, {})

  return (
    <div className="search-overlay">
      <div className="search-overlay-inner">
        <div className="search-overlay-header">
          <span>Results for <strong>"{query}"</strong></span>
          <button className="close" onClick={onClose}>×</button>
        </div>

        {searching && <p className="empty-note">Searching…</p>}

        {!searching && results.length === 0 && (
          <p className="empty-note">No results found for "{query}".</p>
        )}

        {Object.entries(grouped).map(([section, items]) => (
          <div key={section} className="search-section">
            <p className="eyebrow" style={{ padding: '16px 0 8px' }}>
              {SECTION_LABELS[section] ?? section.toUpperCase()} · {items.length}
            </p>
            <div className="resource-list">
              {items.map(item => (
                <ResourceRow key={item.id} item={item} onDelete={() => {}} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
