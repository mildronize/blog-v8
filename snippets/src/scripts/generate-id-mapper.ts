import fs from "fs-extra";
import path from "path";

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./config";

const { sourceDirectories, targetFile, ignoreMarkdownFiles } = config.blogIdModule;

console.log("Generating ID mapper...");

const processor = new MarkdownFileProcessor(ignoreMarkdownFiles);
const idMapperCollection = await processMarkdownDirectories(sourceDirectories, processor) ?? new Map();
// Ensure target directory exists
await fs.ensureDir(path.dirname(targetFile));
fs.writeJSON(targetFile, Object.fromEntries(idMapperCollection));
console.log(`ID mapper generated with ${idMapperCollection.size} entries.`);

