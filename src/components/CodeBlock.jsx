import './CodeBlock.css'

/**
 * Zero-dependency syntax highlighter for the blog code blocks.
 * Palette + chrome inspired by VS Code Light+ on a white editor surface.
 * Languages match the `lang` values used in src/data/blogs.js:
 * dart, kotlin, javascript, json, http, xml.
 */

const wb = (list) => String.raw`\b(?:${list.trim().split(/\s+/).join('|')})\b`
const g = (name, src) => `(?<${name}>${src})`

// Keyword sets per language. `control` = control flow (purple), the rest
// (incl. true/false/null literals) render in keyword blue.
const LANGS = {
  dart: {
    control: 'await break case catch continue else finally for if in is new rethrow return switch throw try while',
    keyword:
      'abstract as assert async bool class const covariant default deferred do double dynamic enum export extension external factory final get hide implements import int interface late library mixin num on operator part required set show static super sync this typedef var void yield true false null',
  },
  kotlin: {
    control: 'as break catch continue do else finally for if in is return throw try when while',
    keyword:
      'abstract actual annotation companion const constructor crossinline data enum expect external final fun get import infix init inline inner interface internal lateinit noinline object open operator out override package private protected public reified sealed set super suspend tailrec this typealias val var vararg where true false null',
  },
  javascript: {
    control: 'await break case catch continue do else finally for if return switch throw try while',
    keyword:
      'async class const export extends function get import let new of static super this typeof var void yield true false null undefined',
  },
  typescript: {
    control: 'await break case catch continue do else finally for if in of return switch throw try while',
    keyword:
      'abstract any as asserts async boolean class const constructor declare default delete export extends from function get implements import infer interface keyof let namespace never private protected public readonly set static string super this type typeof unknown var void yield true false null undefined',
  },
  shell: {
    control: 'if then else elif fi for do done while case esac',
    keyword: 'cd npm node npx opencode git flutter dart pub run install build add mcp',
  },
  http: {
    keyword: 'GET POST PUT PATCH DELETE HEAD OPTIONS true false null',
  },
  json: {
    keyword: 'true false null',
  },
  yaml: {
    // keys (word before ':') and version strings highlighted as keywords
    keyword: 'dependencies dev_dependencies flutter sdk',
  },
  xml: {},
}

const CACHE = new Map()

function regexFor(lang) {
  if (CACHE.has(lang)) return CACHE.get(lang)

  const L = LANGS[lang] ?? LANGS.json
  const data = lang === 'json' || lang === 'http' || lang === 'yaml'
  const xml = lang === 'xml'

  // Match priority = array order. Comments and strings first so their
  // contents are never re-tokenized; keywords before `func` so `if (`
  // is not styled as a function call.
  const parts = [
    data ? null : g('comment', String.raw`//[^\n]*|/\*[\s\S]*?\*/|<!--[\s\S]*?-->`),
    data ? g('property', String.raw`"[^"\n]*"(?=\s*:)|[A-Za-z-]+(?=\s*:)`) : null,
    // Strings incl. multi-line JS template literals (\u0060 = backtick),
    // so `MODE: REDESIGN ...` prose isn't re-tokenized as code.
    g(
      'string',
      String.raw`'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|\u0060(?:[^\u0060\\]|\\.)*\u0060`,
    ),
    data || xml ? null : g('annotation', String.raw`@\w+`),
    g('number', String.raw`\b\d[\d_]*(?:\.\d+)?[fFlL]?\b`),
    L.control ? g('control', wb(L.control)) : null,
    L.keyword ? g('keyword', wb(L.keyword)) : null,
    xml
      ? g('tag', String.raw`</?[A-Za-z][\w:.-]*|/?>`)
      : g('type', String.raw`\b[A-Z][A-Za-z0-9_]*\b`),
    xml ? g('attr', String.raw`[A-Za-z_][\w:.-]*(?=\s*=)`) : data ? null : g('func', String.raw`\b[A-Za-z_]\w*(?=\s*\()`),
  ].filter(Boolean)

  const re = new RegExp(parts.join('|'), 'g')
  CACHE.set(lang, re)
  return re
}

function highlight(code, lang) {
  const re = regexFor(lang)
  const nodes = []
  let last = 0
  let m

  while ((m = re.exec(code)) !== null) {
    if (m.index > last) nodes.push(code.slice(last, m.index))
    const type = Object.keys(m.groups).find((k) => m.groups[k] !== undefined)
    nodes.push(
      <span key={m.index} className={type ? `tok tok--${type}` : undefined}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < code.length) nodes.push(code.slice(last))
  return nodes
}

export default function CodeBlock({ code, lang }) {
  return (
    <div className="codeblock">
      <div className="codeblock__head">
        <span className="codeblock__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="codeblock__lang">{lang}</span>
      </div>
      <pre>
        <code>{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}
