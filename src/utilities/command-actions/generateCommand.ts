import chalk from 'chalk';
import {
  generateFullCRUD,
  generateSlice,
  generateSaga,
  generateThunk,
} from './generators/index.js';
import { ensureConfig } from '../helpers/config.js';
import { setupDirectories } from '../helpers/fileSystem.js';
import {
  GenerateContext,
  GenerateOptions,
  SeckConfig,
} from '../types/index.js';
import path from 'path';
import { fileExists } from '../helpers/utils.js';

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

async function setupGenerateContext(
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

function isFullCRUDGeneration(options: GenerateOptions): boolean {
  return !options.slice && !options.saga && !options.thunk;
}

async function generateSelectedComponents(
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

function displayReminders(config: SeckConfig): void {
  if (config.stateManagement === 'reduxSaga') {
    console.log(
      chalk.whiteBright(
        'Reminder: Update your actions and watchers as necessary.'
      )
    );
  }
}
