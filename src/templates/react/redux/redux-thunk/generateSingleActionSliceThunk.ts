export function generateSingleActionSliceThunk(
  modelName: string,
  action: string
): string {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

  return `
      import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
      import axios from 'axios';
  
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
  
      const API_BASE_URL = 'https://jsonplaceholder.typicode.com/${modelNameLowerCase}s';
  
      export const ${action} = createAsyncThunk(
        '${modelNameLowerCase}/${action}',
        async () => {
          const response = await axios.get(API_BASE_URL);
          return response.data;
        }
      );
  
      const ${modelNameLowerCase}Slice = createSlice({
        name: '${modelNameLowerCase}',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
          builder
            .addCase(${action}.pending, (state) => {
              state.loading = true;
            })
            .addCase(${action}.fulfilled, (statestate: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
              state.loading = false;
              state.${modelNameLowerCase} = action.payload;
            })
            .addCase(${action}.rejected, (statestate: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
              state.loading = false;
              state.error = action.error.message || 'Failed to ${action} ${modelNameLowerCase}s';
            });
        },
      });
  
      export default ${modelNameLowerCase}Slice.reducer;
    `;
}
