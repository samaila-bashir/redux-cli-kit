export function generateSagaActions() {
    return `
  export enum TODO_SAGA_ACTIONS {
    FETCH_TODOS = 'FETCH_TODOS',
    ADD_TODO = 'ADD_TODO',
    UPDATE_TODO = 'UPDATE_TODO',
    DELETE_TODO = 'DELETE_TODO',
  }
    `;
}
