# hyper-marked

[![version][npm-badge]][npm-link]
[![repo][github-src]][github-link]

Convert markdown to a full-page HTML string using [marked](https://github.com/markedjs/marked), featuring a built-in minimalist style.

For an example, refer to the rendered [homepage](https://hyper-marked.vercel.app) of this README.

## Usage

`npm install hyper-marked`

```javascript
const { hyperMarked } = require('hyper-marked');

const markdown = `# Hello World
This is **markdown** with [links](https://example.com).`;

const html = hyperMarked(markdown);
```

**Returns:** Complete HTML page string.

### With Options

```javascript
const html = hyperMarked(markdown, {
  title: 'My Document',
  css: 'body { font-family: Georgia; }',
  beforeHeadEnd: '<meta name="author" content="Me">',
  markedOptions: { breaks: true }
});
```

**Options:**
- `title` (string) - Page title. Default: extracted H1 from markdown or `'Document'`
- `css` (string) - Custom CSS styles
- `noDefaultStyles` (boolean) - Disable built-in styling
- `beforeHeadEnd` (string) - HTML before `</head>`
- `afterBodyStart` (string) - HTML after `<body>`
- `beforeBodyEnd` (string) - HTML before `</body>`
- `markedOptions` (object) - Options for marked parser

## CLI

`npm i -g hyper-marked`

```
hyper-marked - Convert markdown to complete HTML pages

Usage:
  hyper-marked [input] [options]

Options:
  -o, --output <file>           Output file path (default: stdout)
  -t, --title <title>           Page title (default: extracted H1 from markdown, filename, or 'Document')
  --css <file>                  Custom CSS file path
  --no-default-styles           Disable default styles
  --before-head-end <html>      HTML to inject before </head>
  --after-body-start <html>     HTML to inject after <body>
  --before-body-end <html>      HTML to inject before </body>
  -h, --help                    Show help information
  -v, --version                 Show version number

Examples:
  hyper-marked README.md                          # Output to stdout
  hyper-marked README.md > index.html             # Redirect to file
  hyper-marked README.md -o index.html            # Output to file directly
  hyper-marked README.md -t "My Blog"             # Set title
  hyper-marked README.md --css styles.css         # Inject custom CSS
  echo "# Hello" | hyper-marked                   # Read from stdin
```

## License

MIT

[github-src]: https://badgen.net/badge/-/amio%2Fhyper-marked/black?icon=github&label=
[github-link]: https://github.com/amio/hyper-marked
[npm-badge]: https://badgen.net/npm/v/hyper-marked
[npm-link]: https://www.npmjs.com/package/hyper-marked
