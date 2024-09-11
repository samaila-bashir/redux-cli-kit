export function generateTodoCSSModule(): string {
  return `
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f4f4f9;
    padding: 20px;
    border-radius: 8px;
  }
  
  .welcome {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .welcome h1 {
    color: #4caf50;
  }
  
  .welcome p {
    font-size: 18px;
    margin-top: 10px;
  }
  
  .welcome a {
    color: #007bff;
    text-decoration: none;
  }
  
  .welcome a:hover {
    text-decoration: underline;
  }
  
  h2 {
    margin-bottom: 10px;
  }
  
  .input {
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .button {
    padding: 10px 15px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .button:hover {
    background-color: #45a049;
  }
  
  .todoList {
    list-style-type: none;
    padding: 0;
    margin-top: 20px;
  }
  
  .todoItem {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    width: 100%;
    max-width: 600px;
  }
  
  .todoItem span {
    flex-grow: 1;
  }
  
  .todoItem button {
    margin-left: 10px;
  }
    `;
}
