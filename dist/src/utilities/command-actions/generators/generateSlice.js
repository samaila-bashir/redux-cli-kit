import fs from 'fs-extra';
import chalk from 'chalk';
import { generateModelSliceSaga } from '../../../templates/react/redux/redux-saga/generateModelSliceSaga.js';
import { generateModelSliceThunk } from '../../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';
import { generateSingleActionSliceSaga } from '../../../templates/react/redux/redux-saga/generateSingleActionSliceSaga.js';
import { generateSingleActionSliceThunk } from '../../../templates/react/redux/redux-thunk/generateSingleActionSliceThunk.js';
import { addActionToSlice } from '../../actions/addActionToSlice.js';
import { addThunkActionToSlice } from '../../actions/addThunkActionToSlice.js';
import { generateSingleActionThunk } from '../../../templates/react/redux/redux-thunk/generateSingleActionThunk.js';
/**
 * Generates or updates a slice based on the given options.
 *
 * @param {Object} config - The configuration object.
 * @param {Object} options - The options for slice generation.
 * @param {string} modelName - The name of the model.
 * @param {boolean} sliceFileExists - Whether the slice file already exists.
 * @param {string} sliceDir - The directory for the slice file.
 * @param {string} sliceFilePath - The path to the slice file.
 * @returns {Promise<void>}
 */
export async function generateSlice(config, options, modelName, sliceFileExists, sliceDir, sliceFilePath) {
    if (!options.action) {
        await generateFullSlice(config, modelName, sliceFileExists, sliceDir, sliceFilePath);
    }
    else {
        await generateOrUpdateSliceWithAction(config, modelName, options.action, sliceFileExists, sliceDir, sliceFilePath);
    }
}
/**
 * Generates a full slice file for a given model if it doesn't already exist.
 *
 * @param {SliceConfig} config - Configuration object containing state management type.
 * @param {string} modelName - Name of the model for which to generate the slice.
 * @param {boolean} sliceFileExists - Indicates whether the slice file already exists.
 * @param {string} sliceDir - Directory path where the slice file should be created.
 * @param {string} sliceFilePath - Full file path for the slice file.
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue with file system operations.
 */
async function generateFullSlice(config, modelName, sliceFileExists, sliceDir, sliceFilePath) {
    if (!sliceFileExists) {
        await fs.ensureDir(sliceDir);
        const sliceContent = config.stateManagement === 'reduxSaga'
            ? generateModelSliceSaga(modelName)
            : generateModelSliceThunk(modelName);
        await fs.writeFile(sliceFilePath, sliceContent);
        console.log(chalk.green(`CRUD Slice for ${modelName} generated.`));
    }
    else {
        console.log(chalk.red(`Slice for ${modelName} already exists.`));
    }
}
/**
 * Generates a new slice file or updates an existing one with a new action.
 *
 * @param {SliceConfig} config - Configuration object containing state management type.
 * @param {string} modelName - Name of the model for which to generate or update the slice.
 * @param {string} action - Name of the action to add to the slice.
 * @param {boolean} sliceFileExists - Indicates whether the slice file already exists.
 * @param {string} sliceDir - Directory path where the slice file should be created or updated.
 * @param {string} sliceFilePath - Full file path for the slice file.
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue with file system operations.
 */
async function generateOrUpdateSliceWithAction(config, modelName, action, sliceFileExists, sliceDir, sliceFilePath) {
    if (sliceFileExists) {
        const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
        if (config.stateManagement === 'reduxSaga') {
            const updatedSliceCode = addActionToSlice(existingSliceCode, modelName, action);
            await fs.writeFile(sliceFilePath, updatedSliceCode);
        }
        else if (config.stateManagement === 'reduxThunk') {
            const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
            const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
            await fs.writeFile(sliceFilePath, updatedSliceCode);
        }
        console.log(chalk.green(`Action '${action}' added to slice '${modelName}'.`));
    }
    else {
        await fs.ensureDir(sliceDir);
        const sliceContent = config.stateManagement === 'reduxSaga'
            ? generateSingleActionSliceSaga(modelName, action)
            : generateSingleActionSliceThunk(modelName, action);
        await fs.writeFile(sliceFilePath, sliceContent);
        console.log(chalk.green(`Slice for ${modelName} with action '${action}' created.`));
    }
}
