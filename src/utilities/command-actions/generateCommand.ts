import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { readConfigFile, writeConfigFile } from '../helpers/config.js';
import { chooseFramework, chooseStateManagement } from '../helpers/utils.js';
import { promptUserForDirectory } from '../helpers/promptUserForDirectory.js';
import { generateFullCRUD } from './generators/generateFullCRUD.js';
import { generateSlice } from './generators/generateSlice.js';
import { generateSaga } from './generators/generateSaga.js';
import { generateThunk } from './generators/generateThunk.js';

interface Config {
  storeDir?: string;
  framework: string;
  stateManagement: 'reduxSaga' | 'reduxThunk';
}

/**
 * Ensures a configuration exists, creating one if necessary.
 * @returns {Promise<Object>} The configuration object.
 */
async function ensureConfig(): Promise<Config> {
  let config = readConfigFile();

  if (!config) {
    console.log(
      chalk.yellow("No configuration file found. Let's configure your project.")
    );

    const framework = await chooseFramework();
    const stateManagement = (await chooseStateManagement()) as
      | 'reduxSaga'
      | 'reduxThunk';
    const { specifiedDir } = await promptUserForDirectory();
    config = { framework, stateManagement, storeDir: specifiedDir } as Config;
    writeConfigFile(config);

    console.log(chalk.green('Configuration file created.'));
  }

  return config as Config;
}

/**
 * Sets up directories and file paths for the generation process.
 * @param {Object} config - The configuration object.
 * @param {string} modelName - The name of the model.
 * @returns {Object} An object containing the necessary directories and file paths.
 */
function setupDirectories(config: Config, modelName: string) {
  const baseDir = config.storeDir || path.join(process.cwd(), 'src/store');
  const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
  const sliceFilePath = path.join(sliceDir, 'index.ts');

  // Only set up saga directory if using Redux Saga
  let sagaDir = null;
  let sagaFilePath = null;

  if (config.stateManagement === 'reduxSaga') {
    sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);
    sagaFilePath = path.join(sagaDir, 'index.ts');
  }

  return { baseDir, sliceDir, sagaDir, sliceFilePath, sagaFilePath };
}

/**
 * Generates Redux slice, saga, or thunk based on user input.
 *
 * @param {string} modelName - The name of the model for which the slice/saga/thunk will be generated.
 * @param {Object} options - Options for the generation process.
 * @param {boolean} [options.slice] - Indicates if a slice should be generated.
 * @param {boolean} [options.saga] - Indicates if a saga should be generated.
 * @param {boolean} [options.thunk] - Indicates if a thunk should be generated.
 * @param {string} [options.action] - Specific action to be generated within the slice or saga.
 *
 * @returns {Promise<void>} - Resolves when the command generation is complete.
 */
export async function generateCommand(
  modelName: string,
  options: { slice?: boolean; saga?: boolean; thunk?: boolean; action?: string }
): Promise<void> {
  const config = await ensureConfig();
  const { sliceDir, sagaDir, sliceFilePath, sagaFilePath } = setupDirectories(
    config,
    modelName
  );
  const sliceFileExists = await fs.pathExists(sliceFilePath);

  let sagaFileExists = false;
  let customSlicePath = '';

  if (config.stateManagement === 'reduxSaga' && sagaDir && sagaFilePath) {
    sagaFileExists = await fs.pathExists(sagaFilePath);
    customSlicePath = path.relative(sagaDir, sliceDir);
  }

  if (!options.slice && !options.saga && !options.thunk) {
    await generateFullCRUD(
      config,
      modelName,
      sliceFileExists,
      sliceDir,
      sagaDir,
      sliceFilePath,
      sagaFilePath,
      customSlicePath
    );
  } else {
    if (options.slice) {
      await generateSlice(
        config,
        options,
        modelName,
        sliceFileExists,
        sliceDir,
        sliceFilePath
      );
    }
    if (
      options.saga &&
      config.stateManagement === 'reduxSaga' &&
      sagaDir &&
      sagaFilePath
    ) {
      await generateSaga(
        config,
        options,
        modelName,
        sagaFileExists,
        sagaDir,
        sagaFilePath,
        customSlicePath
      );
    }
    if (options.thunk || config.stateManagement === 'reduxThunk') {
      await generateThunk(
        config,
        options,
        modelName,
        sliceFileExists,
        sliceDir,
        sliceFilePath
      );
    }
  }

  if (options.saga && config.stateManagement === 'reduxSaga') {
    console.log(
      chalk.whiteBright(
        'Reminder: Update your actions and watchers as necessary.'
      )
    );
  }
}
