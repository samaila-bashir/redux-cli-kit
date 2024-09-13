import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { generateTodoSlice } from './templates/todoSliceTemplate.js';
import { generateTodoSaga } from './templates/todoSagaTemplate.js';

// Function to generate a slice and optionally a saga based on user input
export async function generateSliceAndSaga(
  modelName: string,
  middleware: string
): Promise<void> {
  const sliceDir = path.join(
    process.cwd(),
    `src/store/slices/${modelName.toLowerCase()}`
  );

  // Create the slice directory
  await fs.ensureDir(sliceDir);

  // Write the slice file using the template
  await fs.writeFile(
    path.join(sliceDir, 'index.ts'),
    generateTodoSlice(middleware)
  );

  // Create the saga directory and file only if Saga is chosen
  if (middleware === 'reduxSaga') {
    const sagaDir = path.join(
      process.cwd(),
      `src/store/sagas/${modelName.toLowerCase()}`
    );
    await fs.ensureDir(sagaDir);
    await fs.writeFile(
      path.join(sagaDir, 'index.ts'),
      generateTodoSaga(middleware)
    );

    console.log(chalk.green(`${modelName} slice and saga have been created.`));
  } else {
    console.log(chalk.green(`${modelName} slice has been created.`));
  }
}
