import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, PostMetadata } from "./type";

const logger = new Logger(String(process.env.DEBUG).toLowerCase() === "true");

export function extractMarkdownMetadata(dir: string, file: string, content: string): { key: PostId, value: PostMetadata } | undefined {
  const frontmatter = extractFrontMatter(content);
  if (!frontmatter?.extra?.id) {
    logger.warn(`Warn: No ID found in frontmatter of file: ${file}`);
    return;
  }
  return {
    key: frontmatter.extra.id,
    value: {
      path: generateZolaPostPath(dir, file, frontmatter.slug),
    }
  }
}

export async function processMarkdownFiles(dir: string, ignoreMarkdownFiles: string[]): Promise<Map<PostId, PostMetadata>> {
  const idMapper = new Map<PostId, PostMetadata>();
  // Find all markdown files in the directory
  const files = await glob(`${dir}/**/*.md`);

  for (const file of files) {
    if (ignoreMarkdownFiles.includes(path.basename(file))) {
      logger.log(`Ignoring: ${file}`);
      continue;
    }
    const content = await fs.readFile(file, "utf8");
    const result = extractMarkdownMetadata(dir, file, content);
    if (!result) continue;
    idMapper.set(result.key, result.value);
    logger.log(`Processed: ${result.key} -> '${file}'`);
  }

  return idMapper;
}

export interface FileProcessor {
  process(dir: string): Promise<Map<PostId, PostMetadata>>;
}

export class MarkdownFileProcessor implements FileProcessor {
  constructor(private ignoreMarkdownFiles: string[]) { }

  async process(dir: string): Promise<Map<PostId, PostMetadata>> {
    return processMarkdownFiles(dir, this.ignoreMarkdownFiles);
  }
}

export async function processMarkdownDirectories(sourceDirs: string[], processor: FileProcessor): Promise<Map<PostId, PostMetadata> | undefined> {
  console.time('Execution Time');

  let idMapperCollection = new Map<PostId, PostMetadata>();

  try {
    for (const dir of sourceDirs) {
      const idMapper = await processor.process(dir);
      idMapperCollection = new Map([...idMapperCollection, ...idMapper]);
    }
    console.timeEnd('Execution Time');
    return idMapperCollection;
  } catch (error) {
    logger.error("Error processing files: " + error);
  }
}
