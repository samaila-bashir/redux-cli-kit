import chalk from 'chalk';
import { checkForTypeScript } from '../helpers/utils.js';
import { handleFrameworkInitialization } from '../frameworks/frameworkInitialization.js';
/**
 * Main function to handle the init command.
 * @param options - The command options.
 */
async function initCommand(options) {
    try {
        const isTypeScriptConfigured = await checkForTypeScript();
        if (!isTypeScriptConfigured) {
            console.log(chalk.yellow('This tool works best with frontend projects configured with TypeScript. Please add TypeScript to your project and try again.'));
            process.exit(1);
        }
        await handleFrameworkInitialization(options);
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
