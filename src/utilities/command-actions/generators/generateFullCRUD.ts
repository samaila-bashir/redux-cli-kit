import fs from 'fs-extra';
import chalk from 'chalk';
import { generateModelSliceSaga } from '../../../templates/react/redux/redux-saga/generateModelSliceSaga.js';
import { generateModelSagaCRUD } from '../../../templates/react/redux/redux-saga/generateModelSagaCRUD.js';
import { generateModelSliceThunk } from '../../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';

interface Config {
  stateManagement: string;
}

/**
 * Generates full CRUD functionality for a given model.
 *
 * @param {Object} config - The configuration object.
 * @param {string} modelName - The name of the model.
 * @param {boolean} sliceFileExists - Whether the slice file already exists.
 * @param {string} sliceDir - The directory for the slice file.
 * @param {string} sagaDir - The directory for the saga file.
 * @param {string} sliceFilePath - The path to the slice file.
 * @param {string} sagaFilePath - The path to the saga file.
 * @param {string} customSlicePath - The custom path to the slice file.
 * @returns {Promise<void>}
 */
export async function generateFullCRUD(
  config: Config,
  modelName: string,
  sliceFileExists: boolean,
  sliceDir: string,
  sagaDir: string | null,
  sliceFilePath: string,
  sagaFilePath: string | null,
  customSlicePath: string
): Promise<void> {
  if (!sliceFileExists) {
    await fs.ensureDir(sliceDir);

    if (config.stateManagement === 'reduxSaga' && sagaDir && sagaFilePath) {
      await fs.ensureDir(sagaDir);
      await fs.writeFile(sliceFilePath, generateModelSliceSaga(modelName));
      await fs.writeFile(
        sagaFilePath,
        generateModelSagaCRUD(modelName, customSlicePath)
      );
      console.log(
        chalk.green(`Full CRUD Slice and Saga for ${modelName} generated.`)
      );
    } else if (config.stateManagement === 'reduxThunk') {
      await fs.writeFile(sliceFilePath, generateModelSliceThunk(modelName));
      console.log(
        chalk.green(`Full CRUD Slice and Thunk for ${modelName} generated.`)
      );
    }
  } else {
    console.log(chalk.red(`Model ${modelName} already exists.`));
  }
}
