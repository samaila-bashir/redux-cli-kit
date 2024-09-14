import chalk from 'chalk';
import { checkForPreviousUsage, checkForTypeScript, chooseFramework, chooseStateManagement, } from '../helpers/utils.js';
import { setupRedux } from '../react/redux/setupRedux.js';
async function initCommand(options) {
    try {
        const isTypeScriptConfigured = await checkForTypeScript();
        if (!isTypeScriptConfigured) {
            console.log(chalk.yellow('This tool works best with frontend projects configured with TypeScript. Please add TypeScript to your project and try again.'));
            process.exit(1);
        }
        let stateManagement = '';
        let framework = 'react'; // Default to 'react' when saga or thunk is passed
        if (options.saga || options.thunk) {
            stateManagement = options.saga ? 'reduxSaga' : 'reduxThunk';
            // Automatically check for previous usage for React since saga and thunk are for React with Redux
            await checkForPreviousUsage(framework);
        }
        else {
            framework = await chooseFramework();
            if (framework === 'react') {
                await checkForPreviousUsage(framework);
                stateManagement = await chooseStateManagement();
            }
            else {
                console.log(chalk.red('Other frameworks are coming soon. You can only choose React for now.'));
                process.exit(1);
            }
        }
        if (stateManagement === 'reduxSaga' || stateManagement === 'reduxThunk') {
            const middleware = stateManagement === 'reduxSaga' ? 'reduxSaga' : 'reduxThunk';
            await setupRedux({
                middleware: middleware,
            });
        }
        else {
            console.log(chalk.yellow('More state management options are coming soon. Please select Redux Saga or Redux Thunk for now.'));
            process.exit(1);
        }
    }
    catch (error) {
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
