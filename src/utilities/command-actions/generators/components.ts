import { GenerateContext, GenerateOptions } from '../../types/index.js';
import { generateSaga } from './generateSaga.js';
import { generateSlice } from './generateSlice.js';
import { generateThunk } from './generateThunk.js';

/**
 * Generates selected components based on the provided context and options.
 * @param {GenerateContext} context - The context object for code generation.
 * @param {GenerateOptions} options - The options specifying which components to generate.
 * @returns {Promise<void>}
 */
export async function generateSelectedComponents(
  context: GenerateContext,
  options: GenerateOptions
): Promise<void> {
  if (options.slice) {
    await generateSlice(
      context.config,
      options,
      context.modelName,
      context.sliceFileExists,
      context.sliceDir,
      context.sliceFilePath
    );
  }
  if (
    options.saga &&
    context.config.stateManagement === 'reduxSaga' &&
    context.sagaDir &&
    context.sagaFilePath
  ) {
    await generateSaga(
      context.config,
      options,
      context.modelName,
      context.sagaFileExists,
      context.sagaDir,
      context.sagaFilePath,
      context.customSlicePath
    );
  }
  if (options.thunk || context.config.stateManagement === 'reduxThunk') {
    await generateThunk(
      context.config,
      options,
      context.modelName,
      context.sliceFileExists,
      context.sliceDir,
      context.sliceFilePath
    );
  }
}

/**
 * Determines if a full CRUD generation is requested based on the options.
 * @param {GenerateOptions} options - The options specifying which components to generate.
 * @returns {boolean} True if full CRUD generation is requested, false otherwise.
 */
export function isFullCRUDGeneration(options: GenerateOptions): boolean {
  return !options.slice && !options.saga && !options.thunk;
}
