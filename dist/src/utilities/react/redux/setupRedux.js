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
// Dynamic generation function to use model name
async function createStoreStructure(stateManagement, modelName) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const srcDir = path.join(process.cwd(), 'src/store');
    const slicesDir = path.join(srcDir, 'slices');
    const modelDir = path.join(slicesDir, modelNameLowerCase);
    const componentsDir = path.join(srcDir, `../components/${modelNameCapitalized}/`);
    // Ensure directories exist
    await fs.ensureDir(modelDir);
    await fs.ensureDir(componentsDir);
    // Create the correct slice based on the state management choice
    if (stateManagement === 'reduxThunk') {
        await fs.writeFile(path.join(modelDir, 'index.ts'), generateTodoSliceThunk(modelNameCapitalized));
    }
    else if (stateManagement === 'reduxSaga') {
        await fs.writeFile(path.join(modelDir, 'index.ts'), generateTodoSliceSaga(modelNameCapitalized));
    }
    // Create sagas if Redux Saga is chosen
    if (stateManagement === 'reduxSaga') {
        const sagasDir = path.join(srcDir, 'sagas');
        const modelSagaDir = path.join(sagasDir, modelNameLowerCase);
        await fs.ensureDir(modelSagaDir);
        await fs.writeFile(path.join(modelSagaDir, 'index.ts'), generateTodoSaga(stateManagement));
        await fs.writeFile(path.join(sagasDir, 'index.ts'), generateRootSaga());
        const actionsDir = path.join(sagasDir, 'actions');
        await fs.ensureDir(actionsDir);
        await fs.writeFile(path.join(actionsDir, 'index.ts'), generateSagaActions());
    }
    // Generate root reducer and store config
    await fs.writeFile(path.join(slicesDir, 'index.ts'), generateRootReducer());
    await fs.writeFile(path.join(srcDir, 'index.ts'), generateStoreConfig(stateManagement));
    // Generate component and CSS based on the model name
    await fs.writeFile(path.join(componentsDir, 'index.tsx'), generateTodoComponent(modelNameCapitalized));
    await fs.writeFile(path.join(componentsDir, `${modelNameCapitalized}.module.css`), generateTodoCSSModule());
    console.log(chalk.green(`State management setup for ${modelName} complete!`));
}
// Initial setup function for the CLI command
export async function setupRedux(options, modelName) {
    let { middleware } = options;
    try {
        if (!middleware) {
            middleware = (await chooseStateManagement());
        }
        await installDependencies(middleware);
        await createStoreStructure(middleware, modelName);
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
