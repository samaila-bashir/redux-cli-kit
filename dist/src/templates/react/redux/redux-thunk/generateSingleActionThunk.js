export function generateSingleActionThunk(modelName, action) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const actionCapitalized = action.charAt(0).toUpperCase() + action.slice(1);
    const apiBaseUrl = `https://jsonplaceholder.typicode.com/${modelNameLowerCase}s`;
    // Generate new thunk code
    const newThunkCode = `
  const API_BASE_URL = '${apiBaseUrl}';
  
  export const ${actionCapitalized}${modelNameCapitalized} = createAsyncThunk(
    '${modelNameLowerCase}/${action}',
    async () => {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    }
  );
  `;
    // Generate new extraReducers code
    const newExtraReducersCode = `
  builder
    .addCase(${actionCapitalized}${modelNameCapitalized}.pending, (state) => {
      state.loading = true;
    })
    .addCase(${actionCapitalized}${modelNameCapitalized}.fulfilled, (state, action) => {
      state.loading = false;
      state.${modelNameLowerCase} = action.payload;
    })
    .addCase(${actionCapitalized}${modelNameCapitalized}.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to ${action} ${modelNameLowerCase}s';
    });
  `;
    return { newThunkCode, newExtraReducersCode };
}
