export interface HyperMarkedOptions {
  /**
   * Page title (appears in browser tab)
   * @default extracted H1 from markdown or 'Document'
   */
  title?: string;

  /**
   * Custom CSS styles to include
   * @default ''
   */
  css?: string;

  /**
   * Whether to disable built-in styling
   * @default false
   */
  noDefaultStyles?: boolean;

  /**
   * HTML to inject before </head> tag
   * @default ''
   */
  beforeHeadEnd?: string;

  /**
   * HTML to inject after <body> tag
   * @default ''
   */
  afterBodyStart?: string;

  /**
   * HTML to inject before </body> tag
   * @default ''
   */
  beforeBodyEnd?: string;

  /**
   * Options to pass to the marked parser
   * @default {}
   */
  markedOptions?: any;
}

/**
 * Try to extract title from markdown content (from first H1)
 * @param markdown - The markdown content to parse
 * @returns The first H1 title or null if not found
 */
export function tryExtractTitle(markdown: string): string | null;

/**
 * Convert markdown string to complete HTML page using hyper-marked
 * @param markdown - The markdown content to convert
 * @param options - Configuration options
 * @returns Complete HTML page string
 */
export function hyperMarked(markdown: string, options?: HyperMarkedOptions): string;

export default hyperMarked;