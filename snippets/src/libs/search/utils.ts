import fs from 'fs-extra';
import path from 'path';

import { MarkdownFileProcessor, processMarkdownDirectories } from "../content";
import { config } from "../../_config";
import { Logger } from "../../utils/logger";
import { MarkdownFileProcessorOutput } from '../content';
import { ConsoleLogger } from '../../utils/console-logger';

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

export async function readAllMarkdown(cwd: string = process.cwd(), targetFile: string, logger: Logger = new ConsoleLogger()): Promise<MarkdownFileProcessorOutput> {
  const processor = new MarkdownFileProcessor('read', { ignoreMarkdownFiles, logger, isIncludeContent: true });
  const processorOutput = await processMarkdownDirectories(sourceDirectories, processor, logger, cwd) ?? new Map();

  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetFile));
  fs.writeJSON(targetFile, processorOutput.markdownData);
  return processorOutput;
}