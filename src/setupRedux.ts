import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { generateTodoSlice } from "./templates/todoSliceTemplate.js";
import { generateTodoSaga } from "./templates/todoSagaTemplate.js";
import { generateStoreConfig } from "./templates/storeConfigTemplate.js";

interface SetupOptions {
  saga?: boolean;
  thunk?: boolean;
}

// Function to ask the user whether to use Redux Saga or Thunk
async function chooseMiddleware(): Promise<string> {
  const { middleware } = await inquirer.prompt([
    {
      type: "list",
      name: "middleware",
      message: "Which middleware would you like to use?",
      choices: ["Redux Thunk", "Redux Saga"],
    },
  ]);

  return middleware === "Redux Thunk" ? "thunk" : "saga";
}

// Function to install Redux and dependencies based on user choice
async function installDependencies(middleware: string): Promise<void> {
  const basePackages = ["redux", "@reduxjs/toolkit", "redux-persist"];
  const middlewarePackage =
    middleware === "thunk" ? "redux-thunk" : "redux-saga";

  console.log(
    chalk.green(
      `Installing Redux, Redux Toolkit, redux-persist, and ${middlewarePackage}...`
    )
  );
  await execa("npm", ["install", ...basePackages, middlewarePackage]);
}

// Function to create the Redux store structure and configuration files
async function createStoreStructure(middleware: string): Promise<void> {
  const srcDir = path.join(process.cwd(), "src/store");
  const slicesDir = path.join(srcDir, "slices/todos");
  const sagasDir = path.join(srcDir, "sagas/todos");

  // Ensure directories are created afresh
  await fs.ensureDir(slicesDir);
  await fs.ensureDir(sagasDir);

  // Create a sample slice and saga for a todo model
  await fs.writeFile(path.join(slicesDir, "index.ts"), generateTodoSlice());
  await fs.writeFile(
    path.join(sagasDir, "index.ts"),
    generateTodoSaga(middleware)
  );

  // Create the store configuration file
  await fs.writeFile(
    path.join(srcDir, "index.ts"),
    generateStoreConfig(middleware)
  );

  console.log(chalk.green("Redux store setup complete!"));
}

// Initial setup function for the CLI command
export async function setupRedux(options: SetupOptions): Promise<void> {
  const middleware = options.saga
    ? "saga"
    : options.thunk
    ? "thunk"
    : await chooseMiddleware();

  await installDependencies(middleware);
  await createStoreStructure(middleware);
}
