import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { generateTodoSlice } from './templates/todoSliceTemplate.js';
import { generateTodoSaga } from './templates/todoSagaTemplate.js';
import { generateStoreConfig } from './templates/storeConfigTemplate.js';
import { generateRootReducer } from './templates/rootReducerTemplate.js';
import { generateRootSaga } from './templates/rootSagaTemplate.js';
import { generateSagaActions } from './templates/sagaActionsTemplate.js';
import { generateTodoComponent } from './templates/todoComponentTemplate.js';
import { generateTodoCSSModule } from './templates/todoComponentCSSTemplate.js';

interface SetupOptions {
  saga?: boolean;
  thunk?: boolean;
}

// Function to ask the user whether to use Redux Saga or Thunk
async function chooseMiddleware(): Promise<string> {
  const { middleware } = await inquirer.prompt([
    {
      type: 'list',
      name: 'middleware',
      message: 'Which middleware would you like to use?',
      choices: ['Redux Saga', 'Redux Thunk'],
    },
  ]);

  return middleware === 'Redux Saga' ? 'saga' : 'thunk';
}

// Function to install Redux and dependencies based on user choice
async function installDependencies(middleware: string): Promise<void> {
  const basePackages = [
    'redux',
    '@reduxjs/toolkit',
    'redux-persist',
    'react-redux',
    'axios',
  ];
  const middlewarePackage =
    middleware === 'thunk' ? 'redux-thunk' : 'redux-saga';

  console.log(
    chalk.green(
      `Installing Redux, Redux Toolkit, redux-persist, and ${middlewarePackage}...`
    )
  );
  await execa('npm', ['install', ...basePackages, middlewarePackage]);
}

// Function to create the Redux store structure and configuration files
async function createStoreStructure(middleware: string): Promise<void> {
  const srcDir = path.join(process.cwd(), 'src/store');
  const slicesDir = path.join(srcDir, 'slices');
  const todosDir = path.join(srcDir, '../todos');

  // Ensure the slices and todos directories are created
  await fs.ensureDir(path.join(slicesDir, 'todos'));
  await fs.ensureDir(todosDir);

  // Create a sample slice for the todo model, passing the middleware flag
  await fs.writeFile(
    path.join(slicesDir, 'todos', 'index.ts'),
    generateTodoSlice(middleware)
  );

  // Create sagas only if Saga is chosen
  if (middleware === 'saga') {
    const sagasDir = path.join(srcDir, 'sagas');
    await fs.ensureDir(path.join(sagasDir, 'todos'));

    // Create a sample saga for the todo model
    await fs.writeFile(
      path.join(sagasDir, 'todos', 'index.ts'),
      generateTodoSaga(middleware)
    );

    // Create the root saga combining all sagas
    await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());

    // Create the actions directory inside sagas
    const actionsDir = path.join(sagasDir, 'actions');
    await fs.ensureDir(actionsDir);
    await fs.writeFile(
      path.join(actionsDir, 'index.ts'),
      generateSagaActions()
    );
  }

  // Create the root reducer combining all slices
  await fs.writeFile(path.join(slicesDir, 'index.ts'), generateRootReducer());

  // Create the store configuration file
  await fs.writeFile(
    path.join(srcDir, 'index.ts'),
    generateStoreConfig(middleware)
  );

  // Create the Todo component and corresponding CSS module
  await fs.writeFile(
    path.join(todosDir, 'index.tsx'),
    generateTodoComponent(middleware)
  );
  await fs.writeFile(
    path.join(todosDir, 'TodoComponent.module.css'),
    generateTodoCSSModule()
  );

  console.log(chalk.green('Redux store setup complete!'));
}

// Initial setup function for the CLI command
export async function setupRedux(options: SetupOptions): Promise<void> {
  let middleware = '';

  try {
    // Check if saga or thunk option is provided
    if (options.saga) {
      middleware = 'saga';
    } else if (options.thunk) {
      middleware = 'thunk';
    } else {
      // Prompt for middleware choice if neither --saga nor --thunk is provided
      middleware = await chooseMiddleware();
    }

    await installDependencies(middleware);
    await createStoreStructure(middleware);
  } catch (error: any) {
    if (error.message.includes('User force closed the prompt')) {
      console.log(chalk.yellow('Process interrupted. Exiting...'));
      process.exit(0);
    } else {
      console.error(chalk.red('An error occurred:'), error.message);
    }
  }
}
