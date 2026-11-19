import ResourceRow from '../components/ResourceRow'

export default function ListPage({ title, section, items, loading, onDelete, filterFn }) {
  const displayed = filterFn ? items.filter(filterFn) : items

  return (
    <section className="page-view">
      <p className="eyebrow">ROBONOTES / {title.toUpperCase()}</p>
      <h1>{title}</h1>
      <p className="intro">Your shared academic workspace for the School of Robotics.</p>

      <div className="resource-list full-list">
        {loading && <p className="empty-note">Loading…</p>}
        {!loading && displayed.length === 0 && (
          <p className="empty-note">Nothing here yet. Add entries from Admin access.</p>
        )}
        {displayed.map(item => (
          <ResourceRow
            key={item.id}
            item={item}
            onDelete={(id, pwd) => onDelete(section, id, pwd)}
          />
        ))}
      </div>
    </section>
  )
}
