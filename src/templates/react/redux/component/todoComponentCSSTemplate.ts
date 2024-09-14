export function generateTodoCSSModule(): string {
  return `
  html, body {
    height: 100%;
    margin: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #f4f4f9;
    min-height: 100vh; 
    padding: 20px;
    box-sizing: border-box;
  }
  
  .welcome {
    text-align: center;
    margin-bottom: 20px;
    width: 45%;
    line-height: 1.7;
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

  .form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    min-height: 150px; 
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

  .footer {
    margin-top: 20px;
    font-size: 14px;
    align-self: flex-end; 
  }

  .footer a {
    margin-left: 10px;
    color: #007bff;
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }
    `;
}
