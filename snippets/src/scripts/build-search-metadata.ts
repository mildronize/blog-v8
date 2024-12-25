import { executeBuildSearchIndex } from "../libs/search";
import { logTime } from "../utils/utils";
import { config } from "../_config";

async function buildSearchMetadata() {
  const indexSizes = ['small', 'large'] as const;
  for (const indexSize of indexSizes) {
    await executeBuildSearchIndex({
      cwd: config.rootDir,
      postMetadataFile: config.postMetadata.targetFile,
      searchIndexPath: config.searchIndex[indexSize].dir,
      indexSize,
    });
  }
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);