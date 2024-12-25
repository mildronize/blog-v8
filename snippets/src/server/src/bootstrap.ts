
import { Document as FlexSearchDocument } from 'flexsearch';
import { importSearchIndex } from "../../libs/search";
import { config } from "../config";
import fs from 'fs-extra';
import { MarkdownMetadata } from '../../libs/type';

/**
 * Index for search, Singleton
 */
export let index: FlexSearchDocument<unknown, string[]>;
export let postMetadata: MarkdownMetadata[];
/**
 * Bootstrap the application start when the server starts
 */
export async function bootstrap() {
  index = await importSearchIndex({
    searchIndexPath: config.searchIndex.dir,
    indexSize: 'large'
  });
  postMetadata = await fs.readJson(config.postMetadata.targetFile);
}