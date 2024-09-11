export function generateTodoComponent() {
    return `
    import { useEffect, useState } from 'react';
    import { useDispatch, useSelector, shallowEqual } from 'react-redux';
    import { SAGA_ACTIONS } from '../store/sagas/actions';
    import { RootState } from '../store';
    import styles from './TodoComponent.module.css';
  
    // A simple Todo component for displaying, adding, and updating todos
    const TodoComponent = () => {
      const dispatch = useDispatch();
      const { todos, loading, error } = useSelector(
      (state: RootState) => ({
        todos: state.todos.todos,
        loading: state.todos.loading,
        error: state.todos.error
      }),
      shallowEqual 
    );
      
      const [newTodo, setNewTodo] = useState('');
  
      // Fetch all todos on component mount
      useEffect(() => {
        dispatch({ type: SAGA_ACTIONS.FETCH_TODOS });
      }, [dispatch]);
  
      const handleAddTodo = () => {
        dispatch({
          type: SAGA_ACTIONS.ADD_TODO,
          payload: {
            id: Date.now(),
            title: newTodo,
            completed: false
          }
        });
        setNewTodo(''); 
      };
  
      const handleUpdateTodo = (id: number) => {
        dispatch({
          type: SAGA_ACTIONS.UPDATE_TODO,
          payload: {
            id,
            title: 'Updated Todo',
            completed: true
          }
        });
      };
  
      const handleDeleteTodo = (id: number) => {
        dispatch({ type: SAGA_ACTIONS.DELETE_TODO, payload: id });
      };
  
      return (
        <div className={styles.container}>
          <div className={styles.welcome}>
            <h1>Hurray!</h1>
            <p>
              You have successfully configured your Redux store using <strong>Redux CLI Kit</strong>.
              If you love this package, kindly give it a star on 
              <a href="https://github.com/your-repo-link" target="_blank" rel="noopener noreferrer"> GitHub</a>.
              We are open to new contributions. 
            </p>
            <p>Have fun!</p>
          </div>
  
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
          
          <ul className={styles.todoList}>
            {todos.map((todo: any) => (
              <li key={todo.id} className={styles.todoItem}>
                <span>{todo.title} - {todo.completed ? 'Completed' : 'Pending'}</span>
                <button onClick={() => handleUpdateTodo(todo.id)} className={styles.button}>Update</button>
                <button onClick={() => handleDeleteTodo(todo.id)} className={styles.button}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };
  
    export default TodoComponent;
    `;
}
