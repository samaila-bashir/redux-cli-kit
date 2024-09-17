import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { SeckConfig } from '../types/index.js';
import { chooseFramework, chooseStateManagement } from './utils.js';
import { promptUserForDirectory } from './promptUserForDirectory.js';

/**
 * Writes the configuration to a JSON file.
 * @param {SeckConfig} config - The configuration object to write.
 */
export function writeConfigFile(config: SeckConfig) {
  const configPath = path.join(process.cwd(), 'seckconfig.json');

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green('Configuration saved to seckconfig.json.'));
  } catch (error) {
    console.error(chalk.red('Failed to write seckconfig file:', error));
  }
}

/**
 * Reads the configuration from the JSON file.
 * @returns {SeckConfig | null} The parsed configuration object, or null if the file doesn't exist or can't be read.
 */
export function readConfigFile(): SeckConfig | null {
  const configPath = path.join(process.cwd(), 'seckconfig.json');

  if (!fs.existsSync(configPath)) {
    console.log(chalk.yellow('No seckconfig file found.'));
    return null;
  }

  try {
    const config = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(config) as SeckConfig;
  } catch (error) {
    console.error(chalk.red('Failed to read seckconfig file:', error));
    return null;
  }
}

/**
 * Ensures a configuration exists, creating one if necessary.
 * @returns {Promise<SeckConfig>} A promise that resolves to the configuration object.
 */
export async function ensureConfig(): Promise<SeckConfig> {
  let config = readConfigFile();

  if (!config) {
    console.log(
      chalk.yellow("No configuration file found. Let's configure your project.")
    );

    const framework = await chooseFramework();
    const stateManagement = (await chooseStateManagement()) as
      | 'reduxSaga'
      | 'reduxThunk';
    const { specifiedDir } = await promptUserForDirectory();
    config = {
      framework,
      stateManagement,
      storeDir: specifiedDir,
    } as SeckConfig;
    writeConfigFile(config);

    console.log(chalk.green('Configuration file created.'));
  }

  return config as SeckConfig;
}
