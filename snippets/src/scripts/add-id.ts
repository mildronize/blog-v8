import { MarkdownFileProcessor, processMarkdownDirectories } from "./libs/markdown-files";
import { config } from "./_config";
import { generateIdMapper } from "./generate-id-mapper";
import { pinoLogBuilder } from "./utils/logger";
import fs from 'fs-extra';
import * as core from '@actions/core';

const { sourceDirectories, ignoreMarkdownFiles } = config.blogIdModule;


try {
  // Ensure target id mapper file exists
  await generateIdMapper(pinoLogBuilder('gen-id-mapper', 'error'));
  // Add id to markdown files when missing
  const logger = pinoLogBuilder('add-id', 'info');
  const idStoreObject = (await fs.readJson(config.blogIdModule.targetFile)) as object;
  const processor = new MarkdownFileProcessor('update', { ignoreMarkdownFiles, logger, idStore: new Map(Object.entries(idStoreObject)) });
  const processorOutput = await processMarkdownDirectories(sourceDirectories, processor, logger);

  const stringifiedAddedIds = processorOutput.addedIds.slice(0, 3).join(', ');
  const continueMessage = processorOutput.addedIds.length > 3 ? '...' : '';
  let message = '';
  if(processorOutput.addedIds.length > 0) {
    message = `Added Post with ${processorOutput.addedIds.length} ids, including: ${stringifiedAddedIds} ${continueMessage}`;
  } else {
    message = 'No new ids added';
  }

  core.setOutput('added-id-message', message);
  core.setOutput('added-id-is-updated', processorOutput.addedIds.length > 0);
  core.setOutput('added-id-details', `Added ${processorOutput.addedIds.length} ids, including: ${processorOutput.addedIds.join(', ')}`);

} catch (error) {
  console.error("Error processing files: " + error);
}