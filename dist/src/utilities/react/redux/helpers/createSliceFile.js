import fs from 'fs-extra';
import path from 'path';
import { generateTodoSliceSaga } from '../../../../templates/react/redux/redux-saga/todoSliceSagaTemplate.js';
import { generateTodoSliceThunk } from '../../../../templates/react/redux/redux-thunk/todoSliceThunkTemplate.js';
/**
 * Creates the slice file based on the chosen state management.
 * @param stateManagement - The chosen state management ('reduxThunk' or 'reduxSaga').
 * @param modelDir - The directory path for the model.
 * @param modelNameCapitalized - The capitalized model name.
 */
export async function createSliceFile(stateManagement, modelDir, modelNameCapitalized) {
    const sliceContent = stateManagement === 'reduxThunk'
        ? generateTodoSliceThunk(modelNameCapitalized)
        : generateTodoSliceSaga(modelNameCapitalized);
    await fs.writeFile(path.join(modelDir, 'index.ts'), sliceContent);
}
