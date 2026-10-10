import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { basename, dirname, relative, resolve, sep } from 'node:path'
import MarkdownItShiki from '@shikijs/markdown-it'
import { transformerNotationDiff, transformerNotationHighlight, transformerNotationWordHighlight } from '@shikijs/transformers'
import Vue from '@vitejs/plugin-vue'
import fs from 'fs-extra'
import matter from 'gray-matter'
import anchor from 'markdown-it-anchor'
import GitHubAlerts from 'markdown-it-github-alerts'
import LinkAttributes from 'markdown-it-link-attributes'
// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
import sharp from 'sharp'
import { bundledLanguages } from 'shiki/bundle/full'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Exclude from 'vite-plugin-optimize-exclude'
import Pages from 'vite-plugin-pages'
import SVG from 'vite-svg-loader'
import { slugify } from './scripts/slugify.ts'
import MarkdownItMagicLink from 'markdown-it-magic-link'

const promises: Promise<any>[] = []

const pycnLang = JSON.parse(fs.readFileSync('./shiki/pycn.json', 'utf-8'))

const ROOT = import.meta.dirname

/**
 * Repo-relative path -> last commit author date (ISO).
 * Derived from git instead of the filesystem mtime, because a fresh checkout
 * (CI, or a new clone) resets every file's mtime to checkout time, which would
 * make every post report the same "last updated" date.
 */
let gitLastModified: Map<string, string> | null | undefined

function getGitLastModified(): Map<string, string> | null {
  if (gitLastModified !== undefined)
    return gitLastModified

  try {
    const output = execFileSync(
      'git',
      ['--no-optional-locks', 'log', '--no-renames', '--pretty=format:\u001E%aI', '--name-only'],
      { cwd: ROOT, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 },
    )
    const map = new Map<string, string>()
    let date = ''
    // git log is newest-first, so the first sighting of a file wins.
    for (const line of output.split('\n')) {
      if (line.startsWith('\u001E')) {
        date = line.slice(1).trim()
        continue
      }
      const name = line.trim()
      if (name && date && !map.has(name))
        map.set(name, date)
    }
    gitLastModified = map
  }
  catch {
    // Not a git repo, git missing, etc. - fall back to file mtime.
    gitLastModified = null
  }

  return gitLastModified
}

function getLastModified(absPath: string) {
  const repoRelativePath = relative(ROOT, absPath).split(sep).join('/')
  const fromGit = getGitLastModified()?.get(repoRelativePath)
  if (fromGit)
    return new Date(fromGit).toISOString()
  return fs.statSync(absPath).mtime.toISOString()
}

export default defineConfig({
  server: {
    host: 'localhost',
    port: 8080,
  },
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(import.meta.dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
      'mermaid',
    ],
  },
  plugins: [
    UnoCSS(),

    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: 'pages',
      extendRoute(route) {
        const path = resolve(import.meta.dirname, route.component.slice(1))

        if (!path.includes('projects.md') && path.endsWith('.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          // Auto-populate lastModified from the file's last git commit if not
          // manually set (falls back to file mtime outside a git checkout).
          if (!data.lastModified)
            data.lastModified = getLastModified(path)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    Markdown({
      wrapperComponent: id => id.includes('/demo/')
        ? 'WrapperDemo'
        : 'WrapperPost',
      wrapperClasses: (id, code) => code.includes('@layout-full-width')
        ? ''
        : 'prose m-auto slide-enter-content',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      async markdownItSetup(md) {
        md.use(await MarkdownItShiki({
          themes: {
            dark: 'synthwave-84',
            light: 'vitesse-light',
          },
          langs: [
            ...Object.keys(bundledLanguages),
            pycnLang,
          ],
          defaultColor: false,
          cssVariablePrefix: '--s-',
          transformers: [
            transformerNotationDiff(),
            transformerNotationHighlight(),
            transformerNotationWordHighlight(),
          ],
        }))

        // Mermaid: render via Vue component on client side
        // Must be after Shiki to avoid being overwritten
        const shikiFence = md.renderer.rules.fence!
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          if (token.info.trim() === 'mermaid') {
            return `<MermaidBlock code="${encodeURIComponent(token.content)}" />`
          }
          return shikiFence(tokens, idx, options, env, self)
        }

        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml: '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        })

        md.use(GitHubAlerts)
        md.use(MarkdownItMagicLink, {
          linksMap: {
            'TypeScript': 'https://www.typescriptlang.org/',
            'Java': 'https://www.java.com/zh-CN/',
            'Python': 'https://www.python.org/',
            'GitHub': { link: 'https://github.com/Vincent-the-gamer', imageUrl: 'https://github.com/github.png'},
            'Rust': 'https://www.rust-lang.org/zh-CN'
          },
        })
      },
      frontmatterPreprocess(frontmatter, options, id, defaults) {
        (() => {
          if (!id.endsWith('.md'))
            return
          const route = basename(id, '.md')
          if (route === 'index' || frontmatter.image || !frontmatter.title)
            return
          const path = `og/${route}.png`
          promises.push(
            fs.existsSync(`${id.slice(0, -3)}.png`)
              ? fs.copy(`${id.slice(0, -3)}.png`, `public/${path}`)
              : generateOg(frontmatter.title!.replace(/\s-\s.*$/, '').trim(), `public/${path}`),
          )
          frontmatter.image = `https://blog.vince-g.xyz/${path}`
        })()
        const head = defaults(frontmatter, options)
        return { head, frontmatter }
      },
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          from: '@vueuse/core',
          imports: ['Fn'],
          type: true,
        },
      ],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),

    Exclude(),

    {
      name: 'await',
      async closeBundle() {
        await Promise.all(promises)
      },
    },
  ],

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT' && warning.code !== 'INVALID_ANNOTATION')
          next(warning)
      },
    },
  },

  ssgOptions: {
    formatting: 'minify',
    format: 'cjs',
  },
})

const ogSVg = fs.readFileSync('./scripts/og-template.svg', 'utf-8')

async function generateOg(title: string, output: string) {
  if (fs.existsSync(output))
    return

  await fs.mkdir(dirname(output), { recursive: true })
  // breakline every 25 chars
  const lines = title.trim().split(/(.{0,25})(?:\s|$)/g).filter(Boolean)

  const data: Record<string, string> = {
    line1: lines[0],
    line2: lines[1],
    line3: lines[2],
  }
  const svg = ogSVg.replace(/\{\{([^}]+)\}\}/g, (_, name) => data[name] || '')

  console.log(`Generating ${output}`)
  try {
    await sharp(Buffer.from(svg))
      .resize(1200 * 1.1, 630 * 1.1)
      .png()
      .toFile(output)
  }
  catch (e) {
    console.error('Failed to generate og image', e)
  }
}
