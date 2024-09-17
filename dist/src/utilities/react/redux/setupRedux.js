import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { chooseStateManagement } from '../../helpers/utils.js';
import { generateTodoSaga } from '../../../templates/react/redux/redux-saga/todoSagaTemplate.js';
import { generateStoreConfig } from '../../../templates/react/redux/common/storeConfigTemplate.js';
import { generateRootReducer } from '../../../templates/react/redux/common/rootReducerTemplate.js';
import { generateRootSaga } from '../../../templates/react/redux/redux-saga/rootSagaTemplate.js';
import { generateSagaActions } from '../../../templates/react/redux/redux-saga/sagaActionsTemplate.js';
import { generateTodoComponent } from '../../../templates/react/redux/component/todoComponentTemplate.js';
import { generateTodoCSSModule } from '../../../templates/react/redux/component/todoComponentCSSTemplate.js';
import { generateTodoSliceThunk } from '../../../templates/react/redux/redux-thunk/todoSliceThunkTemplate.js';
import { generateTodoSliceSaga } from '../../../templates/react/redux/redux-saga/todoSliceSagaTemplate.js';
import installDependencies from '../../helpers/installDependencies.js';
/**
 * Creates the necessary directories for the store structure.
 * @param modelName - The name of the model.
 * @returns An object containing the created directory paths.
 */
async function createDirectories(modelName) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const srcDir = path.join(process.cwd(), 'src/store');
    const slicesDir = path.join(srcDir, 'slices');
    const modelDir = path.join(slicesDir, modelNameLowerCase);
    const componentsDir = path.join(srcDir, `../components/${modelNameCapitalized}/`);
    await fs.ensureDir(modelDir);
    await fs.ensureDir(componentsDir);
    return { srcDir, slicesDir, modelDir, componentsDir };
}
/**
 * Creates the slice file based on the chosen state management.
 * @param stateManagement - The chosen state management ('reduxThunk' or 'reduxSaga').
 * @param modelDir - The directory path for the model.
 * @param modelNameCapitalized - The capitalized model name.
 */
async function createSliceFile(stateManagement, modelDir, modelNameCapitalized) {
    const sliceContent = stateManagement === 'reduxThunk'
        ? generateTodoSliceThunk(modelNameCapitalized)
        : generateTodoSliceSaga(modelNameCapitalized);
    await fs.writeFile(path.join(modelDir, 'index.ts'), sliceContent);
}
/**
 * Sets up Redux Saga specific files and directories.
 * @param srcDir - The source directory path.
 * @param modelNameLowerCase - The lowercase model name.
 * @param stateManagement - The chosen state management.
 */
async function setupReduxSaga(srcDir, modelNameLowerCase, stateManagement) {
    const sagasDir = path.join(srcDir, 'sagas');
    const modelSagaDir = path.join(sagasDir, modelNameLowerCase);
    await fs.ensureDir(modelSagaDir);
    await fs.writeFile(path.join(modelSagaDir, 'index.ts'), generateTodoSaga(stateManagement));
    await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());
    const actionsDir = path.join(sagasDir, 'actions');
    await fs.ensureDir(actionsDir);
    await fs.writeFile(path.join(actionsDir, 'index.ts'), generateSagaActions());
}
/**
 * Creates the store structure based on the chosen state management and model name.
 * @param stateManagement - The chosen state management ('reduxThunk' or 'reduxSaga').
 * @param modelName - The name of the model.
 */
async function createStoreStructure(stateManagement, modelName) {
    const { srcDir, slicesDir, modelDir, componentsDir } = await createDirectories(modelName);
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    await createSliceFile(stateManagement, modelDir, modelNameCapitalized);
    if (stateManagement === 'reduxSaga') {
        await setupReduxSaga(srcDir, modelName.toLowerCase(), stateManagement);
    }
    await fs.writeFile(path.join(slicesDir, 'index.ts'), generateRootReducer());
    await fs.writeFile(path.join(srcDir, 'index.ts'), generateStoreConfig(stateManagement));
    await fs.writeFile(path.join(componentsDir, 'index.tsx'), generateTodoComponent(modelNameCapitalized));
    await fs.writeFile(path.join(componentsDir, `${modelNameCapitalized}.module.css`), generateTodoCSSModule());
    console.log(chalk.green(`State management setup for ${modelName} complete!`));
}
/**
 * Sets up Redux with the specified options and model name.
 * @param options - The setup options.
 * @param modelName - The name of the model.
 */
export async function setupRedux(options, modelName) {
    let { middleware } = options;
    try {
        if (!middleware) {
            middleware = (await chooseStateManagement());
        }
        await installDependencies(middleware);
        await createStoreStructure(middleware, modelName);
    }
    catch (error) {
        if (error instanceof Error &&
            error.message.includes('User force closed the prompt')) {
            console.log(chalk.yellow('Process interrupted. Exiting...'));
            process.exit(0);
        }
        else {
            console.error(chalk.red('An error occurred:'), error instanceof Error ? error.message : String(error));
        }
    }
}
