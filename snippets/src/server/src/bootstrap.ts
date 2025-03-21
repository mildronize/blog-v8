
import { Document as FlexSearchDocument } from 'flexsearch';
import { importSearchIndexFromFile } from "../../libs/search";
import { config } from "../config";
import fs from 'fs-extra';
import { MarkdownMetadata } from '../../libs/content';

/**
 * Index for search, Singleton
 */
export let index: FlexSearchDocument<unknown, string[]>;
export let postMetadata: MarkdownMetadata[];
/**
 * Bootstrap the application start when the server starts
 */
export async function bootstrap() {
  index = await importSearchIndexFromFile({
    searchIndexPath: config.searchIndex.dir,
    indexSize: 'large'
  });
  postMetadata = await fs.readJson(config.postMetadata.targetFile);
}