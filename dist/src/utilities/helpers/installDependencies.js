import chalk from 'chalk';
import { execa } from 'execa';
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
export default installDependencies;
