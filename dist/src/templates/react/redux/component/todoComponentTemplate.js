export function generateTodoComponent(middleware) {
    return `
  import { useEffect, useState } from 'react';
  import { useDispatch, useSelector, shallowEqual } from 'react-redux';
  import styles from './Todo.module.css';
  import { RootState, AppDispatch } from '../../store';
  ${middleware === 'reduxThunk'
        ? "import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../store/slices/todos';"
        : "import { SAGA_ACTIONS } from '../../store/sagas/actions';"}

  const TodoComponent = () => {
    const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type
    const { todos, loading, error } = useSelector(
      (state: RootState) => ({
        todos: state.todos.todos,
        loading: state.todos.loading,
        error: state.todos.error
      }),
      shallowEqual 
    );
    
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
      ${middleware === 'reduxThunk'
        ? 'dispatch(fetchTodos());'
        : 'dispatch({ type: SAGA_ACTIONS.FETCH_TODOS });'}
    }, [dispatch]);
  
    const handleAddTodo = () => {
      ${middleware === 'reduxThunk'
        ? `dispatch(addTodo({
            id: Date.now(),
            title: newTodo,
            completed: false,
          }));`
        : `dispatch({
            type: SAGA_ACTIONS.ADD_TODO,
            payload: {
              id: Date.now(),
              title: newTodo,
              completed: false,
            },
          });`}
      setNewTodo(''); 
    };

    const handleUpdateTodo = (id: number) => {
      ${middleware === 'reduxThunk'
        ? `dispatch(updateTodo({
            id,
            title: 'Updated Todo',
            completed: true,
          }));`
        : `dispatch({
            type: SAGA_ACTIONS.UPDATE_TODO,
            payload: {
              id,
              title: 'Updated Todo',
              completed: true,
            },
          });`}
    };

    const handleDeleteTodo = (id: number) => {
      ${middleware === 'reduxThunk'
        ? `dispatch(deleteTodo(id));`
        : `dispatch({ type: SAGA_ACTIONS.DELETE_TODO, payload: id });`}
    };

    return (
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h1>Hurray! 🥳🎉</h1>
          <p>
            You have successfully configured your project with Redux and ${middleware === 'reduxThunk' ? 'Redux Thunk' : 'Redux Saga'} using <strong>StateEngine CLI Kit</strong>. If you love this package, kindly give it a star on 
            <a href="https://github.com/samaila-bashir/state-engine-cli-kit" target="_blank" rel="noopener noreferrer"> GitHub</a>.
          </p>
          <p>We are open to new contributions 🤗.</p>
        </div>

        <div className={styles.form}>
        <h2>Todo List</h2>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}

        <input 
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className={styles.input}
        />
        <button onClick={handleAddTodo} className={styles.button}>Add Todo</button>
        </div>
        
        <ul className={styles.todoList}>
          {todos.map((todo: any) => (
            <li key={todo.id} className={styles.todoItem}>
              <span>{todo.title} - {todo.completed ? 'Completed' : 'Pending'}</span>
              <button onClick={() => handleUpdateTodo(todo.id)} className={styles.button}>Update</button>
              <button onClick={() => handleDeleteTodo(todo.id)} className={styles.button}>Delete</button>
            </li>
          ))}
        </ul>

        <footer className={styles.footer}>
          Powered by <a href="https://samailabashir.com/" target="_blank" rel="noopener noreferrer">Samaila Chatto Bashir</a> | 
          <a href="https://www.linkedin.com/in/samaila-bashir/" target="_blank" rel="noopener noreferrer"> LinkedIn</a> | 
          <a href="https://sbtechshare.com" target="_blank" rel="noopener noreferrer"> Blog</a> | 
          <a href="https://github.com/samaila-bashir" target="_blank" rel="noopener noreferrer"> GitHub</a> | 
          <a href="https://x.com/sbtechshare" target="_blank" rel="noopener noreferrer"> X</a>
        </footer>
      </div>
    );
  };

  export default TodoComponent;
  `;
}
