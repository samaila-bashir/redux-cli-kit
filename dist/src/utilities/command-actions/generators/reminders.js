import chalk from 'chalk';
/**
 * Displays reminders to the user based on the configuration.
 * @param {SeckConfig} config - The configuration object.
 */
export function displayReminders(config) {
    if (config.stateManagement === 'reduxSaga') {
        console.log(chalk.whiteBright('Reminder: Update your actions and watchers as necessary.'));
    }
}
