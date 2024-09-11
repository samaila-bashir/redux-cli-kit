# Redux CLI Kit

Redux CLI Kit is a powerful and easy-to-use command-line tool that simplifies setting up a Redux store in your React projects. It supports both Redux Saga and Redux Thunk for handling side effects and provides a complete solution for configuring your Redux store quickly with the best practices in mind. This CLI kit is especially designed for React projects written in TypeScript.

## Features

- **Seamless Redux Setup**: Automatically configures Redux with `@reduxjs/toolkit`, `redux-persist`, and other required dependencies.
- **Saga or Thunk**: Gives you the choice to set up your Redux store with either `Redux Saga` or `Redux Thunk` for managing asynchronous logic.
- **Generates Redux Structure**: Automatically creates a `store` folder with slices, sagas, actions, and reducers, following a well-structured pattern.
- **Todo Component Example**: Provides a pre-configured, ready-to-use Todo component, complete with Redux actions and a basic UI to fetch, add, update, and delete todos.
- **Flexibility**: Easily customizable after initial setup to suit your specific project needs.
- **TypeScript Support**: Specifically designed for React projects built with TypeScript.
- **Cleaner Project Organization**: Automatically separates concerns with a clear folder structure for Redux slices, sagas, and actions.

## Commands

Redux CLI Kit comes with three primary commands to help you set up and manage your Redux store with ease.

### 1. `rck init`

The `init` command is the starting point of the setup process. This command allows you to configure your Redux store and choose between Redux Thunk and Redux Saga for handling asynchronous logic.

```bash
rck init
```

**Options**:

- `--saga`: Initializes your project with Redux Saga for managing side effects.
- `--thunk`: Initializes your project with Redux Thunk for asynchronous logic.

This command automatically installs the necessary dependencies (Redux, `@reduxjs/toolkit`, `redux-persist`, and either Redux Thunk or Saga) and sets up your Redux store with best practices.

Additionally, it generates:

- A Redux store configuration file.
- A sample slice and saga for a Todo model.
- A sample `TodoComponent` with a basic UI and Redux integration.
- A corresponding CSS Module for styling the component.

### 2. `rck generate <model>`

The `generate` command allows you to create additional Redux slices and sagas for new models, which helps in extending the store for new features or entities.

```bash
rck generate users
```

This command:

- Creates a new slice for the model in `src/store/slices`.
- Creates a new saga for the model in `src/store/sagas`.
- Adds the newly created saga to the root saga.
- Includes a sample CRUD configuration for the new model.

### 3. `rck reset`

The `reset` command cleans up the existing store structure and removes all installed node modules related to Redux (including Thunk or Saga).

```bash
rck reset
```

This command:

- Removes the `src/store` directory.
- Removes the `src/todos` directory that contains the sample Todo component.
- Uninstalls the related Redux packages from the project.

## Suitable for React Projects with TypeScript

Redux CLI Kit is built with TypeScript in mind. It generates TypeScript files and sets up type-safe Redux configurations. This ensures your Redux store benefits from strong typing and helps catch potential bugs during development.

### What's Included:

- **Redux Store**: The `store/index.ts` file provides a ready-to-use Redux store configuration.
- **Slices**: Automatically generated slices for state management.
- **Sagas or Thunks**: Depending on your choice, the CLI will generate a corresponding saga or thunk for asynchronous logic.
- **Sample Component**: A basic Todo app component that integrates with Redux and includes example CRUD functionality.

## Example Usage

**Initialize Redux Store with Saga**:

```bash
rck init --saga
```

**Initialize Redux Store with Thunk**:

```bash
rck init --thunk
```

**Generate a New Model (e.g., Users)**:

```bash
rck generate users
```

**Reset the Redux Store**:

```bash
rck reset
```

## Setting Up the Redux Provider

Once you have initialized redux-cli-kit and your Redux store is configured, you'll need to update your main entry point (`index.tsx` for Create React App or `main.tsx` for Vite) with the following configuration:

```tsx
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
```

This will set up the Redux Provider along with PersistGate to ensure state persistence across page reloads.

## Contributing

If you have any ideas or suggestions, feel free to open a pull request or raise an issue. Contributions are always welcome!
