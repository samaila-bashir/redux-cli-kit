import chalk from 'chalk';
import { SeckConfig } from '../../types/index.js';

/**
 * Displays reminders to the user based on the configuration.
 * @param {SeckConfig} config - The configuration object.
 */
export function displayReminders(config: SeckConfig): void {
  if (config.stateManagement === 'reduxSaga') {
    console.log(
      chalk.whiteBright(
        'Reminder: Update your actions and watchers as necessary.'
      )
    );
  }
}
