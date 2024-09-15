import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
// List of installed packages to uninstall
const installedPackages = [
    'redux',
    '@reduxjs/toolkit',
    'redux-persist',
    'axios',
    'redux-thunk',
    'redux-saga',
    'react-redux',
];
// Function to clean up the store and todos directories and uninstall packages
export async function resetProject() {
    const storeDir = path.join(process.cwd(), 'src/store');
    const todosDir = path.join(process.cwd(), 'src/components/Todos');
    const configFile = path.join(process.cwd(), './seckconfig.json');
    // Step 1: Remove the store directory
    if (await fs.pathExists(storeDir)) {
        console.log(chalk.yellow('Cleaning up the store directory...'));
        await fs.remove(storeDir);
        console.log(chalk.green('Store directory has been cleaned up!'));
    }
    else {
        console.log(chalk.blue('No existing store directory to clean.'));
    }
    // Step 2: Remove the todos directory
    if (await fs.pathExists(todosDir)) {
        console.log(chalk.yellow('Cleaning up the todos directory...'));
        await fs.remove(todosDir);
        console.log(chalk.green('Todos directory has been cleaned up!'));
    }
    else {
        console.log(chalk.blue('No existing todos directory to clean.'));
    }
    // Step 3: Remove config file
    if (await fs.pathExists(configFile)) {
        console.log(chalk.yellow('Removing config file...'));
        await fs.remove(configFile);
        console.log(chalk.green('Removed config file.'));
    }
    else {
        console.log(chalk.blue('No existing config file found.'));
    }
    // Step 4: Uninstall node modules
    console.log(chalk.yellow('Uninstalling installed node modules...'));
    try {
        await execa('npm', ['uninstall', ...installedPackages]);
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
