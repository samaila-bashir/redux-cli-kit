export function generateTodoSliceThunk(): string {
  return `
      import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
      import axios from 'axios';
      
      interface Todo {
        id: number;
        title: string;
        completed: boolean;
      }
      
      interface TodosState {
        todos: Todo[];
        loading: boolean;
        error: string | null;
      }
      
      const initialState: TodosState = {
        todos: [],
        loading: false,
        error: null,
      };
  
      const API_BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
  
      // Thunks for API calls
      export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
        const response = await axios.get(\`\${API_BASE_URL}?_limit=5\`);
        return response.data;
      });
    
      export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo: Todo) => {
        const response = await axios.post(\`\${API_BASE_URL}\`, newTodo);
        return response.data;
      });
    
      export const updateTodo = createAsyncThunk('todos/updateTodo', async (updatedTodo: Todo) => {
        const response = await axios.put(\`\${API_BASE_URL}/\${updatedTodo.id}\`, updatedTodo);
        return response.data;
      });
    
      export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
        await axios.delete(\`\${API_BASE_URL}/\${id}\`);
        return id;
      });
    
      const todosSlice = createSlice({
        name: 'todos',
        initialState,
        reducers: {},
        extraReducers: (builder) => {
          builder
            .addCase(fetchTodos.pending, (state) => {
              state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
              state.loading = false;
              state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message || 'Failed to fetch todos';
            })
            .addCase(addTodo.fulfilled, (state, action) => {
              state.todos.push(action.payload);
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
              const index = state.todos.findIndex(todo => todo.id === action.payload.id);
              if (index >= 0) {
                state.todos[index] = action.payload;
              }
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
              state.todos = state.todos.filter(todo => todo.id !== action.payload);
            });
        },
      });
    
      export default todosSlice.reducer;
      `;
}
