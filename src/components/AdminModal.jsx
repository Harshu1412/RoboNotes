import { useState } from 'react'
import { SUBJECTS } from '../lib/constants'
import { useAdmin } from '../context/AdminContext'

export default function AdminModal({ onClose, onAdd }) {
  const { isAdmin, login } = useAdmin()
  const [password, setPassword]   = useState('')
  const [loginErr, setLoginErr]   = useState('')
  const [uploading, setUploading] = useState(false)
  const [feedback, setFeedback]   = useState('')

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = e => {
    e.preventDefault()
    if (!login(password)) {
      setLoginErr('Wrong password. Try again.')
      return
    }
    setLoginErr('')
    setPassword('')
  }

  // ── Generic submit for any section form ───────────────────────────────────
  const handleSubmit = async (e, section) => {
    e.preventDefault()
    const fd      = new FormData(e.currentTarget)
    const title   = fd.get('title')?.trim()
    const subject = fd.get('subject') || null
    const file    = fd.get('file')
    const linkUrl = fd.get('link')?.trim()
    const linkKind = fd.get('kind') || 'LINK'

    if (!title || (!file?.size && !linkUrl)) {
      setFeedback('Fill in the title and either a file or a URL.')
      return
    }

    setUploading(true)
    setFeedback('')
    const result = await onAdd(section, {
      title, subject, file: file?.size ? file : null, linkUrl: linkUrl || null, linkKind,
    })
    setUploading(false)
    if (result?.error) {
      setFeedback(`Error: ${result.error}`)
    } else {
      setFeedback('Added successfully!')
      e.currentTarget.reset()
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal admin-modal" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>

        {!isAdmin ? (
          <>
            <p className="eyebrow">PRIVATE WORKSPACE</p>
            <h2>Admin access</h2>
            <p>Sign in to manage all class materials.</p>
            <form onSubmit={handleLogin}>
              <label>
                Password
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </label>
              {loginErr && <p style={{ color: '#d45d4a', fontSize: 11 }}>{loginErr}</p>}
              <button className="primary-btn" type="submit">Unlock dashboard ↗</button>
            </form>
          </>
        ) : (
          <>
            <p className="eyebrow">CONTENT MANAGER</p>
            <h2>Add class material</h2>

            {feedback && (
              <p style={{ fontSize: 11, color: feedback.startsWith('Error') ? '#d45d4a' : '#4eb77d', marginBottom: 8 }}>
                {feedback}
              </p>
            )}

            {/* ── Resources form ── */}
            <form onSubmit={e => handleSubmit(e, 'resources')}>
              <label>
                Title
                <input name="title" required placeholder="Lecture slides / Assignment 1" />
              </label>
              <label>
                Subject
                <select name="subject" defaultValue={SUBJECTS[0].name}>
                  {SUBJECTS.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label>
                File — PDF, PPT, DOC, ZIP, image…
                <input name="file" type="file"
                  accept="image/*,.pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.mp4,.webm" />
              </label>
              <label>
                Or a URL / YouTube link
                <input name="link" type="url" placeholder="https://youtube.com/watch?v=…" />
              </label>
              <label>
                Link type
                <select name="kind" defaultValue="LINK">
                  <option>LINK</option>
                  <option>VIDEO</option>
                  <option>YOUTUBE</option>
                </select>
              </label>
              <button className="primary-btn" type="submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Add to library ↥'}
              </button>
            </form>

            <div className="admin-divider">
              <strong>Question papers</strong>
              <small>Upload previous-year paper PDFs.</small>
            </div>
            <form onSubmit={e => handleSubmit(e, 'papers')}>
              <label>Title<input name="title" required placeholder="SR-602 paper 2025" /></label>
              <label>
                Subject
                <select name="subject" defaultValue={SUBJECTS[0].name}>
                  {SUBJECTS.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label>PDF<input name="file" type="file" accept=".pdf" /></label>
              <label>Or URL<input name="link" type="url" placeholder="https://…" /></label>
              <button className="secondary-btn" type="submit" disabled={uploading}>Add question paper</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
