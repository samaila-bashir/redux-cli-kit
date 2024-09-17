/**
 * Generates a string containing the definition of SAGA_ACTIONS enum.
 * This enum includes action types for common CRUD operations on todos.
 *
 * @returns {string} A string representation of the SAGA_ACTIONS enum.
 */
export function generateSagaActions(): string {
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
