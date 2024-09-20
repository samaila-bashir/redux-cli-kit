import fs from 'fs-extra';
import chalk from 'chalk';
import { generateSingleActionThunk } from '../../../templates/react/redux/redux-thunk/generateSingleActionThunk.js';
import { generateModelSliceThunk } from '../../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';
import { addThunkActionToSlice } from '../../actions/addThunkActionToSlice.js';
/**
 * Generates or updates a thunk based on the given options.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} options - The options for thunk generation.
 * @param {string} modelName - The name of the model.
 * @param {boolean} sliceFileExists - Whether the slice file already exists.
 * @param {string} sliceDir - The directory for the slice file.
 * @param {string} sliceFilePath - The path to the slice file.
 * @returns {Promise<void>}
 */
export async function generateThunk(config, options, modelName, sliceFileExists, sliceDir, sliceFilePath) {
    if (config.stateManagement !== 'reduxThunk') {
        console.log(chalk.red('Thunks are not used with redux-saga.'));
        return;
    }
    if (options.action) {
        await generateOrUpdateThunkWithAction(modelName, options.action, sliceFileExists, sliceDir, sliceFilePath);
    }
}
/**
 * Generates or updates a thunk action in a Redux slice file.
 *
 * @param {string} modelName - The name of the model for which the slice is being created or updated.
 * @param {string} action - The name of the thunk action to be added.
 * @param {boolean} sliceFileExists - Indicates whether the slice file already exists.
 * @param {string} sliceDir - The directory path where the slice file should be located.
 * @param {string} sliceFilePath - The full file path of the slice file.
 * @returns {Promise<void>}
 *
 * @description
 * If the slice file exists, this function reads the existing code, generates new thunk code,
 * and updates the file with the new action. If the slice file doesn't exist, it creates a new
 * slice file with the model and adds the specified thunk action to it.
 */
async function generateOrUpdateThunkWithAction(modelName, action, sliceFileExists, sliceDir, sliceFilePath) {
    if (sliceFileExists) {
        const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
        const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
        const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
        await fs.writeFile(sliceFilePath, updatedSliceCode);
        console.log(chalk.green(`Thunk action '${action}' added to slice '${modelName}'.`));
    }
    else {
        await fs.ensureDir(sliceDir);
        const fullSliceCode = generateModelSliceThunk(modelName);
        await fs.writeFile(sliceFilePath, fullSliceCode);
        console.log(chalk.green(`Slice for ${modelName} created.`));
        const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
        const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
        const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
        await fs.writeFile(sliceFilePath, updatedSliceCode);
        console.log(chalk.green(`Thunk action '${action}' added to slice '${modelName}'.`));
    }
}
