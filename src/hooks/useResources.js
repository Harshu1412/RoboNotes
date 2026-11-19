import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { kindFromExtension, iconForKind, colorForSubject, isYouTube } from '../lib/constants'

/**
 * Manages resources for a given section ('resources' | 'papers').
 * Reads from and writes to the matching Supabase table.
 */
export function useResources(section = 'resources') {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from(section)
      .select('*')
      .order('created_at', { ascending: false })
    if (err) { setError(err.message); setLoading(false); return }
    setItems(data ?? [])
    setLoading(false)
  }, [section])

  useEffect(() => { fetchItems() }, [fetchItems])

  // ── Add a resource (file or link) ─────────────────────────────────────────
  const addItem = useCallback(async ({ title, subject, file, linkUrl, linkKind }) => {
    let publicUrl = null
    let fileName  = null
    let kind      = null

    if (file) {
      // Upload file to Supabase Storage
      const bucket   = section           // bucket name matches the section
      const filePath = `${Date.now()}_${file.name}`
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)
      if (uploadErr) return { error: uploadErr.message }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)
      publicUrl = urlData.publicUrl
      fileName  = file.name
      kind      = kindFromExtension(file.name.split('.').pop())
    } else if (linkUrl) {
      publicUrl = linkUrl
      kind      = isYouTube(linkUrl) ? 'YOUTUBE' : (linkKind || 'LINK')
    } else {
      return { error: 'Provide a file or a URL.' }
    }

    const record = {
      title,
      subject:   subject || null,
      url:       publicUrl,
      file_name: fileName,
      kind,
      icon:      iconForKind(kind),
      color:     colorForSubject(subject),
    }

    const { data, error: insertErr } = await supabase
      .from(section)
      .insert([record])
      .select()
      .single()
    if (insertErr) return { error: insertErr.message }

    setItems(prev => [data, ...prev])
    return { data }
  }, [section])

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteItem = useCallback(async (id, password) => {
    if (password !== import.meta.env.VITE_ADMIN_PASSWORD) {
      return { error: 'Wrong admin password.' }
    }
    const { error: err } = await supabase
      .from(section)
      .delete()
      .eq('id', id)
    if (err) return { error: err.message }
    setItems(prev => prev.filter(item => item.id !== id))
    return { success: true }
  }, [section])

  return { items, loading, error, fetchItems, addItem, deleteItem }
}
