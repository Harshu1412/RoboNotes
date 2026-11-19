import { DOWNLOADABLE_KINDS } from '../lib/constants'
import { useAdmin } from '../context/AdminContext'

export default function ResourceRow({ item, onDelete }) {
  const { isAdmin } = useAdmin()

  const openResource = () => {
    if (!item.url) {
      alert('No URL attached to this resource.')
      return
    }
    if (DOWNLOADABLE_KINDS.has(item.kind)) {
      const a = document.createElement('a')
      a.href = item.url
      a.download = item.file_name || item.title
      a.target = '_blank'
      a.rel = 'noreferrer'
      a.click()
    } else {
      window.open(item.url, '_blank', 'noreferrer')
    }
  }

  const handleDelete = () => {
    const pwd = window.prompt(`Enter admin password to delete "${item.title}"`)
    if (pwd === null) return
    onDelete(item.id, pwd)
  }

  return (
    <div className="resource-row">
      <span className={`file-icon ${item.color}`}>{item.icon}</span>
      <div>
        <strong>{item.title}</strong>
        <small>
          {item.subject} {item.subject && <i>·</i>} {item.kind}
        </small>
      </div>
      <span className="kind">{item.kind}</span>
      <button className="row-arrow" onClick={openResource} title={`Open ${item.kind}`}>↗</button>
      {isAdmin && (
        <button className="delete-btn" onClick={handleDelete} title="Delete">×</button>
      )}
    </div>
  )
}
