export function generateSagaActions() {
    return `
  export enum SAGA_ACTIONS {
    FETCH_TODOS = 'FETCH_TODOS',
    ADD_TODO = 'ADD_TODO',
    UPDATE_TODO = 'UPDATE_TODO',
    DELETE_TODO = 'DELETE_TODO',
    // Add more saga actions here as needed
  }
    `;
}
