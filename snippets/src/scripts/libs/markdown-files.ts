import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, IdMapperMetadata, PostMetadata } from "./type";

const logger = new Logger(String(process.env.DEBUG).toLowerCase() === "true");

export function extractMarkdownMetadata(dir: string, file: string, content: string): PostMetadata | undefined {
  const frontmatter = extractFrontMatter(content);
  if (!frontmatter?.extra?.id) {
    logger.warn(`Warn: No ID found in frontmatter of file: ${file}`);
    return;
  }
  return {
    id: frontmatter.extra.id,
    path: generateZolaPostPath(dir, file, frontmatter.slug),
  }

}

export async function processMarkdownFiles(dir: string, ignoreMarkdownFiles: string[]): Promise<Map<PostId, IdMapperMetadata>> {
  const idMapper = new Map<PostId, IdMapperMetadata>();
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
    idMapper.set(result.id, {
      path: result.path,
    });
    logger.log(`Processed: ${result.id} -> '${file}'`);
  }

  return idMapper;
}

export interface FileProcessor {
  process(dir: string): Promise<Map<PostId, IdMapperMetadata>>;
}

export class MarkdownFileProcessor implements FileProcessor {
  constructor(private ignoreMarkdownFiles: string[]) { }

  async process(dir: string): Promise<Map<PostId, IdMapperMetadata>> {
    return processMarkdownFiles(dir, this.ignoreMarkdownFiles);
  }
}

export async function processMarkdownDirectories(sourceDirs: string[], processor: FileProcessor): Promise<Map<PostId, IdMapperMetadata> | undefined> {
  console.time('Execution Time');

  let idMapperCollection = new Map<PostId, IdMapperMetadata>();

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
