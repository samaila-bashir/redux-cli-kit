import chalk from 'chalk';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';

// Check if TypeScript is configured by checking for tsconfig.json
export async function checkForTypeScript(): Promise<boolean> {
  return fs.pathExists(path.join(process.cwd(), 'tsconfig.json'));
}

// Ask the user to select a framework
export async function chooseFramework(): Promise<string> {
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

// Ask the user to choose between Saga or Thunk
export async function chooseMiddleware(): Promise<string> {
  const { middleware } = await inquirer.prompt([
    {
      type: 'list',
      name: 'middleware',
      message: 'Which middleware would you like to use?',
      choices: ['Redux Saga', 'Redux Thunk'],
    },
  ]);

  return middleware === 'Redux Saga' ? 'saga' : 'thunk';
}

// Check if the tool has been used before in this project
export async function checkForPreviousUsage(framework: string): Promise<void> {
  let checkFolder: string;

  if (framework === 'react') {
    checkFolder = path.join(process.cwd(), 'src/store');
  } else {
    // Check for other frameworks later
    checkFolder = '';
  }

  const exists = await fs.pathExists(checkFolder);
  if (exists) {
    console.error(
      chalk.red(
        `This project already has a Redux setup configured. Please use the 'generate' command to add slices and sagas.`
      )
    );
    process.exit(1);
  }
}
