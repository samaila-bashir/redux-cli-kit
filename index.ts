#!/usr/bin/env node

import { program } from "commander";
import { setupRedux } from "./src/setupRedux.js";
import { generateSliceAndSaga } from "./src/generateSliceSaga.js";
import { resetProject } from "./src/utilities/helpers/resetProject.js";

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

// "reset" command for cleaning up the store directory and uninstalling node modules
program
  .command("reset")
  .description(
    "Clean up the existing store structure and uninstall installed node modules"
  )
  .action(async () => {
    await resetProject();
  });

program.parse(process.argv);
