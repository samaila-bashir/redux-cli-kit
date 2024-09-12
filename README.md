# StateEngine CLI Kit

StateEngine CLI Kit is a powerful and easy-to-use command-line tool that simplifies setting up your choice of state management library in any frontend framework or library, such as React (e.g. Redux `[Saga or Thunk]`, React Query, Zustand), Vue (Penia or Vuex), Angular (NgRx and Akita), Svelte, and others. This CLI kit is especially designed for any frontend project configured with TypeScript.

> The vision behind this project is to build a powerful, frontend-agnostic state configuration engine that enables frontend engineers to follow best practices inspired by professional frontend engineers in the industry, enabling easy configuration of state management in any frontend library or framework of your choice in the least possible time, reducing repetitive tasks.
>
> — [Samaila Chatto Bashir](https://samailabashir.com)

🔴 _Note: This documentation is focused on state management setup on React projects configured with TypeScript, and the state management tool currently available is Redux with the option to use `Redux Saga` or `Redux Thunk`. We will be updating the status table below on the state management options added to the project._

#### [View Project Status Table](#stateengine-cli-kit-framework-and-library-support)

## Features

- **Seamless choice of state management library Setup**: Automatically configures your choice of state management library e.g. Redux with `@reduxjs/toolkit`, `redux-persist`, and other required dependencies for React projects.
- **Saga or Thunk**: Gives you the choice to set up your Redux store with either `Redux Saga` or `Redux Thunk` for managing asynchronous logic.
- **Generates Redux Structure**: Automatically creates a `store` folder with slices, sagas, actions, and reducers, following a well-structured pattern for React projects configured with Redux.
- **Todo Component Example**: Provides a pre-configured, ready-to-use Todo component, complete with your choice of state management library and a basic UI to fetch, add, update, and delete todos.
- **Flexibility**: Easily customizable after initial setup to suit your specific project needs.
- **TypeScript Support**: Specifically designed for any frontend framework, such as React, Vue, Angular, Svelte, and others built with TypeScript.
- **Cleaner Project Organization**: Automatically separates concerns with a clear folder structure for your choice of state management library.

## Commands

StateEngine CLI Kit comes with three primary commands to help you set up and manage your your choice of state management library with ease.

### 1. `sec init`

The `init` command is the starting point of the setup process. This command allows you to configure your your choice of library or framework and the state management library you prefer.

```bash
sec init
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

### 2. `sec generate <model>`

The `generate` command allows you to create additional Redux slices and sagas for new models, which helps in extending the store for new features or entities.

```bash
sec generate users
```

This command:

- Creates a new slice for the model in `src/store/slices`.
- Creates a new saga for the model in `src/store/sagas`.
- Adds the newly created saga to the root saga.
- Includes a sample CRUD configuration for the new model.

### 3. `sec reset`

The `reset` command cleans up the existing store structure and removes all installed node modules related to Redux (including Thunk or Saga).

```bash
sec reset
```

This command:

- Removes the `src/store` directory.
- Removes the `src/todos` directory that contains the sample Todo component.
- Uninstalls the related Redux packages from the project.

## Suitable for Frontend Projects with TypeScript

StateEngine CLI Kit is built with TypeScript in mind. It generates TypeScript files and sets up type-safe configurations. This ensures your your choice of state management library store benefits from strong typing and helps catch potential bugs during development.

### What's Included:

- **Redux Store**: The `store/index.ts` file provides a ready-to-use Redux store configuration.
- **Slices**: Automatically generated slices for state management.
- **Sagas or Thunks**: Depending on your choice, the CLI will generate a corresponding saga or thunk for asynchronous logic.
- **Sample Component**: A basic Todo app component that integrates with Redux and includes example CRUD functionality.

## Example Usage

**Initialize Redux Store with Saga**:

```bash
sec init --saga
```

**Initialize Redux Store with Thunk**:

```bash
sec init --thunk
```

**Generate a New Model (e.g., Users)**:

```bash
sec generate users
```

**Reset the Redux Store**:

```bash
sec reset
```

## Setting Up the Redux Provider

Once you have initialized state-engine-cli-kit and your Redux store is configured, you'll need to update your main entry point (`index.tsx` for Create React App or `main.tsx` for Vite) with the following configuration:

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

# StateEngine CLI Kit: Framework and Library Support

### React JS

| State Management Library | Supported |
| ------------------------ | --------- |
| Redux with Redux Saga    | ✔         |
| Redux with Redux Thunk   | ✔         |
| React Query              | ⏳        |
| Zustand                  | ✘         |
| Jotai                    | ✘         |

---

### Angular JS

| State Management Library | Supported |
| ------------------------ | --------- |
| NgRx                     | ✘         |
| Akita                    | ✘         |
| NGXS                     | ✘         |

---

## Vue JS

| State Management Library | Supported |
| ------------------------ | --------- |
| Vuex                     | ✘         |
| Pinia                    | ✘         |

---

## Svelte

| State Management Library | Supported |
| ------------------------ | --------- |
| Svelte Store             | ✘         |
| Zustand                  | ✘         |
| Jotai                    | ✘         |

## Contributions

If you have any ideas or suggestions, feel free to open a pull request or raise an issue. Contributions are always welcome!

[⬆️ Go to Top](#stateengine-cli-kit)
