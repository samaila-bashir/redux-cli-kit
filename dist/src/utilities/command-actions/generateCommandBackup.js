import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { readConfigFile, writeConfigFile } from '../helpers/config.js';
import { generateModelSagaCRUD } from '../../templates/react/redux/redux-saga/generateModelSagaCRUD.js';
import { generateModelSliceThunk } from '../../templates/react/redux/redux-thunk/generateModelSliceThunk.js';
import { generateModelSliceSaga } from '../../templates/react/redux/redux-saga/generateModelSliceSaga.js';
import { generateSingleActionSliceSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSliceSaga.js';
import { generateSingleActionSaga } from '../../templates/react/redux/redux-saga/generateSingleActionSaga.js';
import { generateSingleActionThunk } from '../../templates/react/redux/redux-thunk/generateSingleActionThunk.js';
import { chooseFramework, chooseStateManagement } from '../helpers/utils.js';
import { generateSingleActionSliceThunk } from '../../templates/react/redux/redux-thunk/generateSingleActionSliceThunk.js';
import { addThunkActionToSlice } from '../actions/addThunkActionToSlice.js';
import { addActionToSaga } from '../actions/addActionToSaga.js';
import { addActionToSlice } from '../actions/addActionToSlice.js';
import { promptUserForDirectory } from '../helpers/promptUserForDirectory.js';
/**
 * Generates Redux slice, saga, or thunk based on user input.
 *
 * @param {string} modelName - The name of the model for which the slice/saga/thunk will be generated.
 * @param {Object} options - Options for the generation process.
 * @param {boolean} [options.slice] - Indicates if a slice should be generated.
 * @param {boolean} [options.saga] - Indicates if a saga should be generated.
 * @param {boolean} [options.thunk] - Indicates if a thunk should be generated.
 * @param {string} [options.action] - Specific action to be generated within the slice or saga.
 *
 * @returns {Promise<void>} - Resolves when the command generation is complete.
 */
export async function generateCommand(modelName, options) {
    let config = readConfigFile();
    let baseDir;
    if (!config) {
        console.log(chalk.yellow("No configuration file found. Let's configure your project."));
        // Prompt the user for framework, state management, and store directory
        const framework = await chooseFramework();
        const stateManagement = await chooseStateManagement();
        const { specifiedDir } = await promptUserForDirectory();
        baseDir = specifiedDir;
        config = { framework, stateManagement, storeDir: baseDir };
        writeConfigFile(config);
        console.log(chalk.green('Configuration file created.'));
    }
    else {
        baseDir = config.storeDir || path.join(process.cwd(), 'src/store');
    }
    const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
    const sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);
    const sliceFilePath = path.join(sliceDir, 'index.ts');
    const sagaFilePath = path.join(sagaDir, 'index.ts');
    const stateManagement = config.stateManagement;
    const action = options.action;
    // Determine customSlicePath based on the user's directory selection or fallback to default
    const customSlicePath = path.relative(sagaDir, sliceDir);
    const sliceFileExists = await fs.pathExists(sliceFilePath);
    // Generate full CRUD or individual actions based on options
    if (!options.slice && !options.saga && !options.thunk) {
        // Full CRUD generation
        if (!sliceFileExists) {
            // Model does not exist, create it
            await fs.ensureDir(sliceDir);
            await fs.ensureDir(sagaDir);
            if (stateManagement === 'reduxSaga') {
                await fs.writeFile(sliceFilePath, generateModelSliceSaga(modelName));
                await fs.writeFile(sagaFilePath, generateModelSagaCRUD(modelName, customSlicePath));
                console.log(chalk.green(`Full CRUD Slice and Saga for ${modelName} generated.`));
            }
            else if (stateManagement === 'reduxThunk') {
                await fs.writeFile(sliceFilePath, generateModelSliceThunk(modelName));
                console.log(chalk.green(`Full CRUD Slice and Thunk for ${modelName} generated.`));
            }
        }
        else {
            console.log(chalk.red(`Model ${modelName} already exists.`));
        }
    }
    else {
        // Individual file generation
        if (options.slice && !options.action) {
            if (!sliceFileExists) {
                // Create new slice
                await fs.ensureDir(sliceDir);
                const sliceContent = stateManagement === 'reduxSaga'
                    ? generateModelSliceSaga(modelName)
                    : generateModelSliceThunk(modelName);
                await fs.writeFile(sliceFilePath, sliceContent);
                console.log(chalk.green(`CRUD Slice for ${modelName} generated.`));
            }
            else {
                console.log(chalk.red(`Slice for ${modelName} already exists.`));
            }
        }
        if (options.slice && options.action) {
            if (!action) {
                console.error(chalk.red('Action name is required.'));
                return;
            }
            if (sliceFileExists) {
                // Add action to existing slice
                const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
                if (stateManagement === 'reduxSaga') {
                    const updatedSliceCode = addActionToSlice(existingSliceCode, modelName, action);
                    await fs.writeFile(sliceFilePath, updatedSliceCode);
                }
                else if (stateManagement === 'reduxThunk') {
                    const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
                    const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
                    await fs.writeFile(sliceFilePath, updatedSliceCode);
                }
                console.log(chalk.green(`Action '${action}' added to slice '${modelName}'.`));
            }
            else {
                // Create new slice with the action only
                await fs.ensureDir(sliceDir);
                if (stateManagement === 'reduxSaga') {
                    const sliceContent = generateSingleActionSliceSaga(modelName, action);
                    await fs.writeFile(sliceFilePath, sliceContent);
                    console.log(chalk.green(`Slice for ${modelName} with action '${action}' created.`));
                }
                else if (stateManagement === 'reduxThunk') {
                    const sliceContent = generateSingleActionSliceThunk(modelName, action);
                    await fs.writeFile(sliceFilePath, sliceContent);
                    console.log(chalk.green(`Slice for ${modelName} with action '${action}' created.`));
                }
            }
        }
        if (options.saga && options.action) {
            if (!action) {
                console.error(chalk.red('Action name is required.'));
                return;
            }
            if (stateManagement === 'reduxSaga') {
                if (await fs.pathExists(sagaFilePath)) {
                    // Add action to existing saga
                    const existingSagaCode = await fs.readFile(sagaFilePath, 'utf8');
                    const updatedSagaCode = addActionToSaga(existingSagaCode, modelName, action);
                    await fs.writeFile(sagaFilePath, updatedSagaCode);
                    console.log(chalk.green(`Action '${action}' added to saga '${modelName}'.`));
                }
                else {
                    // Create new saga with the action
                    await fs.ensureDir(sagaDir);
                    const sagaContent = generateSingleActionSaga(modelName, action);
                    await fs.writeFile(sagaFilePath, sagaContent);
                    console.log(chalk.green(`Saga for ${modelName} with action '${action}' created.`));
                }
            }
            else {
                console.log(chalk.red('Sagas are not used with redux-thunk.'));
            }
        }
        if (options.saga && !options.action) {
            if (stateManagement === 'reduxSaga') {
                if (await fs.pathExists(sagaFilePath)) {
                    console.log(chalk.red(`Saga for ${modelName} already exists.`));
                }
                else {
                    await fs.ensureDir(sagaDir);
                    const sagaContent = generateModelSagaCRUD(modelName, customSlicePath);
                    await fs.writeFile(sagaFilePath, sagaContent);
                    console.log(chalk.green(`Saga for ${modelName} generated.`));
                }
            }
            else {
                console.log(chalk.red('Sagas are not used with redux-thunk.'));
            }
        }
        if (options.thunk && options.action) {
            if (!action) {
                console.error(chalk.red('Action name is required.'));
                return;
            }
            if (stateManagement === 'reduxThunk') {
                if (sliceFileExists) {
                    // Add thunk action to existing slice
                    const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
                    const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
                    const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
                    await fs.writeFile(sliceFilePath, updatedSliceCode);
                    console.log(chalk.green(`Thunk action '${action}' added to slice '${modelName}'.`));
                }
                else {
                    // Create new slice with the thunk action
                    await fs.ensureDir(sliceDir);
                    const fullSliceCode = generateModelSliceThunk(modelName);
                    await fs.writeFile(sliceFilePath, fullSliceCode);
                    console.log(chalk.green(`Slice for ${modelName} created.`));
                    // Then add the action
                    const existingSliceCode = await fs.readFile(sliceFilePath, 'utf8');
                    const { newThunkCode, newExtraReducersCode } = generateSingleActionThunk(modelName, action);
                    const updatedSliceCode = addThunkActionToSlice(existingSliceCode, newThunkCode, newExtraReducersCode);
                    await fs.writeFile(sliceFilePath, updatedSliceCode);
                    console.log(chalk.green(`Thunk action '${action}' added to slice '${modelName}'.`));
                }
            }
            else {
                console.log(chalk.red('Thunks are not used with redux-saga.'));
            }
        }
    }
    if (config) {
        // Notify user to update actions and watchers (if applicable)
        console.log(chalk.whiteBright('Reminder: Update your actions and watchers as necessary.'));
    }
}
