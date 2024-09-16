import inquirer from 'inquirer';
/**
 * Prompts the user for the directory where files should be generated.
 *
 * @returns {Promise<{ specifiedDir: string }>} - The specified directory by the user.
 */
export async function promptUserForDirectory() {
    const { dir } = await inquirer.prompt([
        {
            type: 'input',
            name: 'dir',
            message: 'Enter the directory where you want to generate the files:',
            default: './src/store',
        },
    ]);
    return { specifiedDir: dir };
}
