export function generateTodoSliceThunk(modelName) {
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const modelNameLowerCase = modelName.toLowerCase();
    return `
    import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
    import axios from 'axios';
    
    interface ${modelNameCapitalized} {
      id: number;
      title: string;
      completed: boolean;
    }
    
    interface ${modelNameCapitalized}sState {
      ${modelNameLowerCase}s: ${modelNameCapitalized}[];
      loading: boolean;
      error: string | null;
    }
    
    const initialState: ${modelNameCapitalized}sState = {
      ${modelNameLowerCase}s: [],
      loading: false,
      error: null,
    };
  
    const API_BASE_URL = 'https://jsonplaceholder.typicode.com/${modelNameLowerCase}s';
  
    // Thunks for API calls
    export const fetch${modelNameCapitalized}s = createAsyncThunk('${modelNameLowerCase}s/fetch${modelNameCapitalized}s', async () => {
      const response = await axios.get(\`\${API_BASE_URL}?_limit=5\`);
      return response.data;
    });
  
    export const add${modelNameCapitalized} = createAsyncThunk('${modelNameLowerCase}s/add${modelNameCapitalized}', async (new${modelNameCapitalized}: ${modelNameCapitalized}) => {
      const response = await axios.post(\`\${API_BASE_URL}\`, new${modelNameCapitalized});
      return response.data;
    });
  
    export const update${modelNameCapitalized} = createAsyncThunk('${modelNameLowerCase}s/update${modelNameCapitalized}', async (updated${modelNameCapitalized}: ${modelNameCapitalized}) => {
      const response = await axios.put(\`\${API_BASE_URL}/\${updated${modelNameCapitalized}.id}\`, updated${modelNameCapitalized});
      return response.data;
    });
  
    export const delete${modelNameCapitalized} = createAsyncThunk('${modelNameLowerCase}s/delete${modelNameCapitalized}', async (id: number) => {
      await axios.delete(\`\${API_BASE_URL}/\${id}\`);
      return id;
    });
  
    const ${modelNameLowerCase}sSlice = createSlice({
      name: '${modelNameLowerCase}s',
      initialState,
      reducers: {},
      extraReducers: (builder: ActionReducerMapBuilder<${modelNameCapitalized}State>) => {
        builder
          .addCase(fetch${modelNameCapitalized}s.pending, (state) => {
            state.loading = true;
          })
          .addCase(fetch${modelNameCapitalized}s.fulfilled, (state, action) => {
            state.loading = false;
            state.${modelNameLowerCase}s = action.payload;
          })
          .addCase(fetch${modelNameCapitalized}s.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch ${modelNameLowerCase}s';
          })
          .addCase(add${modelNameCapitalized}.fulfilled, (state, action) => {
            state.${modelNameLowerCase}s.push(action.payload);
          })
          .addCase(update${modelNameCapitalized}.fulfilled, (state, action) => {
            const index = state.${modelNameLowerCase}s.findIndex(${modelNameLowerCase} => ${modelNameLowerCase}.id === action.payload.id);
            if (index >= 0) {
              state.${modelNameLowerCase}s[index] = action.payload;
            }
          })
          .addCase(delete${modelNameCapitalized}.fulfilled, (state, action) => {
            state.${modelNameLowerCase}s = state.${modelNameLowerCase}s.filter(${modelNameLowerCase} => ${modelNameLowerCase}.id !== action.payload);
          });
      },
    });
  
    export default ${modelNameLowerCase}sSlice.reducer;
  `;
}
