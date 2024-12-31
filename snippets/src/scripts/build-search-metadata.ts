import { executeBuildSearchIndex } from "../libs/search";
import { logTime } from "../utils/utils";
import { config } from "../_config";

async function buildSearchMetadata() {
  const indexSizes = ['small', 'large'] as const;
  for (const indexSize of indexSizes) {
    await executeBuildSearchIndex({
      indexSize,
      cwd: config.snippetsDir,
      postMetadataFile: config.postMetadata.targetFile,
      searchIndexPath: config.searchIndex[indexSize].dir,
      searchIndexMetadataPath: config.searchIndex[indexSize].metadataPath,
      rootPublicDir: config.rootPublicDir,
      enableThaiSegmentationContent: config.enableThaiSegmentationContent,
    });
  }
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);