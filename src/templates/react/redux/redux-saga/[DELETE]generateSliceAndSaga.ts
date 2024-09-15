import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { generateModelSlice } from '../redux-slice/generateModelSlice.js';
import { generateSingleActionSaga } from './generateSingleActionSaga.js';

// Function to generate a slice and optionally a saga based on user input
export async function generateSliceAndSaga(
  modelName: string,
  middleware: string
): Promise<void> {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const sliceDir = path.join(
    process.cwd(),
    `src/store/slices/${modelNameLowerCase}`
  );
  const sagaDir = path.join(
    process.cwd(),
    `src/store/sagas/${modelNameLowerCase}`
  );

  // Create the slice directory
  await fs.ensureDir(sliceDir);

  // Write the slice file using the template (single function)
  await fs.writeFile(
    path.join(sliceDir, 'index.ts'),
    generateModelSlice(modelNameCapitalized)
  );

  // Create the saga directory and file only if Saga is chosen
  if (middleware === 'reduxSaga') {
    await fs.ensureDir(sagaDir);
    await fs.writeFile(
      path.join(sagaDir, 'index.ts'),
      generateSingleActionSaga(modelNameCapitalized)
    );

    console.log(chalk.green(`${modelName} slice and saga have been created.`));
  } else {
    console.log(chalk.green(`${modelName} slice has been created.`));
  }
}
