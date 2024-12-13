import fs from "fs-extra";
import path from "path";

import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";

const IGNORE_MARKDOWN_FILES = ["_index.md"];

console.log("Generating ID mapper...");

const sourceDirectories = ["../content/posts"];
const targetDirectory = "../public/api";

const processor = new MarkdownFileProcessor(IGNORE_MARKDOWN_FILES);
const idMapperCollection = await processMarkdownDirectories(sourceDirectories, processor) ?? new Map();
// Ensure target directory exists
await fs.ensureDir(targetDirectory);
fs.writeJSON(path.join(targetDirectory, "id-mapper.json"), Object.fromEntries(idMapperCollection));
console.log(`ID mapper generated with ${idMapperCollection.size} entries.`);

