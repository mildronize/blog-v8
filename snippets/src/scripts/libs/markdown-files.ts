import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, PostMetadata } from "./type";

const logger = new Logger(String(process.env.DEBUG).toLowerCase() === "true");

export async function processMarkdownFile(dir: string, ignoreMarkdownFiles: string[]): Promise<Map<PostId, PostMetadata>> {
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

export interface FileProcessor {
  process(dir: string): Promise<Map<PostId, PostMetadata>>;
}

export class MarkdownFileProcessor implements FileProcessor {
  constructor(private ignoreMarkdownFiles: string[]) { }

  async process(dir: string): Promise<Map<PostId, PostMetadata>> {
    return processMarkdownFile(dir, this.ignoreMarkdownFiles);
  }
}

export async function processMarkdownFiles(sourceDirs: string[], processor: FileProcessor): Promise<Map<PostId, PostMetadata> | undefined> {
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
