import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Searches across resources and papers tables.
 * Returns unified results tagged with their source section.
 */
export function useSearch() {
  const [results,   setResults]   = useState([])
  const [searching, setSearching] = useState(false)
  const [query,     setQuery]     = useState('')

  const search = useCallback(async (q = '') => {
    setQuery(q)
    if (!q.trim()) { setResults([]); return }

    setSearching(true)
    const pattern = `%${q}%`

    const [r, p] = await Promise.all([
      supabase.from('resources').select('*').or(`title.ilike.${pattern},subject.ilike.${pattern}`).order('created_at', { ascending: false }),
      supabase.from('papers')   .select('*').or(`title.ilike.${pattern},subject.ilike.${pattern}`).order('created_at', { ascending: false }),
    ])

    const all = [
      ...(r.data ?? []).map(item => ({ ...item, _section: 'resources' })),
      ...(p.data ?? []).map(item => ({ ...item, _section: 'papers'    })),
    ]
    setResults(all)
    setSearching(false)
  }, [])

  return { query, results, searching, search, setQuery: (q) => { setQuery(q); search(q) } }
}
