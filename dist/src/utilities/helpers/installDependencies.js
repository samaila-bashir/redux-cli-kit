import chalk from 'chalk';
import { execa } from 'execa';
/**
 * Installs Redux-related dependencies based on the chosen state management option.
 *
 * @param {string} stateManagement - The chosen state management option ('reduxSaga' or 'reduxThunk').
 * @returns {Promise<void>} A promise that resolves when the installation is complete.
 * @throws Will throw an error if the npm installation fails.
 */
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
export default installDependencies;
