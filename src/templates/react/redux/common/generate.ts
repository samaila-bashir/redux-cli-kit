import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  readConfigFile,
  writeConfigFile,
} from '../../../../utilities/helpers/config.js';
import { generateModelSagaCRUD } from '../redux-saga/generateModelSagaCRUD.js';
import { generateModelSliceThunk } from '../redux-thunk/generateModelSliceThunk.js';
import { generateModelSliceSaga } from '../redux-saga/generateModelSliceSaga.js';
import { generateSingleActionSliceSaga } from '../redux-saga/generateSingleActionSliceSaga.js';
import { generateSingleActionSaga } from '../redux-saga/generateSingleActionSaga.js';
import {
  chooseFramework,
  chooseStateManagement,
} from '../../../../utilities/helpers/utils.js';

// Function to generate slice, saga, or thunk based on user input
export async function generateModel(
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
    // Prompt the user for framework, state management, and directory
    const framework = await chooseFramework();
    const stateManagement = await chooseStateManagement();

    config = { framework, stateManagement };

    const { specifiedDir } = await promptUserForDirectory();
    baseDir = specifiedDir; // Use the specified directory provided by the user
    writeConfigFile(config);
    console.log(chalk.green('Configuration file created.'));
  } else {
    baseDir = path.join(process.cwd(), 'src/store');
  }

  const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
  const sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);
  const thunkDir = path.join(baseDir, `thunks/${modelName.toLowerCase()}`);

  // Ensure directories exist or create them
  await fs.ensureDir(sliceDir);

  const stateManagement = config.stateManagement;
  const action = options.action || 'fetch';

  // Determine customSlicePath based on the user's directory selection or fallback to default
  const customSlicePath = baseDir.includes('slices')
    ? path.relative(sagaDir, sliceDir) // If user specifies a directory in 'slices'
    : '../../slices'; // Fallback to default

  // Generate full CRUD or individual actions based on options
  if (!options.slice && !options.saga && !options.thunk) {
    // Generate full CRUD with Saga or Thunk
    if (stateManagement === 'reduxSaga') {
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
      await fs.ensureDir(thunkDir);
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
      // Generate full CRUD or single action thunk
      await fs.ensureDir(thunkDir);
      await fs.writeFile(
        path.join(thunkDir, 'index.ts'),
        generateModelSliceThunk(modelName, action) // Full CRUD or Single Action Thunk
      );
      console.log(chalk.green(`Slice and Thunk for ${modelName} generated.`));
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
