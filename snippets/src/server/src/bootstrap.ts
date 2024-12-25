
import { Document as FlexSearchDocument } from 'flexsearch';
import { importSearchIndex } from "../../libs/search-libs";
import { config } from "../config";

/**
 * Index for search, Singleton
 */
export let index: FlexSearchDocument<unknown, string[]>;
/**
 * Bootstrap the application start when the server starts
 */
export async function bootstrap() {
  index = await importSearchIndex(config.searchIndex.dir);
}