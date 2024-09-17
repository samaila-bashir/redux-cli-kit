export function generateSingleActionSliceThunk(modelName, action) {
    const modelNameLowerCase = modelName.toLowerCase();
    const modelNameCapitalized = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    return `
export const ${action} = createAsyncThunk(
  '${modelNameLowerCase}/${action}',
  async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  }
);

// Add to existing builder in extraReducers
builder
  .addCase(${action}.pending, (state: ${modelNameCapitalized}State) => {
    state.loading = true;
  })
  .addCase(${action}.fulfilled, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]>) => {
    state.loading = false;
    state.${modelNameLowerCase} = action.payload;
  })
  .addCase(${action}.rejected, (state: ${modelNameCapitalized}State, action: PayloadAction<${modelNameCapitalized}[]
  >) => {
    state.loading = false;
    state.error = action.error.message || 'Failed to ${action} ${modelNameLowerCase}s';
  });
`;
}
