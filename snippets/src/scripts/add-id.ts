import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { generateIdMapper } from "./generate-id-mapper";
import { pinoLogBuilder } from "./utils/logger";

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;

// Ensure target id mapper file exists
await generateIdMapper(pinoLogBuilder('gen-id-mapper', 'error'));
// Add id to markdown files when missing
const logger = pinoLogBuilder('add-id', 'info');
const processor = new MarkdownFileProcessor('update', { ignoreMarkdownFiles, logger });
await processMarkdownDirectories(sourceDirectories, processor, logger);
