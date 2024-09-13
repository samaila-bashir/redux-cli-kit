import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { chooseStateManagement } from './utilities/helpers/utils.js';
import { generateTodoSlice } from './templates/todoSliceTemplate.js';
import { generateTodoSaga } from './templates/todoSagaTemplate.js';
import { generateStoreConfig } from './templates/storeConfigTemplate.js';
import { generateRootReducer } from './templates/rootReducerTemplate.js';
import { generateRootSaga } from './templates/rootSagaTemplate.js';
import { generateSagaActions } from './templates/sagaActionsTemplate.js';
import { generateTodoComponent } from './templates/todoComponentTemplate.js';
import { generateTodoCSSModule } from './templates/todoComponentCSSTemplate.js';
// Function to install dependencies based on the state management choice
async function installDependencies(stateManagement) {
    const basePackages = [
        'redux',
        '@reduxjs/toolkit',
        'redux-persist',
        'react-redux',
        'axios',
    ];
    let middlewarePackage = '';
    if (stateManagement === 'reduxSaga') {
        middlewarePackage = 'redux-saga';
    }
    else if (stateManagement === 'reduxThunk') {
        middlewarePackage = 'redux-thunk';
    }
    if (middlewarePackage) {
        console.log(chalk.green(`Installing Redux, Redux Toolkit, redux-persist, and ${middlewarePackage}...`));
        await execa('npm', ['install', ...basePackages, middlewarePackage]);
    }
}
async function createStoreStructure(stateManagement) {
    const srcDir = path.join(process.cwd(), 'src/store');
    const slicesDir = path.join(srcDir, 'slices');
    const todosDir = path.join(srcDir, '../todos');
    await fs.ensureDir(path.join(slicesDir, 'todos'));
    await fs.ensureDir(todosDir);
    // Create a sample slice for the todo model
    await fs.writeFile(path.join(slicesDir, 'todos', 'index.ts'), generateTodoSlice(stateManagement));
    // Create sagas if Redux Saga is chosen
    if (stateManagement === 'reduxSaga') {
        const sagasDir = path.join(srcDir, 'sagas');
        await fs.ensureDir(path.join(sagasDir, 'todos'));
        await fs.writeFile(path.join(sagasDir, 'todos', 'index.ts'), generateTodoSaga(stateManagement));
        await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());
        const actionsDir = path.join(sagasDir, 'actions');
        await fs.ensureDir(actionsDir);
        await fs.writeFile(path.join(actionsDir, 'index.ts'), generateSagaActions());
    }
    await fs.writeFile(path.join(slicesDir, 'index.ts'), generateRootReducer());
    await fs.writeFile(path.join(srcDir, 'index.ts'), generateStoreConfig(stateManagement));
    await fs.writeFile(path.join(todosDir, 'index.tsx'), generateTodoComponent(stateManagement));
    await fs.writeFile(path.join(todosDir, 'TodoComponent.module.css'), generateTodoCSSModule());
    console.log(chalk.green('State management setup complete!'));
}
// Initial setup function for the CLI command
export async function setupRedux(options) {
    let { middleware } = options;
    try {
        if (!middleware) {
            middleware = (await chooseStateManagement());
        }
        await installDependencies(middleware);
        await createStoreStructure(middleware);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (error) {
        if (error.message.includes('User force closed the prompt')) {
            console.log(chalk.yellow('Process interrupted. Exiting...'));
            process.exit(0);
        }
        else {
            console.error(chalk.red('An error occurred:'), error.message);
        }
    }
}
