import glob from "tiny-glob";
import { Logger } from "../utils/logger";
import path from "path";
import fs from 'fs-extra';
import { composeFrontMatter, extractFrontMatter, generateZolaPostPath } from "./zola";
import { PostId, IdMapperMetadata, MarkdownFileProcessorMode, MarkdownFileProcessorOutput, MarkdownMetadata } from "./type";
import { retryNewId } from "./uuid";

export function extractMarkdownMetadata(dir: string, file: string, content: string): MarkdownMetadata {
  const { data: frontmatter } = extractFrontMatter(content);
  return {
    id: frontmatter?.extra?.id,
    path: generateZolaPostPath(dir, file, frontmatter.slug),
  }

}

export interface FileProcessor {
  process(dir: string): Promise<MarkdownFileProcessorOutput>;
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

  async updateId(file: string, markdownContent: string): Promise<string | undefined> {
    if (!this.options.idStore) {
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
      return id;
    }
    return;
  }

  async process(dir: string): Promise<MarkdownFileProcessorOutput> {
    const markdownData: MarkdownMetadata[] = [];
    const addedIds: string[] = [];
    // Find all markdown files in the directory
    const files = await glob(`${dir}/**/*.md`);

    for (const file of files) {
      if (this.options.ignoreMarkdownFiles.includes(path.basename(file))) {
        this.logger.debug(`Ignoring: ${file}`);
        continue;
      }
      const markdownContent = await fs.readFile(file, "utf8");
      const result = extractMarkdownMetadata(dir, file, markdownContent);
      if (!result.id) {
        if (this.mode === 'update') {
          const addedId = await this.updateId(file, markdownContent);
          if (addedId) addedIds.push(addedId);
        } else {
          this.logger.warn(`No post ID found: ${file}`);
        }
        continue;
      }
      markdownData.push(result);

      this.logger.debug(`Processed: ${result.id} -> '${file}'`);
    }

    return {
      markdownData: markdownData,
      addedIds,
    };
  }
}

export async function processMarkdownDirectories(sourceDirs: string[], processor: FileProcessor, logger: Logger): Promise<MarkdownFileProcessorOutput> {
  const startTime = Date.now();
  let markdownData: MarkdownMetadata[] = [];
  let addedIds: string[] = [];

  for (const dir of sourceDirs) {
    const processorOutput = await processor.process(dir);
    markdownData = [...markdownData, ...processorOutput.markdownData];
    addedIds = [...addedIds, ...processorOutput.addedIds];
  }
  const endTime = Date.now();
  logger.info(`Processed ${markdownData.length} files in ${endTime - startTime}ms`);
  return {
    markdownData,
    addedIds,
  };
}

export function toIdMapperCollection(metadata: MarkdownMetadata[]): Map<PostId, IdMapperMetadata> {
  return new Map(
    metadata
      .filter(({ id }) => id !== undefined)
      .map(({ id, path }) => {
        if (!id) throw new Error('Id is undefined');
        return [id, { path }]
      }));
}