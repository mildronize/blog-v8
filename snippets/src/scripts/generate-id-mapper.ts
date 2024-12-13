import fs from "fs-extra";
import path from "path";

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { ConsoleLogger, Logger, pinoLogBuilder } from "./utils/logger";

const { sourceDirectories, targetFile, ignoreMarkdownFiles } = config.blogIdModule;

export async function generateIdMapper(logger: Logger = new ConsoleLogger()) {
  const processor = new MarkdownFileProcessor('read', { ignoreMarkdownFiles, logger });
  const idMapperCollection = await processMarkdownDirectories(sourceDirectories, processor, logger) ?? new Map();
  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetFile));
  fs.writeJSON(targetFile, Object.fromEntries(idMapperCollection));
}

generateIdMapper(pinoLogBuilder('gen-id-mapper', 'info'));