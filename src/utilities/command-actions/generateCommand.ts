import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { readConfigFile, writeConfigFile } from '../helpers/config.js';
import { generateModelSagaCRUD } from '../../templates/react/redux/redux-saga/generateModelSagaCRUD.js';
import { generateModelSliceThunk } from '../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';
import { generateModelSliceSaga } from '../../templates/react/redux/redux-saga/generateModelSliceSaga.js';
import { generateSingleActionSliceSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSliceSaga.js';
import { generateSingleActionSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSaga.js';
import { chooseFramework, chooseStateManagement } from '../helpers/utils.js';

// Function to generate slice, saga, or thunk based on user input
export async function generateCommand(
  modelName: string,
  options: { slice?: boolean; saga?: boolean; thunk?: boolean; action?: string }
): Promise<void> {
  let config = readConfigFile();
  let baseDir: string;

  // Check if seckconfig.json exists
  if (!config) {
    console.log(
      chalk.yellow("No configuration file found. Let's configure your project.")
    );

    // Prompt the user for framework, state management, and store directory
    const framework = await chooseFramework();
    const stateManagement = await chooseStateManagement();

    const { specifiedDir } = await promptUserForDirectory();
    baseDir = specifiedDir;

    // Add the directory to the config and save
    config = { framework, stateManagement, storeDir: baseDir };
    writeConfigFile(config);
    console.log(chalk.green('Configuration file created.'));
  } else {
    baseDir = config.storeDir || path.join(process.cwd(), 'src/store');
  }

  // Proceed with the rest of the model generation logic
  const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
  const sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);

  const stateManagement = config.stateManagement;
  const action = options.action;

  // Determine customSlicePath based on the user's directory selection or fallback to default
  const customSlicePath = baseDir.includes('slices')
    ? path.relative(sagaDir, sliceDir) // If user specifies a directory in 'slices'
    : '../../slices'; // Fallback to default

  // Generate full CRUD or individual actions based on options
  if (!options.slice && !options.saga && !options.thunk) {
    // Generate full CRUD with Saga or Thunk
    if (stateManagement === 'reduxSaga') {
      await fs.ensureDir(sliceDir);
      await fs.ensureDir(sagaDir);
      await fs.writeFile(
        path.join(sliceDir, 'index.ts'),
        generateModelSliceSaga(modelName) // Full CRUD for Slice (Saga)
      );
      await fs.writeFile(
        path.join(sagaDir, 'index.ts'),
        generateModelSagaCRUD(modelName, customSlicePath) // Full CRUD for Saga
      );
      console.log(
        chalk.green(`Full CRUD Slice and Saga for ${modelName} generated.`)
      );
    } else if (stateManagement === 'reduxThunk') {
      await fs.ensureDir(sliceDir);
      await fs.writeFile(
        path.join(sliceDir, 'index.ts'),
        generateModelSliceThunk(modelName) // Full CRUD for Thunk
      );
      console.log(
        chalk.green(`Full CRUD Slice and Thunk for ${modelName} generated.`)
      );
    }
  } else {
    // Handle individual file generation
    if (options.slice && !options.action) {
      await fs.ensureDir(sliceDir);
      // Generate full CRUD slice for model
      await fs.writeFile(
        path.join(sliceDir, 'index.ts'),
        stateManagement === 'reduxSaga'
          ? generateModelSliceSaga(modelName) // Full CRUD for Slice (Saga)
          : generateModelSliceThunk(modelName) // Full CRUD for Thunk
      );
      console.log(chalk.green(`CRUD Slice for ${modelName} generated.`));
    }
    if (options.saga && !options.action) {
      // Generate full CRUD saga for model
      await fs.ensureDir(sagaDir);
      await fs.writeFile(
        path.join(sagaDir, 'index.ts'),
        generateModelSagaCRUD(modelName, customSlicePath) // Full CRUD for Saga
      );
      console.log(chalk.green(`CRUD Saga for ${modelName} generated.`));
    }
    if (options.saga && options.action) {
      // Generate single-action saga for model
      await fs.ensureDir(sagaDir);
      await fs.writeFile(
        path.join(sagaDir, 'index.ts'),
        generateSingleActionSaga(modelName) // Single Action Saga
      );
      console.log(chalk.green(`Single Action Saga for ${action} generated.`));
    }
    if (options.slice && options.action) {
      // Generate single-action slice for model
      await fs.writeFile(
        path.join(sliceDir, 'index.ts'),
        stateManagement === 'reduxSaga'
          ? generateSingleActionSliceSaga(modelName, action) // Single Action Slice for Saga
          : generateModelSliceThunk(modelName, action) // Single Action Slice for Thunk
      );
      console.log(chalk.green(`Single Action Slice for ${action} generated.`));
    }
    if (options.thunk) {
      if (stateManagement === 'reduxThunk') {
        await fs.ensureDir(sliceDir);
        await fs.writeFile(
          path.join(sliceDir, 'index.ts'),
          generateModelSliceThunk(modelName, options.action)
        );
        console.log(chalk.green(`Slice and Thunk for ${modelName} generated.`));
      } else if (stateManagement === 'reduxSaga') {
        console.log(chalk.red('Thunks are not used with redux-saga.'));
      }
    }
  }

  if (config) {
    // Notify user to update actions and watchers (if applicable)
    console.log(
      chalk.blue('Reminder: Update your actions and watchers as necessary.')
    );
  }
}

// Function to prompt user for directory
async function promptUserForDirectory(): Promise<{ specifiedDir: string }> {
  const { dir } = await inquirer.prompt([
    {
      type: 'input',
      name: 'dir',
      message: 'Enter the directory where you want to generate the files:',
      default: './src/store',
    },
  ]);
  return { specifiedDir: dir };
}
