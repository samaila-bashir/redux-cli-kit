import chalk from 'chalk';
import { checkForPreviousUsage, checkForTypeScript, chooseFramework, chooseStateManagement, } from '../helpers/utils.js';
import { setupRedux } from '../react/redux/setupRedux.js';
import { writeConfigFile } from '../helpers/config.js';
async function initCommand(options) {
    try {
        const isTypeScriptConfigured = await checkForTypeScript();
        if (!isTypeScriptConfigured) {
            console.log(chalk.yellow('This tool works best with frontend projects configured with TypeScript. Please add TypeScript to your project and try again.'));
            process.exit(1);
        }
        let stateManagement = '';
        let framework = '';
        // Handle options when --saga or --thunk is passed directly
        if (options.saga || options.thunk) {
            framework = 'react';
            stateManagement = options.saga ? 'reduxSaga' : 'reduxThunk';
            // Automatically check for previous usage for React since saga and thunk are for React with Redux
            await checkForPreviousUsage(framework);
            // Setup Redux store and write the configuration file
            await setupRedux({
                middleware: stateManagement,
            }, 'todo');
            writeConfigFile({ framework, stateManagement });
        }
        else {
            // Let user choose framework when no flag is passed
            framework = await chooseFramework();
            if (framework === 'react') {
                await checkForPreviousUsage(framework);
                // Let user choose state management tool if no flag was passed
                stateManagement = await chooseStateManagement();
                if (stateManagement === 'reduxSaga' ||
                    stateManagement === 'reduxThunk') {
                    const middleware = stateManagement === 'reduxSaga' ? 'reduxSaga' : 'reduxThunk';
                    // Setup Redux store and write the configuration file
                    await setupRedux({
                        middleware: middleware,
                    }, 'todo');
                    writeConfigFile({ framework, stateManagement });
                }
                else {
                    console.log(chalk.yellow('More state management options are coming soon. Please select Redux Saga or Redux Thunk for now.'));
                    process.exit(1);
                }
            }
            else {
                // If other frameworks are selected, exit as they are not yet implemented
                console.log(chalk.red('Other frameworks are coming soon. You can only choose React for now.'));
                process.exit(1);
            }
        }
    }
    catch (error) {
        // Error handling for user exiting prompt or other unexpected errors
        if (error instanceof Error &&
            error.message.includes('User force closed the prompt')) {
            console.log(chalk.yellow('Process interrupted by user. Exiting...'));
            process.exit(0);
        }
        else {
            console.error(chalk.red('An unexpected error occurred:'), error);
            process.exit(1);
        }
    }
}
export default initCommand;
