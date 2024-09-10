import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { generateTodoSlice } from "./templates/todoSliceTemplate.js";
import { generateTodoSaga } from "./templates/todoSagaTemplate.js";

// Function to generate a slice and saga based on user input
export async function generateSliceAndSaga(modelName: string): Promise<void> {
  const sliceDir = path.join(
    process.cwd(),
    `src/store/slices/${modelName.toLowerCase()}`
  );
  const sagaDir = path.join(
    process.cwd(),
    `src/store/sagas/${modelName.toLowerCase()}`
  );

  // Create the directories for slice and saga
  await fs.ensureDir(sliceDir);
  await fs.ensureDir(sagaDir);

  // Write the slice and saga files using templates
  await fs.writeFile(path.join(sliceDir, "index.ts"), generateTodoSlice());
  await fs.writeFile(path.join(sagaDir, "index.ts"), generateTodoSaga("saga"));

  console.log(chalk.green(`${modelName} slice and saga have been created.`));
}
