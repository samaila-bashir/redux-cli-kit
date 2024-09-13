#!/usr/bin/env node
import { program } from 'commander';
import { setupRedux } from './src/setupRedux.js';
import { generateSliceAndSaga } from './src/generateSliceSaga.js';
import { resetProject } from './src/utilities/helpers/resetProject.js';
import { checkForPreviousUsage, chooseFramework, checkForTypeScript, chooseMiddleware, } from './src/utilities/helpers/utils.js';
import chalk from 'chalk';
async function initCommand() {
    const isTypeScriptConfigured = await checkForTypeScript();
    if (!isTypeScriptConfigured) {
        console.log(chalk.red('This tool works better with projects configured with TypeScript. Please add TypeScript to your project and try again.'));
        process.exit(1);
    }
    const framework = await chooseFramework();
    if (framework === 'react') {
        await checkForPreviousUsage(framework);
        const middleware = (await chooseMiddleware());
        await setupRedux({ middleware });
    }
    else {
        console.log('Other frameworks are coming soon. You can only choose React for now.');
        process.exit(1);
    }
}
program
    .command('init')
    .description('Set up state management (e.g., Redux with Saga or Thunk) and other configurations for React')
    .action(async () => {
    await initCommand();
});
// Command for generating slices and sagas or thunks
program
    .command('generate <model>')
    .description('Generate a new Redux slice (and optionally saga if Saga is used) for a model')
    .option('--saga', 'Generate a saga for the model (if Saga is being used)')
    .option('--thunk', 'Generate a thunk for the model (if Thunk is being used)')
    .action(async (model, options) => {
    const middleware = options.saga
        ? 'saga'
        : options.thunk
            ? 'thunk'
            : 'saga'; // default to saga if not specified
    await generateSliceAndSaga(model, middleware);
});
// Command for resetting the project
program
    .command('reset')
    .description('Clean up the existing store structure and uninstall installed node modules')
    .action(async () => {
    await resetProject();
});
program.parse(process.argv);
