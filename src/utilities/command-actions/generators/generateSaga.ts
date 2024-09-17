import fs from 'fs-extra';
import chalk from 'chalk';
import { generateSingleActionSaga } from '../../../templates/react/redux/redux-saga/generateSingleActionSaga.js';
import { generateModelSagaCRUD } from '../../../templates/react/redux/redux-saga/generateModelSagaCRUD.js';
import { addActionToSaga } from '../../actions/addActionToSaga.js';

interface Config {
  stateManagement: string;
}

/**
 * Generates or updates a saga based on the given options.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} options - The options for saga generation.
 * @param {string} modelName - The name of the model.
 * @param {string} sagaDir - The directory for the saga file.
 * @param {string} sagaFilePath - The path to the saga file.
 * @param {string} customSlicePath - The custom path to the slice file.
 * @returns {Promise<void>}
 */
export async function generateSaga(
  config: Config,
  options: {
    slice?: boolean;
    saga?: boolean;
    thunk?: boolean;
    action?: string;
  },
  modelName: string,
  sagaFileExists: boolean, // Add this parameter
  sagaDir: string,
  sagaFilePath: string,
  customSlicePath: string
): Promise<void> {
  if (config.stateManagement !== 'reduxSaga') {
    console.log(chalk.red('Sagas are not used with redux-thunk.'));
    return;
  }

  await fs.ensureDir(sagaDir);

  if (sagaFileExists) {
    if (options.action) {
      // Add the new action to the existing saga file
      const existingSagaCode = await fs.readFile(sagaFilePath, 'utf8');
      const updatedSagaCode = addActionToSaga(
        existingSagaCode,
        modelName,
        options.action
      );
      await fs.writeFile(sagaFilePath, updatedSagaCode);
      console.log(
        chalk.green(
          `Action '${options.action}' added to existing saga for ${modelName}.`
        )
      );
    } else {
      console.log(
        chalk.yellow(
          `Saga for model ${modelName} already exists. Use --action to add a new action.`
        )
      );
    }
  } else {
    if (options.action) {
      const sagaContent = generateSingleActionSaga(modelName, options.action);
      await fs.writeFile(sagaFilePath, sagaContent);
      console.log(
        chalk.green(
          `Saga for ${modelName} with action '${options.action}' created.`
        )
      );
    } else {
      const sagaContent = generateModelSagaCRUD(modelName, customSlicePath);
      await fs.writeFile(sagaFilePath, sagaContent);
      console.log(chalk.green(`Full CRUD Saga for ${modelName} generated.`));
    }
  }
}
