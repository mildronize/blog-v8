import { executeBuildSearchIndex } from "../libs/search-libs";
import { logTime } from "../utils/utils";
import { config } from "../_config";

async function buildSearchMetadata() {
  await executeBuildSearchIndex({
    cwd: config.rootDir,
    postMetadataFile: config.postMetadata.targetFile,
    searchIndexPath: config.searchIndex.dir,
    indexSize: 'small',
  });
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);