import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
/**
 * List of packages to be uninstalled during the reset process.
 * @type {string[]}
 */
const packagesToUninstall = [
    'redux',
    '@reduxjs/toolkit',
    'redux-persist',
    'axios',
    'redux-thunk',
    'redux-saga',
    'react-redux',
];
/**
 * Resets the project by cleaning up directories, removing config file, and uninstalling packages.
 *
 * This function performs the following steps:
 * 1. Removes the store directory if it exists.
 * 2. Removes the todos directory if it exists.
 * 3. Removes the config file if it exists.
 * 4. Uninstalls specified node modules.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when all reset operations are complete.
 * @throws Will log errors to console if any step fails.
 */
export async function resetCommand() {
    const storeDir = path.join(process.cwd(), 'src/store');
    const todosDir = path.join(process.cwd(), 'src/components/Todo');
    const configFile = path.join(process.cwd(), './seckconfig.json');
    if (await fs.pathExists(storeDir)) {
        console.log(chalk.yellow('Cleaning up the store directory...'));
        await fs.remove(storeDir);
        console.log(chalk.green('Store directory has been cleaned up!'));
    }
    else {
        console.log(chalk.blue('No existing store directory to clean.'));
    }
    if (await fs.pathExists(todosDir)) {
        console.log(chalk.yellow('Cleaning up the todos directory...'));
        await fs.remove(todosDir);
        console.log(chalk.green('Todos directory has been cleaned up!'));
    }
    else {
        console.log(chalk.blue('No existing todos directory to clean.'));
    }
    if (await fs.pathExists(configFile)) {
        console.log(chalk.yellow('Removing config file...'));
        await fs.remove(configFile);
        console.log(chalk.green('Removed config file.'));
    }
    else {
        console.log(chalk.blue('No existing config file found.'));
    }
    console.log(chalk.yellow('Uninstalling installed node modules...'));
    try {
        await execa('npm', ['uninstall', ...packagesToUninstall]);
        console.log(chalk.green('Node modules uninstalled successfully!'));
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(chalk.red(`Error uninstalling node modules: ${error.message}`));
        }
        else {
            console.log(chalk.red('Unknown error during uninstallation.'));
        }
    }
}
