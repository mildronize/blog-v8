import toml from "@iarna/toml";
import path from "path";

type MarkdownType = 'regular' | 'nested';

interface FrontMatterOptions {
  delimiters: string[];
  parser: (input: string) => Record<string, any>;
}

/**
 * Extract Zola front matter and body
 */
export function extractFrontMatter(markdownContent: string, options?: Partial<FrontMatterOptions>): {
  data: Record<string, any>,
  content: string,
} {

  const defaultOptions: FrontMatterOptions = {
    delimiters: ["+++", "+++"],
    parser: toml.parse,
  };

  const delimiters = options?.delimiters ?? defaultOptions.delimiters;
  const parser = options?.parser ?? defaultOptions.parser;

  const [start, _end] = delimiters;
  const frontmatter = markdownContent.split(start)[1];

  return {
    data: parser(frontmatter),
    content: markdownContent.split(start)[2],
  }
}

export function composeFrontMatter(data: Record<string, any>, markdownContent: string): string {
  return `+++\n${toml.stringify(data)}\n+++\n${markdownContent}`;
}

/**
 * Extracts the Zola slug from a Markdown file path, ignoring a 'YYYY-MM-DD' prefix.
 * - For regular Markdown files, uses the filename (without extension).
 * - For nested Markdown files, uses the parent folder name.
 *
 * @param markdownFilePath - The full path to the Markdown file.
 * @returns The extracted slug.
 */
export function extractZolaSlug(dir: string, markdownFilePath: string): string {

  // Regular expression to match a 'YYYY-MM-DD' prefix
  const datePrefixPattern = /^\d{4}-\d{2}-\d{2}[-_]?/;

  let relativePath = path.relative(dir, markdownFilePath);

  // Classify the markdown file
  const markdownType: MarkdownType = relativePath.includes(path.sep) ? 'nested' : 'regular';

  // Extract the slug based on whether the file is nested
  let slug: string;
  if (markdownType === 'nested') {
    // Use the parent folder name for nested Markdown files
    slug = path.dirname(relativePath);
  } else {
    // Use the filename for regular Markdown files
    slug = path.basename(relativePath).replace(/\.md$/, '');
  }

  // Remove the date prefix if present
  slug = slug.replace(datePrefixPattern, '');

  return slug.toLowerCase();
}

/**
 * Simulates the Zola post path generation logic.
 */
export function generateZolaPostPath(dir: string, markdownFilePath: string, frontmatterSlug: string | undefined): string {
  const slug = frontmatterSlug ?? extractZolaSlug(dir, markdownFilePath);
  return `/${path.basename(dir)}/${slug}`;
}