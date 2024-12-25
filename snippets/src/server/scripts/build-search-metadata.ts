import { generateIdMapper } from "../../libs/generate-id-mapper";
import { executeBuildSearchIndex } from "../../libs/search-libs";
import { logTime } from "../../utils/utils";
import { config } from "../config";

async function buildSearchMetadata() {
  await generateIdMapper(config.rootDir, config.idMapper.targetFile);
  await executeBuildSearchIndex(config.rootDir, config.searchIndex.dir);
}

logTime(
  'build-search-metadata',
  buildSearchMetadata,
);