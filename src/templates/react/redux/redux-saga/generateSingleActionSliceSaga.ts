export function generateSingleActionSliceSaga(
  modelName: string,
  action: string
): string {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return `
      import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  
      interface ${modelNameCapitalized} {
        id: number;
        title: string;
        completed: boolean;
      }
  
      interface ${modelNameCapitalized}State {
        ${modelNameLowerCase}: ${modelNameCapitalized}[];
        loading: boolean;
        error: string | null;
      }
  
      const initialState: ${modelNameCapitalized}State = {
        ${modelNameLowerCase}: [],
        loading: false,
        error: null,
      };
  
      const ${modelNameLowerCase}Slice = createSlice({
        name: '${modelNameLowerCase}',
        initialState,
        reducers: {
          ${action}: (state) => {
            state.loading = true;
          },
          ${action}Success: (state, action: PayloadAction<${modelNameCapitalized}[]>) => {
            state.loading = false;
            state.${modelNameLowerCase} = action.payload;
          },
          ${action}Failure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
          },
        },
      });
  
      export const { ${action}, ${action}Success, ${action}Failure } = ${modelNameLowerCase}Slice.actions;
      export default ${modelNameLowerCase}Slice.reducer;
    `;
}
