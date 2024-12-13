import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { composeFrontMatter, extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, IdMapperMetadata, PostMetadata, MarkdownFileProcessorMode } from "./type";
import { log } from "console";

const logger = new Logger(String(process.env.DEBUG).toLowerCase() === "true");

export function extractMarkdownMetadata(dir: string, file: string, content: string): PostMetadata | undefined {
  const { data: frontmatter } = extractFrontMatter(content);
  if (!frontmatter?.extra?.id) {
    logger.warn(`Warn: No ID found in frontmatter of file: ${file}`);
    return;
  }
  return {
    id: frontmatter.extra.id,
    path: generateZolaPostPath(dir, file, frontmatter.slug),
  }

}

export interface FileProcessor {
  process(dir: string): Promise<Map<PostId, IdMapperMetadata>>;
}

/**
 * A file processor that processes markdown files
 * 
 * Mode:
 * - 'read': Reads the markdown files and extracts the metadata
 * - 'update': Updates the markdown files with the id (auto-generates if not present)
 * 
 * @param mode The mode of the processor, either 'read' or 'update'
 * @param ignoreMarkdownFiles A list of markdown files to ignore
 * @returns A file processor
 */

export class MarkdownFileProcessor implements FileProcessor {
  constructor(private mode: MarkdownFileProcessorMode, private ignoreMarkdownFiles: string[]) { }

  async updateId(file: string, markdownContent: string): Promise<void> {
    const { data: frontmatter, content } = extractFrontMatter(markdownContent);
    if (!frontmatter?.extra?.id) {
      console.log(`Updating file: ${file}`);
      const outputMarkdown = composeFrontMatter({
        ...frontmatter,
        extra: {
          ...frontmatter.extra,
          id: 'auto-generated',
        }
      }, content);
      await fs.writeFile(file, outputMarkdown, "utf8");
      logger.log(`Update id: ${file}`);
    }
  }

  async process(dir: string): Promise<Map<PostId, IdMapperMetadata>> {
    const idMapper = new Map<PostId, IdMapperMetadata>();
    // Find all markdown files in the directory
    const files = await glob(`${dir}/**/*.md`);

    for (const file of files) {
      if (this.ignoreMarkdownFiles.includes(path.basename(file))) {
        logger.log(`Ignoring: ${file}`);
        continue;
      }
      const markdownContent = await fs.readFile(file, "utf8");
      if (this.mode === 'update') {
        await this.updateId(file, markdownContent);
        continue;
      }
      const result = extractMarkdownMetadata(dir, file, markdownContent);
      if (!result) continue;
      idMapper.set(result.id, {
        path: result.path,
      });
      logger.log(`Processed: ${result.id} -> '${file}'`);
    }

    return idMapper;
  }
}

export async function processMarkdownDirectories(sourceDirs: string[], processor: FileProcessor): Promise<Map<PostId, IdMapperMetadata> | undefined> {
  const startTime = Date.now();
  let idMapperCollection = new Map<PostId, IdMapperMetadata>();

  try {
    for (const dir of sourceDirs) {
      const idMapper = await processor.process(dir);
      idMapperCollection = new Map([...idMapperCollection, ...idMapper]);
    }
    const endTime = Date.now();
    logger.warn(`Processed ${idMapperCollection.size} files in ${endTime - startTime}ms`);
    return idMapperCollection;
  } catch (error) {
    logger.error("Error processing files: " + error);
  }
}
