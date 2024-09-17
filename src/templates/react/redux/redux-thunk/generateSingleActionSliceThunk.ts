/**
 * Generates a Redux Toolkit thunk action and corresponding reducer cases for a single action.
 *
 * @param {string} modelName - The name of the model (e.g., 'user', 'product').
 * @param {string} action - The name of the action (e.g., 'fetchAll', 'create').
 * @returns {string} A string containing the generated thunk action and reducer cases.
 *
 * @example
 * const result = generateSingleActionSliceThunk('user', 'fetchAll');
 */
export function generateSingleActionSliceThunk(
  modelName: string,
  action: string
): string {
  const modelNameLowerCase = modelName.toLowerCase();
  const modelNameCapitalized =
    modelName.charAt(0).toUpperCase() + modelName.slice(1);

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
