import glob from "tiny-glob";
import fs from "fs-extra";
import path from "path";

import { Logger } from "./utils/logger";
import { extractFrontMatter, generateZolaPostPath } from "./libs/zola";

const logger = new Logger(String(process.env.DEBUG).toLowerCase() === "true");

const IGNORE_MARKDOWN_FILES = ["_index.md"];

interface PostMetadata {
  path: string;
}
type PostId = string;

async function processMarkdownFile(dir: string, ignoreMarkdownFiles: string[]): Promise<Map<PostId, PostMetadata>> {
  const idMapper = new Map<PostId, PostMetadata>();
  // Find all markdown files in the directory
  const files = await glob(`${dir}/**/*.md`);

  for (const file of files) {
    if (ignoreMarkdownFiles.includes(path.basename(file))) {
      logger.log(`Ignoring: ${file}`);
      continue;
    }
    const content = await fs.readFile(file, "utf8");
    const frontmatter = extractFrontMatter(content);

    if (!frontmatter?.extra?.id) {
      logger.warn(`Warn: No ID found in frontmatter of file: ${file}`);
      continue;
    }

    idMapper.set(frontmatter.extra.id, {
      path: generateZolaPostPath(dir, file, frontmatter.slug),
    });

    logger.log(`Processed: ${frontmatter.title} -> '${file}'`);
  }
  return idMapper;
}

async function processMarkdownFiles(sourceDirs: string[], ignoreMarkdownFiles: string[]): Promise<Map<PostId, PostMetadata> | undefined> {
  console.time('Execution Time');

  let idMapperCollection = new Map<PostId, PostMetadata>();

  try {
    for (const dir of sourceDirs) {
      const idMapper = await processMarkdownFile(dir, ignoreMarkdownFiles);
      idMapperCollection = new Map([...idMapperCollection, ...idMapper]);
    }
    console.timeEnd('Execution Time');
    console.log("-----");
    return idMapperCollection;
  } catch (error) {
    logger.error("Error processing files: " + error);
  }
}

console.log("Generating ID mapper...");

const sourceDirectories = ["../content/posts"];
const targetDirectory = "../public/api";

const idMapperCollection = await processMarkdownFiles(sourceDirectories, IGNORE_MARKDOWN_FILES) ?? new Map();
// Ensure target directory exists
await fs.ensureDir(targetDirectory);
fs.writeJSON(path.join(targetDirectory, "id-mapper.json"), Object.fromEntries(idMapperCollection));
console.log(`ID mapper generated with ${idMapperCollection.size} entries.`);

