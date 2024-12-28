import fs from "fs-extra";
import path from "path";

import { MarkdownFileProcessor, processMarkdownDirectories, toIdMapperCollection } from "./content";
import { config } from "../_config";
import { ConsoleLogger, Logger } from "../utils/logger";

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

export async function generateIdMapper(cwd = process.cwd(), targetMapFile: string, logger: Logger = new ConsoleLogger()) {
  const processor = new MarkdownFileProcessor('read', { ignoreMarkdownFiles, logger });
  const processorOutput = await processMarkdownDirectories(sourceDirectories, processor, logger, cwd) ?? new Map();
  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetMapFile));
  fs.writeJSON(targetMapFile, Object.fromEntries(toIdMapperCollection(processorOutput.markdownData)));
}