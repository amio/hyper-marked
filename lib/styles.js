import { MerriweatherFont } from './styles-font.js'

export const defaultStyles = `
  ${MerriweatherFont}
  :root {
    --bg-color: #fff;
    --text-color: #333;
    --border-color: #e7e7e7;
    --border-color-light: #dfe2e5;
    --blockquote-color: #6a737d;
    --code-bg: rgba(27,31,35,0.05);
    --pre-bg: #f6f8fa;
    --table-header-bg: #f6f8fa;
    --hr-bg: #e1e4e8;
    --link-color: #1a83fa;
    --header-bg: #f9f9f9;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-color: #353535;
      --text-color: #d4d4d4;
      --border-color: #404040;
      --border-color-light: #333333;
      --blockquote-color: #999999;
      --code-bg: rgba(128,128,128,0.2);
      --pre-bg: rgba(128,128,128,0.1);
      --table-header-bg: #262626;
      --hr-bg: #333333;
      --link-color: #61abff;
      --header-bg: #262626;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--text-color);
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
    background-color: var(--bg-color);
  }
  .markdown-content {
    margin: 0 2rem;
    padding-bottom: 4rem;
  }
  .markdown-content > h1:first-child {
    width: 100vw;
    margin-top: 0;
    margin-left: calc(-50vw + 50%);
    margin-bottom: 2rem;
    padding: 5rem 0;
    background-color: var(--header-bg);
    text-align: center;
  }
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;

    font-family: "Merriweather", New York, Georgia, serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }
  h1 { font-size: 2.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
  h2 { font-size: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.1em; }
  h3 { font-size: 1.5em; }
  h4 { font-size: 1.2em; }
  h5 { font-size: 1em; }
  h6 { font-size: 0.9em; }
  p { margin-bottom: 1em; }
  a { color: var(--link-color); text-decoration: none; }
  a:hover { text-decoration: underline; }
  blockquote {
    margin: 0;
    padding: 0 1em;
    color: var(--blockquote-color);
    border-left: 0.25em solid var(--border-color-light);
  }
  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: var(--code-bg);
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }
  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: var(--pre-bg);
    border-radius: 6px;
    margin-bottom: 1em;
  }
  pre code {
    display: inline;
    max-width: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    line-height: inherit;
    word-wrap: normal;
    background-color: transparent;
    border: 0;
  }
  table {
    border-spacing: 0;
    border-collapse: collapse;
    margin-bottom: 1em;
    width: 100%;
  }
  table th, table td {
    padding: 6px 13px;
    border: 1px solid var(--border-color-light);
  }
  table th {
    font-weight: 600;
    background-color: var(--table-header-bg);
  }
  ul, ol {
    padding-left: 2em;
    margin-bottom: 1em;
  }
  li {
    margin-bottom: 0.25em;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: var(--hr-bg);
    border: 0;
  }
`;
