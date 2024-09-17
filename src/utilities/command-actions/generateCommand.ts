import { GenerateOptions } from '../types/index.js';
import {
  generateSelectedComponents,
  isFullCRUDGeneration,
} from './generators/components.js';
import { setupGenerateContext } from './generators/context.js';
import { generateFullCRUD } from './generators/generateFullCRUD.js';
import { displayReminders } from './generators/reminders.js';

/**
 * Generates code components based on the provided model name and options.
 * @param {string} modelName - The name of the model to generate code for.
 * @param {GenerateOptions} options - The options specifying which components to generate.
 * @returns {Promise<void>}
 */
export async function generateCommand(
  modelName: string,
  options: GenerateOptions
): Promise<void> {
  const context = await setupGenerateContext(modelName);

  if (isFullCRUDGeneration(options)) {
    await generateFullCRUD(
      context.config,
      context.modelName,
      context.sliceFileExists,
      context.sliceDir,
      context.sagaDir ?? null,
      context.sliceFilePath,
      context.sagaFilePath ?? null,
      context.customSlicePath
    );
  } else {
    await generateSelectedComponents(context, options);
  }

  displayReminders(context.config);
}
