import fs from 'fs';
import path from 'path';
import { hyperMarked } from './index.js';

export async function cli() {
  const args = process.argv.slice(2);

  // Handle version flag
  if (args.includes('-v') || args.includes('--version')) {
    const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(packageJson.version);
    process.exit(0);
  }

  // Handle help flag
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  // Show help if no args and stdin is a TTY (no piped input)
  if (args.length === 0 && process.stdin.isTTY) {
    showHelp();
    process.exit(0);
  }

  try {
    const options = parseArgs(args);
    const markdown = await readInput(options.input);
    const html = hyperMarked(markdown, options.markdownOptions);
    writeOutput(html, options.output);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

function parseArgs(args) {
  const options = {
    input: null,
    output: null,
    markdownOptions: {}
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === '-o' || arg === '--output') {
      if (i + 1 >= args.length) throw new Error('--output requires a filename');
      options.output = args[++i];
    } else if (arg === '-t' || arg === '--title') {
      if (i + 1 >= args.length) throw new Error('--title requires a value');
      options.markdownOptions.title = args[++i];
    } else if (arg === '--css') {
      if (i + 1 >= args.length) throw new Error('--css requires a filename');
      const cssFile = args[++i];
      try {
        options.markdownOptions.css = fs.readFileSync(cssFile, 'utf8');
      } catch (error) {
        throw new Error(`Failed to read CSS file: ${cssFile}`);
      }
    } else if (arg === '--no-default-styles') {
      options.markdownOptions.noDefaultStyles = true;
    } else if (arg === '--before-head-end') {
      if (i + 1 >= args.length) throw new Error('--before-head-end requires HTML content');
      options.markdownOptions.beforeHeadEnd = args[++i];
    } else if (arg === '--after-body-start') {
      if (i + 1 >= args.length) throw new Error('--after-body-start requires HTML content');
      options.markdownOptions.afterBodyStart = args[++i];
    } else if (arg === '--before-body-end') {
      if (i + 1 >= args.length) throw new Error('--before-body-end requires HTML content');
      options.markdownOptions.beforeBodyEnd = args[++i];
    } else if (!arg.startsWith('-')) {
      if (options.input) throw new Error('Multiple input files not supported');
      options.input = arg;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }

    i++;
  }

  return options;
}

async function readInput(inputFile) {
  if (!inputFile) {
    // Read from stdin
    if (process.stdin.isTTY) {
      throw new Error('No input file specified and no data piped to stdin');
    }

    return new Promise((resolve, reject) => {
      let data = '';

      process.stdin.setEncoding('utf8');

      process.stdin.on('readable', () => {
        let chunk;
        while (null !== (chunk = process.stdin.read())) {
          data += chunk;
        }
      });

      process.stdin.on('end', () => {
        resolve(data);
      });

      process.stdin.on('error', reject);
    });
  } else {
    // Read from file
    try {
      return fs.readFileSync(inputFile, 'utf8');
    } catch (error) {
      throw new Error(`Failed to read input file: ${inputFile}`);
    }
  }
}

function writeOutput(html, outputFile) {
  if (!outputFile) {
    // Write to stdout
    console.log(html);
  } else {
    // Write to file
    try {
      fs.writeFileSync(outputFile, html, 'utf8');
      console.error(`Generated: ${outputFile}`);
    } catch (error) {
      throw new Error(`Failed to write output file: ${outputFile}`);
    }
  }
}

function showHelp() {
  console.log(`
hyper-marked - Convert markdown to complete HTML pages

Usage:
  hyper-marked [input] [options]

Options:
  -o, --output <file>           Output file path (default: stdout)
  -t, --title <title>           Page title (default: filename or 'Document')
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
`);
}
