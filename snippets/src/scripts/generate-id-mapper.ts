import fs from "fs-extra";
import path from "path";

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./config";

const { sourceDirectories, targetFile, ignoreMarkdownFiles } = config.blogIdModule;

export async function generateIdMapper() {
  const processor = new MarkdownFileProcessor('read', ignoreMarkdownFiles);
  const idMapperCollection = await processMarkdownDirectories(sourceDirectories, processor) ?? new Map();
  // Ensure target directory exists
  await fs.ensureDir(path.dirname(targetFile));
  fs.writeJSON(targetFile, Object.fromEntries(idMapperCollection));
  console.log(`ID mapper generated with ${idMapperCollection.size} entries.`);
}

console.log("Generating ID mapper...");
generateIdMapper();