export interface SearchSection {
  /** Heading the text belongs to; empty for content before the first heading. */
  heading: string
  /** Anchor id of that heading, so results can deep link. */
  anchor: string
  text: string
}

export interface SearchDoc {
  path: string
  title: string
  description: string
  date: string
  lang: string
  type: string
  sections: SearchSection[]
}

export interface SnippetSegment {
  text: string
  hit: boolean
}

export interface SearchHit {
  doc: SearchDoc
  score: number
  /** Best matching section, used for the deep link and the snippet. */
  section: SearchSection | null
  snippet: SnippetSegment[]
}

const CJK_RE = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uF900-\uFAFF]/
const WORD_CHAR_RE = /[\w\u00C0-\u024F]/

export function splitTerms(query: string): string[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map(term => term.trim())
    .filter(Boolean)

  return Array.from(new Set(terms)).slice(0, 6)
}

/**
 * Whether `text` matches `term`. Latin terms only count when they start a word,
 * so "rust" does not hit "trust"; CJK has no word separator, so a plain
 * substring test is the right one there.
 */
function matches(text: string, term: string): boolean {
  if (!text)
    return false
  if (CJK_RE.test(term))
    return text.includes(term)

  let index = text.indexOf(term)
  while (index !== -1) {
    if (index === 0 || !WORD_CHAR_RE.test(text[index - 1]))
      return true
    index = text.indexOf(term, index + 1)
  }
  return false
}

/** Counts word-start occurrences, capped so a single keyword can't run away. */
function countOccurrences(text: string, term: string, cap = 5): number {
  let count = 0
  let index = 0
  while (count < cap) {
    index = text.indexOf(term, index)
    if (index === -1)
      return count
    if (index === 0 || CJK_RE.test(term) || !WORD_CHAR_RE.test(text[index - 1]))
      count++
    index += term.length
  }
  return count
}

function scoreTitle(title: string, term: string): number {
  if (!matches(title, term))
    return 0
  if (title === term)
    return 200
  if (title.startsWith(term))
    return 120
  // Token inside the title, e.g. "comfy" -> "ComfyUI 工作流".
  return 70
}

interface SectionScore {
  section: SearchSection
  score: number
}

/**
 * Splits `text` into plain and matched segments, so the UI can wrap the hits in
 * `<mark>` without using `v-html`.
 */
export function segmentize(text: string, terms: string[]): SnippetSegment[] {
  if (!text || !terms.length) {
    return [
      { text, hit: false },
    ]
  }

  const lower = text.toLowerCase()
  const ranges: [number, number][] = []

  for (const term of terms) {
    let from = 0
    while (from <= lower.length - term.length) {
      const index = lower.indexOf(term, from)
      if (index === -1)
        break
      ranges.push([index, index + term.length])
      from = index + term.length
    }
  }

  if (!ranges.length) {
    return [
      { text, hit: false },
    ]
  }

  ranges.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const range of ranges) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1])
      last[1] = Math.max(last[1], range[1])
    else
      merged.push([...range])
  }

  const segments: SnippetSegment[] = []
  let position = 0
  for (const [start, end] of merged) {
    if (start > position) {
      segments.push({
        text: text.slice(position, start),
        hit: false,
      })
    }
    segments.push({
      text: text.slice(start, end),
      hit: true,
    })
    position = end
  }
  if (position < text.length) {
    segments.push({
      text: text.slice(position),
      hit: false,
    })
  }

  return segments
}

/** Slices a window of `text` around the first match of any term. */
function excerpt(text: string, terms: string[], maxLength = 170): string {
  const lower = text.toLowerCase()
  let first = -1
  for (const term of terms) {
    const index = lower.indexOf(term)
    if (index !== -1 && (first === -1 || index < first))
      first = index
  }

  if (first === -1) {
    return text.length > maxLength
      ? `${text.slice(0, maxLength).trimEnd()}…`
      : text
  }

  let start = Math.max(0, first - 52)
  if (start > 0) {
    const space = text.indexOf(' ', start)
    if (space !== -1 && space < first)
      start = space + 1
  }

  let end = Math.min(text.length, start + maxLength)
  if (end < text.length) {
    const space = text.lastIndexOf(' ', end)
    if (space > first)
      end = space
  }

  const body = text.slice(start, end).trim()
  return `${start > 0
    ? '…'
    : ''}${body}${end < text.length
    ? '…'
    : ''}`
}

/**
 * Client-side scoring: no index structure beyond the document corpus is needed
 * at this size (a few hundred KB), so every keystroke rescans in well under a
 * millisecond per document.
 */
export function searchDocs(docs: SearchDoc[], query: string, limit = 20): SearchHit[] {
  const terms = splitTerms(query)
  if (!terms.length)
    return []

  const hits: SearchHit[] = []

  for (const doc of docs) {
    const title = doc.title.toLowerCase()
    const description = doc.description.toLowerCase()

    let total = 0
    const sectionScores = new Map<SearchSection, number>()
    let matchedEverything = true

    for (const term of terms) {
      const titleScore = scoreTitle(title, term)
      const descriptionScore = matches(description, term)
        ? 25
        : 0
      let termSectionScore = 0

      for (const section of doc.sections) {
        const headingScore = matches(section.heading.toLowerCase(), term)
          ? 45
          : 0
        const bodyScore = countOccurrences(section.text.toLowerCase(), term) * 9
        const score = headingScore + bodyScore
        if (!score)
          continue
        termSectionScore += score
        sectionScores.set(section, (sectionScores.get(section) ?? 0) + score)
      }

      if (!titleScore && !descriptionScore && !termSectionScore) {
        matchedEverything = false
        break
      }
      total += titleScore + descriptionScore + termSectionScore
    }

    if (!matchedEverything)
      continue

    let best: SectionScore | null = null
    for (const [section, score] of sectionScores) {
      if (!best || score > best.score)
        best = { section, score }
    }

    const section = best?.section ?? doc.sections[0] ?? null
    const source = section?.text || doc.description

    hits.push({
      doc,
      score: total,
      section,
      snippet: segmentize(excerpt(source ?? '', terms), terms),
    })
  }

  hits.sort((a, b) => {
    if (b.score !== a.score)
      return b.score - a.score
    if (a.doc.date !== b.doc.date)
      return b.doc.date.localeCompare(a.doc.date)
    return a.doc.title.localeCompare(b.doc.title)
  })

  return hits.slice(0, limit)
}
