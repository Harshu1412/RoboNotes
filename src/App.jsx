import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { useResources } from './hooks/useResources'
import { useSearch }    from './hooks/useSearch'
import { useAdmin }     from './context/AdminContext'

import Sidebar       from './components/Sidebar'
import Topbar        from './components/Topbar'
import AdminModal    from './components/AdminModal'
import SearchResults from './components/SearchResults'

import Overview      from './pages/Overview'
import ResourcesPage from './pages/ResourcesPage'
import ListPage      from './pages/ListPage'

import './App.css'
import './responsive.css'

export default function App() {
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return

    const previousFocus = document.activeElement
    const handleKeyDown = event => {
      if (event.key === 'Escape') setMobileNavOpen(false)
    }

    document.querySelector('#primary-sidebar .nav-item')?.focus()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const closeDrawerOnDesktop = () => {
      if (window.innerWidth > 767) setMobileNavOpen(false)
    }

    window.addEventListener('resize', closeDrawerOnDesktop)
    return () => window.removeEventListener('resize', closeDrawerOnDesktop)
  }, [])

  // ── Data hooks — one per Supabase table ───────────────────────────────────
  const resources = useResources('resources')
  const papers    = useResources('papers')

  // ── Search ────────────────────────────────────────────────────────────────
  const { query, results, searching, setQuery } = useSearch()

  // ── Unified delete handler ─────────────────────────────────────────────────
  const handleDelete = async (section, id, password) => {
    const hook = section === 'resources' ? resources : papers
    const result = await hook.deleteItem(id, password)
    if (result.error) alert(result.error)
  }

  // ── Unified add handler ───────────────────────────────────────────────────
  const handleAdd = async (section, payload) => {
    const hook = section === 'resources' ? resources : papers
    return hook.addItem(payload)
  }

  const openAdminModal = () => {
    setMobileNavOpen(false)
    setShowAdminModal(true)
  }

  return (
    <div className="app-shell">
      <Sidebar
        isMobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onAdminClick={openAdminModal}
      />
      {mobileNavOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="main-content">
        <Topbar
          query={query}
          onSearch={setQuery}
          onMenuClick={() => setMobileNavOpen(open => !open)}
          mobileNavOpen={mobileNavOpen}
        />

        {/* Search results overlay */}
        {query && (
          <SearchResults
            query={query}
            results={results}
            searching={searching}
            onClose={() => setQuery('')}
          />
        )}

        <div className="content-wrap">
          <Routes>
            <Route path="/" element={
              <Overview
                resources={resources}
                papers={papers}
                onDelete={handleDelete}
              />
            } />
            <Route path="/resources" element={
              <ResourcesPage
                items={resources.items}
                loading={resources.loading}
                onDelete={handleDelete}
              />
            } />
            <Route path="/papers" element={
              <ListPage
                title="Question papers"
                section="papers"
                items={papers.items}
                loading={papers.loading}
                onDelete={handleDelete}
              />
            } />
            <Route path="/videos" element={
              <ListPage
                title="Video library"
                section="resources"
                items={resources.items}
                loading={resources.loading}
                onDelete={handleDelete}
                filterFn={i => ['VIDEO', 'YOUTUBE'].includes(i.kind)}
              />
            } />
          </Routes>
        </div>
      </main>

      {showAdminModal && (
        <AdminModal
          onClose={() => setShowAdminModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}
