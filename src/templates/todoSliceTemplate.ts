export function generateTodoSlice(): string {
  return `
  import { createSlice, PayloadAction } from '@reduxjs/toolkit';
  
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
  
  const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
      fetchTodos: (state) => {
        state.loading = true;
      },
      fetchTodosSuccess: (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      },
      fetchTodosFailure: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      },
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
    },
  });
  
  export const { fetchTodos, fetchTodosSuccess, fetchTodosFailure, addTodo, updateTodo, deleteTodo } = todosSlice.actions;
  export default todosSlice.reducer;
    `;
}
