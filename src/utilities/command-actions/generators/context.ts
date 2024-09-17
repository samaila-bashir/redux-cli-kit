import path from 'path';
import { ensureConfig } from '../../helpers/config.js';
import { setupDirectories } from '../../helpers/fileSystem.js';
import { fileExists } from '../../helpers/utils.js';
import { GenerateContext } from '../../types/index.js';

/**
 * Sets up the context for code generation.
 * @param {string} modelName - The name of the model to generate code for.
 * @returns {Promise<GenerateContext>} The context object for code generation.
 */
export async function setupGenerateContext(
  modelName: string
): Promise<GenerateContext> {
  const config = await ensureConfig();
  const { sliceDir, sagaDir, sliceFilePath, sagaFilePath } = setupDirectories(
    config,
    modelName
  );

  return {
    config,
    modelName,
    sliceDir,
    sagaDir: sagaDir ?? undefined,
    sliceFilePath,
    sagaFilePath: sagaFilePath ?? undefined,
    sliceFileExists: await fileExists(sliceFilePath),
    sagaFileExists: await fileExists(sagaFilePath ?? ''),
    customSlicePath: sagaDir ? path.relative(sagaDir, sliceDir) : '',
  };
}
