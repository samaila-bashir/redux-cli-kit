import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
/**
 * Checks if the project is configured with TypeScript by looking for tsconfig.json.
 * @returns {Promise<boolean>} A promise that resolves to true if tsconfig.json exists, false otherwise.
 */
export async function checkForTypeScript() {
    return fs.pathExists(path.join(process.cwd(), 'tsconfig.json'));
}
/**
 * Prompts the user to choose a framework or library.
 * @returns {Promise<string>} A promise that resolves to the chosen framework's value.
 */
export async function chooseFramework() {
    const { framework } = await inquirer.prompt([
        {
            type: 'list',
            name: 'framework',
            message: 'Which Library or Framework are you using?',
            choices: [
                { name: 'React JS', value: 'react', disabled: false },
                { name: 'Angular JS (Coming Soon)', value: 'angular', disabled: true },
                { name: 'Vue JS (Coming Soon)', value: 'vue', disabled: true },
                { name: 'Svelte (Coming Soon)', value: 'svelte', disabled: true },
            ],
        },
    ]);
    return framework;
}
/**
 * Prompts the user to choose a state management setup.
 * @returns {Promise<string>} A promise that resolves to the chosen state management's value.
 */
export async function chooseStateManagement() {
    const { stateManagement } = await inquirer.prompt([
        {
            type: 'list',
            name: 'stateManagement',
            message: 'Which state management setup would you like to configure?',
            choices: [
                { name: 'Redux with Redux Saga', value: 'reduxSaga', disabled: false },
                {
                    name: 'Redux with Redux Thunk',
                    value: 'reduxThunk',
                    disabled: false,
                },
                {
                    name: 'React Query (Coming Soon)',
                    value: 'reactQuery',
                    disabled: true,
                },
                { name: 'Zustand (Coming Soon)', value: 'zustand', disabled: true },
                { name: 'Jotai (Coming Soon)', value: 'jotai', disabled: true },
            ],
        },
    ]);
    return stateManagement;
}
/**
 * Checks if the tool has been used before in this project.
 * @param {string} framework - The chosen framework.
 * @returns {Promise<void>} A promise that resolves if the tool hasn't been used before, or exits the process if it has.
 */
export async function checkForPreviousUsage(framework) {
    const checkPaths = {
        react: './src/store', // For Redux or similar state management in React
        // Future check paths for other frameworks can go here
    };
    const pathToCheck = checkPaths[framework];
    const storeExists = await fs.pathExists(pathToCheck);
    if (storeExists) {
        console.log(chalk.yellow('It looks like this tool has already been used in this project. Exiting to avoid conflicts.'));
        process.exit(1);
    }
}
/**
 * Checks if a file exists at the given path.
 * @param {string} filePath - The path to the file to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the file exists, false otherwise.
 */
export async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
