export function generateTodoSlice(middleware: string): string {
  return `
  import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  ${
    middleware === "thunk"
      ? "import { createAsyncThunk } from '@reduxjs/toolkit';\nimport axios from 'axios';"
      : ""
  }
  
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

  ${
    middleware === "thunk"
      ? `
  // Thunks for API calls when using Thunk middleware
  export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
    return response.data;
  });

  export const addTodo = createAsyncThunk('todos/addTodo', async (newTodo: Todo) => {
    const response = await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);
    return response.data;
  });

  export const updateTodo = createAsyncThunk('todos/updateTodo', async (updatedTodo: Todo) => {
    const response = await axios.put(\`https://jsonplaceholder.typicode.com/todos/\${updatedTodo.id}\`, updatedTodo);
    return response.data;
  });

  export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (id: number) => {
    await axios.delete(\`https://jsonplaceholder.typicode.com/todos/\${id}\`);
    return id;
  });
  `
      : ""
  }
  
  const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
      ${
        middleware === "thunk"
          ? ""
          : `fetchTodos: (state) => { state.loading = true; },`
      }
      ${
        middleware === "thunk"
          ? ""
          : `fetchTodosSuccess: (state, action: PayloadAction<Todo[]>) => { state.loading = false; state.todos = action.payload; },`
      }
      ${
        middleware === "thunk"
          ? ""
          : `fetchTodosFailure: (state, action: PayloadAction<string>) => { state.loading = false; state.error = action.payload; },`
      }
      ${
        middleware === "thunk"
          ? ""
          : `
      addTodo: (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      updateTodo: (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index >= 0) {
          state.todos[index] = action.payload;
        }
      },
      deleteTodo: (state, action: PayloadAction<number>) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      },
      `
      }
    },
    extraReducers: (builder) => {
      ${
        middleware === "thunk"
          ? `builder.addCase(fetchTodos.pending, (state) => { state.loading = true; })
        .addCase(fetchTodos.fulfilled, (state, action) => { state.loading = false; state.todos = action.payload; })
        .addCase(fetchTodos.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch todos'; })
        .addCase(addTodo.fulfilled, (state, action) => { state.todos.push(action.payload); })
        .addCase(updateTodo.fulfilled, (state, action) => {
          const index = state.todos.findIndex(todo => todo.id === action.payload.id);
          if (index >= 0) {
            state.todos[index] = action.payload;
          }
        })
        .addCase(deleteTodo.fulfilled, (state, action) => {
          state.todos = state.todos.filter(todo => todo.id !== action.payload);
        });`
          : ""
      }
    },
  });
  
  export const { ${
    middleware === "thunk"
      ? ""
      : "fetchTodos, fetchTodosSuccess, fetchTodosFailure, addTodo, updateTodo, deleteTodo"
  } } = todosSlice.actions;
  export default todosSlice.reducer;
  `;
}
