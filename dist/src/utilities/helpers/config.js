import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
export function writeConfigFile(config) {
    const configPath = path.join(process.cwd(), 'seckconfig.json');
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log(chalk.green('Configuration saved to seckconfig.json.'));
    }
    catch (error) {
        console.error(chalk.red('Failed to write seckconfig file:', error));
    }
}
export function readConfigFile() {
    const configPath = path.join(process.cwd(), 'seckconfig.json');
    if (!fs.existsSync(configPath)) {
        console.log(chalk.yellow('No seckconfig file found.'));
        return null;
    }
    try {
        const config = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(config);
    }
    catch (error) {
        console.error(chalk.red('Failed to read seckconfig file:', error));
        return null;
    }
}
