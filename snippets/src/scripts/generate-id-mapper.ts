import { config } from "../_config";
import { generateIdMapper } from "../libs/generate-id-mapper";
import { pinoLogBuilder } from "../utils/pino-log";

generateIdMapper(process.cwd(), config.blogIdModule.targetFile, pinoLogBuilder('gen-id-mapper', 'info'));