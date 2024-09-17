import path from 'path';
/**
 * Sets up directories and file paths for the generation process.
 * @param {Object} config - The configuration object.
 * @param {string} modelName - The name of the model.
 * @returns {Object} An object containing the necessary directories and file paths.
 */
export function setupDirectories(config, modelName) {
    const baseDir = config.storeDir || path.join(process.cwd(), 'src/store');
    const sliceDir = path.join(baseDir, `slices/${modelName.toLowerCase()}`);
    const sliceFilePath = path.join(sliceDir, 'index.ts');
    // Only set up saga directory if using Redux Saga
    let sagaDir = null;
    let sagaFilePath = null;
    if (config.stateManagement === 'reduxSaga') {
        sagaDir = path.join(baseDir, `sagas/${modelName.toLowerCase()}`);
        sagaFilePath = path.join(sagaDir, 'index.ts');
    }
    return { baseDir, sliceDir, sagaDir, sliceFilePath, sagaFilePath };
}
