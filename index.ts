#!/usr/bin/env node

import { program } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { setupRedux } from "./src/setupRedux.js";
import { generateSliceAndSaga } from "./src/generateSliceSaga.js";

// "init" command for Redux setup
program
  .command("init")
  .description("Set up Redux, slices, saga or thunk, and store configuration")
  .option("--saga", "Include Redux Saga in the setup")
  .option("--thunk", "Include Redux Thunk in the setup")
  .action(async (options: { saga: boolean; thunk: boolean }) => {
    await setupRedux(options);
  });

// "generate" command for creating slices and sagas
program
  .command("generate <model>")
  .description("Generate a new Redux slice and saga for a model")
  .action(async (model: string) => {
    await generateSliceAndSaga(model);
  });

// "reset" command for cleaning up the store directory
program
  .command("reset")
  .description("Clean up the existing store structure")
  .action(async () => {
    const srcDir = path.join(process.cwd(), "src/store");

    if (await fs.pathExists(srcDir)) {
      console.log(chalk.yellow("Cleaning up the store directory..."));
      await fs.remove(srcDir);
      console.log(chalk.green("Store directory has been cleaned up!"));
    } else {
      console.log(chalk.blue("No existing store directory to clean."));
    }
  });

program.parse(process.argv);
