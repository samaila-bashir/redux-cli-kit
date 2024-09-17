import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { createDirectories } from './createDirectories.js';
import { createSliceFile } from './createSliceFile.js';
import { setupReduxSaga } from './setupReduxSaga.js';
import { generateRootReducer } from '../../../../templates/react/redux/common/rootReducerTemplate.js';
import { generateStoreConfig } from '../../../../templates/react/redux/common/storeConfigTemplate.js';
import { generateTodoComponent } from '../../../../templates/react/redux/component/todoComponentTemplate.js';
import { generateTodoCSSModule } from '../../../../templates/react/redux/component/todoComponentCSSTemplate.js';
/**
 * Creates the store structure based on the chosen state management and model name.
 * @param stateManagement - The chosen state management ('reduxThunk' or 'reduxSaga').
 * @param modelName - The name of the model.
 */
export async function createStoreStructure(stateManagement, modelName) {
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
