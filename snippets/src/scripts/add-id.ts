import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./config";
import { generateIdMapper } from "./generate-id-mapper";

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

// Ensure target id mapper file exists
await generateIdMapper();
const processor = new MarkdownFileProcessor('update', ignoreMarkdownFiles);
await processMarkdownDirectories(sourceDirectories, processor);
