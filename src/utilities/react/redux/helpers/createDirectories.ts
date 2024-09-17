import path from 'path';
import fs from 'fs-extra';

/**
 * Creates the necessary directories for the store structure.
 * @param modelName - The name of the model.
 * @returns An object containing the created directory paths.
 */
export async function createDirectories(modelName: string) {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  const srcDir = path.join(process.cwd(), 'src/store');
  const slicesDir = path.join(srcDir, 'slices');
  const modelDir = path.join(slicesDir, modelNameLowerCase);
  const componentsDir = path.join(
    srcDir,
    `../components/${modelNameCapitalized}/`
  );

  await fs.ensureDir(modelDir);
  await fs.ensureDir(componentsDir);

  return { srcDir, slicesDir, modelDir, componentsDir };
}
