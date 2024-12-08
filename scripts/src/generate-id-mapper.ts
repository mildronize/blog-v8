import glob from "tiny-glob";
import fs from "fs-extra";
import path from "path";
import toml from "@iarna/toml";

const IGNORE_MARKDOWN_FILES = ["_index.md"];
type MarkdownType = 'regular' | 'nested';

interface FrontMatterOptions {
  delimiters: string[];
  parser: (input: string) => Record<string, any>;
}


function extractFrontMatter(content: string, options?: Partial<FrontMatterOptions>): Record<string, any> {

  const defaultOptions: FrontMatterOptions = {
    delimiters: ["+++", "+++"],
    parser: toml.parse,
  };

  const delimiters = options?.delimiters ?? defaultOptions.delimiters;
  const parser = options?.parser ?? defaultOptions.parser;

  const [start, end] = delimiters;
  const frontmatter = content.split(start)[1];

  return parser(frontmatter);
}

/**
 * Extracts the Zola slug from a Markdown file path, ignoring a 'YYYY-MM-DD' prefix.
 * - For regular Markdown files, uses the filename (without extension).
 * - For nested Markdown files, uses the parent folder name.
 *
 * @param markdownFilePath - The full path to the Markdown file.
 * @returns The extracted slug.
 */
function extractZolaSlug(dir: string, markdownFilePath: string): string {

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

async function processMarkdownFiles(sourceDirs: string[], targetDir: string) {

  const idMapper = new Map<string, {
    path: string;
  }>();

  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    for (const dir of sourceDirs) {
      // Find all markdown files in the directory
      const files = await glob(`${dir}/**/*.md`);

      for (const file of files) {
        if (IGNORE_MARKDOWN_FILES.includes(path.basename(file))) {
          console.log(`Ignoring: ${file}`);
          continue;
        }
        // Read file content
        const content = await fs.readFile(file, "utf8");

        // Extract front matter and body
        const frontmatter = extractFrontMatter(content);

        if (!frontmatter?.extra?.uuid) {
          console.error(`Error: No ID found in frontmatter of file: ${file}`);
          continue;
        }

        const slug = frontmatter?.slug ?? extractZolaSlug(dir, file);
        idMapper.set(frontmatter.extra.uuid, {
          path: `/${path.basename(dir)}/${slug}`,
        });

        console.log(`Processed: ${frontmatter.title} -> '${file}'`);
      }
    }

    fs.writeJSON(path.join(targetDir, "id-mapper.json"), Object.fromEntries(idMapper));

    console.log("All files processed successfully!");
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

const sourceDirectories = ["../content/posts"];
const targetDirectory = "../public/api";

processMarkdownFiles(sourceDirectories, targetDirectory);
