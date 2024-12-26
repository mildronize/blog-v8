import { executeBuildSearchIndex } from "../../libs/search";
import { logTime } from "../../utils/utils";
import { config } from "../config";

async function buildSearchMetadata() {
  await executeBuildSearchIndex({
    cwd: config.rootDir,
    postMetadataFile: config.postMetadata.targetFile,
    searchIndexPath: config.searchIndex.dir,
    indexSize: 'large',
    searchIndexMetadataPath: config.searchIndex.siteMapPath,
  });
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);