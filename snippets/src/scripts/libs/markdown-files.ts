import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { composeFrontMatter, extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, IdMapperMetadata, PostMetadata, MarkdownFileProcessorMode } from "./type";
import { retryNewId } from "./uuid";

export function extractMarkdownMetadata(dir: string, file: string, content: string): PostMetadata | undefined {
  const { data: frontmatter } = extractFrontMatter(content);
  if (!frontmatter?.extra?.id) return;
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
  private logger: Logger;
  constructor(private mode: MarkdownFileProcessorMode, private options: {
    ignoreMarkdownFiles: string[]
    logger: Logger
    idStore?: Map<string, unknown>
  }) {
    this.logger = options.logger;
    this.logger.info(`MarkdownFileProcessor: '${mode}' Mode`);
  }

  async updateId(file: string, markdownContent: string): Promise<void> {
    if(!this.options.idStore) {
      throw new Error('Id Store is required for update mode');
    }
    const { data: frontmatter, content } = extractFrontMatter(markdownContent);
    if (!frontmatter?.extra?.id) {
      const id = retryNewId(this.options.idStore);
      const outputMarkdown = composeFrontMatter({
        ...frontmatter,
        extra: {
          ...frontmatter.extra,
          id,
        }
      }, content);
      await fs.writeFile(file, outputMarkdown, "utf8");
      this.logger.info(`Updated id: ${file} with id='${id}'`);
    }
  }

  async process(dir: string): Promise<Map<PostId, IdMapperMetadata>> {
    const idMapper = new Map<PostId, IdMapperMetadata>();
    // Find all markdown files in the directory
    const files = await glob(`${dir}/**/*.md`);

    for (const file of files) {
      if (this.options.ignoreMarkdownFiles.includes(path.basename(file))) {
        this.logger.debug(`Ignoring: ${file}`);
        continue;
      }
      const markdownContent = await fs.readFile(file, "utf8");
      const result = extractMarkdownMetadata(dir, file, markdownContent);
      if (!result) {
        if (this.mode === 'update') {
          await this.updateId(file, markdownContent);
        } else {
          this.logger.warn(`No post ID found: ${file}`);
        }
        continue;
      }
      idMapper.set(result.id, {
        path: result.path,
      });
      this.logger.debug(`Processed: ${result.id} -> '${file}'`);
    }

    return idMapper;
  }
}

export async function processMarkdownDirectories(sourceDirs: string[], processor: FileProcessor, logger: Logger): Promise<Map<PostId, IdMapperMetadata> | undefined> {
  const startTime = Date.now();
  let idMapperCollection = new Map<PostId, IdMapperMetadata>();

  try {
    for (const dir of sourceDirs) {
      const idMapper = await processor.process(dir);
      idMapperCollection = new Map([...idMapperCollection, ...idMapper]);
    }
    const endTime = Date.now();
    logger.info(`Processed ${idMapperCollection.size} files in ${endTime - startTime}ms`);
    return idMapperCollection;
  } catch (error) {
    logger.error("Error processing files: " + error);
  }
}
