import type { Plugin } from 'vite'
import type { SearchDoc, SearchSection } from '../src/logics/search.ts'
import { relative } from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import matter from 'gray-matter'
import { slugify } from './slugify.ts'

const VIRTUAL_ID = 'virtual:search-index'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
  '&apos;': '\'',
  '&nbsp;': ' ',
  '&mdash;': '—',
  '&ndash;': '–',
  '&hellip;': '…',
  '&times;': '×',
}

/**
 * Frontmatter keys whose strings are real, user-facing text. Pages such as
 * `projects.md` keep their whole listing in frontmatter, so those values are
 * worth indexing; everything else (links, icon classes, dates, ids) is not.
 */
const TEXT_KEYS = new Set([
  'name',
  'desc',
  'description',
  'from',
  'title',
  'subtitle',
  'alias',
  'alt',
  'tags',
])

const META_KEYS = new Set([
  'title',
  'description',
  'display',
  'art',
  'wrapperClass',
  'id',
])

function cleanInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^\[![a-z]+\]\s*/i, '')
    .replace(/\\\\([\\`*_{}[\]()#+\-.!])/g, '$1')
    .replace(/&[a-z#0-9]+;/gi, m => ENTITIES[m.toLowerCase()] ?? ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripLineMarkers(line: string): string {
  return line
    // Blockquote / alert markers, including nested ones.
    .replace(/^(\s*>\s*)+/, '')
    // List bullets and task list checkboxes.
    .replace(/^\s*[-*+]\s+(?:\[[ x]\]\s+)?/i, '')
    // Ordered list markers.
    .replace(/^\s*\d+[.)]\s+/, '')
    // Table rows: drop the outer pipes, keep the cell text.
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .replace(/\s*\|\s*/g, ' ')
    .trim()
}

function isNoiseLine(line: string): boolean {
  return (
    !line
    // Table separators, horizontal rules.
    || /^[\s|:-]+$/.test(line)
    // Footnotes definitions and bare reference markers.
    || /^\[[^\]]*\]:?$/.test(line)
  )
}

/**
 * Splits a markdown document into searchable sections, one per heading, with
 * fenced code stripped out: prose is what people search for, and keeping every
 * code block would triple the size of the shipped index.
 */
export function extractSections(body: string): SearchSection[] {
  const text = body
    .replace(/<!--[\s\S]*?-->/g, '\n')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '\n')

  const sections: SearchSection[] = []
  let current: SearchSection = { heading: '', anchor: '', text: '' }
  let fence: string | null = null

  const flush = () => {
    if (current.text.trim()) {
      sections.push({
        ...current,
        text: current.text.trim(),
      })
    }
    current = { heading: '', anchor: '', text: '' }
  }

  for (const raw of text.split('\n')) {
    const fenceMatch = raw.match(/^\s*(`{3,}|~{3,})/)
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence[0])
        fence = null
      continue
    }
    if (fenceMatch) {
      fence = fenceMatch[1]
      continue
    }

    const headingMatch = raw.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*(?:#+\s*)?$/)
    if (headingMatch) {
      flush()
      const heading = cleanInline(headingMatch[2])
      current.heading = heading
      current.anchor = slugify(heading)
      continue
    }

    const line = cleanInline(stripLineMarkers(raw))
    if (isNoiseLine(line))
      continue

    current.text += `${current.text ? ' ' : ''}${line}`
  }
  flush()

  return sections.filter(section => section.text.length > 1)
}

function collectText(value: unknown, key: string, out: string[], depth = 0) {
  if (depth > 6)
    return
  if (typeof value === 'string') {
    const text = value.trim()
    if (TEXT_KEYS.has(key) && text.length > 1 && !/^(?:https?:)?\/\//.test(text))
      out.push(text)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value)
      collectText(item, key, out, depth + 1)
    return
  }
  if (value && typeof value === 'object') {
    for (const [childKey, child] of Object.entries(value))
      collectText(child, childKey, out, depth + 1)
  }
}

function frontmatterSection(data: Record<string, unknown>): SearchSection | null {
  const strings: string[] = []
  for (const [key, value] of Object.entries(data)) {
    if (META_KEYS.has(key))
      continue
    collectText(value, key, strings)
  }
  const unique = Array.from(new Set(strings))
  if (!unique.length)
    return null
  return {
    heading: '',
    anchor: '',
    text: unique.join(' · '),
  }
}

function toRoute(file: string): string {
  let route = relative('pages', file).split('\\').join('/').replace(/\.md$/, '')
  if (route === 'index')
    route = ''
  else if (route.endsWith('/index'))
    route = route.slice(0, -'/index'.length)
  return `/${route}`
}

function toDate(value: unknown): string {
  if (!value || typeof value !== 'string' && !(value instanceof Date))
    return ''
  const date = new Date(value)
  if (Number.isNaN(+date))
    return ''
  return date.toISOString().slice(0, 10)
}

function cleanTitle(value: unknown, fallback: string): string {
  if (typeof value !== 'string' || !value.trim())
    return fallback
  return value.trim().replace(/\s+-\s+Vincent$/, '').trim()
}

/**
 * Walks every markdown page and builds the search corpus. Runs at build time
 * (and on demand in dev), so the client never parses or fetches markdown.
 */
export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const files = await fg('pages/**/*.md', {
    ignore: ['pages/[...404].md', 'pages/demo/**'],
  })

  const docs = await Promise.all(files.map(async (file) => {
    const source = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(source)

    if (data.draft === true)
      return null

    const path = toRoute(file)
    const fallbackTitle = path === '/'
      ? 'Home'
      : path.split('/').filter(Boolean).pop()!

    const sections = extractSections(content)
    const meta = frontmatterSection(data)
    if (meta)
      sections.unshift(meta)

    if (!sections.length)
      return null

    const doc: SearchDoc = {
      path,
      title: cleanTitle(data.title, fallbackTitle),
      description: typeof data.description === 'string'
        ? data.description.trim()
        : '',
      date: toDate(data.date),
      lang: typeof data.lang === 'string'
        ? data.lang
        : '',
      type: typeof data.type === 'string'
        ? data.type
        : '',
      sections,
    }
    return doc
  }))

  return docs
    .filter((doc): doc is SearchDoc => doc !== null)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

/**
 * Serves the corpus as `virtual:search-index`. Importing it dynamically from a
 * component lets Rollup emit it as its own chunk, fetched only once the user
 * actually opens the search box.
 */
export function SearchIndexPlugin(): Plugin {
  let cache: SearchDoc[] | null = null

  return {
    name: 'search-index',
    buildStart() {
      cache = null
    },
    resolveId(id) {
      if (id === VIRTUAL_ID)
        return RESOLVED_ID
    },
    async load(id) {
      if (id !== RESOLVED_ID)
        return
      cache ??= await buildSearchIndex()
      return `export default ${JSON.stringify(cache)}`
    },
    configureServer(server) {
      const invalidate = (file: string) => {
        if (!file.includes('/pages/') || !file.endsWith('.md'))
          return
        cache = null
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod)
          server.moduleGraph.invalidateModule(mod)
      }
      server.watcher.on('change', invalidate)
      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)
    },
  }
}
