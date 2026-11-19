export const SUBJECTS = [
  { id: 1, code: 'SR-601', name: 'Mathematics for Robotics',      color: 'coral',  icon: 'MR' },
  { id: 2, code: 'SR-602', name: 'Robotics-1',                    color: 'lime',   icon: 'R1' },
  { id: 3, code: 'SR-603', name: 'Robot Vision and Perception',   color: 'blue',   icon: 'VP' },
  { id: 4, code: 'SR-604', name: 'Control Engineering',           color: 'yellow', icon: 'CE' },
  { id: 5, code: 'SR-605', name: 'Essential Concepts of Robotics',color: 'violet', icon: 'ER' },
  { id: 6, code: 'SR-617', name: 'Swarm Robotics',                color: 'mint',   icon: 'SR' },
]

export const RESOURCE_KINDS = ['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'XLS', 'XLSX', 'ZIP', 'IMAGE', 'VIDEO', 'LINK', 'YOUTUBE']

export const DOWNLOADABLE_KINDS = new Set(['PPT', 'PPTX', 'DOC', 'DOCX', 'XLS', 'XLSX', 'ZIP'])

/** Map a file extension → kind string */
export function kindFromExtension(ext = '') {
  const e = ext.toUpperCase()
  if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'].includes(e)) return 'IMAGE'
  if (['MP4', 'WEBM', 'MOV', 'AVI'].includes(e))                 return 'VIDEO'
  if (['PPT', 'PPTX'].includes(e))                                return 'PPT'
  if (e === 'PDF')                                                 return 'PDF'
  if (['DOC', 'DOCX'].includes(e))                                return 'DOC'
  if (['XLS', 'XLSX'].includes(e))                                return 'XLS'
  if (e === 'ZIP')                                                 return 'ZIP'
  return e || 'FILE'
}

/** Icon character for a given kind */
export function iconForKind(kind = '') {
  switch (kind) {
    case 'VIDEO':
    case 'YOUTUBE': return '▶'
    case 'LINK':    return '↗'
    case 'IMAGE':   return '▧'
    default:        return '▤'
  }
}

/** Colour name from subject name */
export function colorForSubject(subjectName) {
  return SUBJECTS.find(s => s.name === subjectName)?.color ?? 'mint'
}

/** Is a URL a YouTube link? */
export function isYouTube(url = '') {
  return /youtube\.com|youtu\.be/.test(url)
}
