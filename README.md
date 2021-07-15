# EVme Admin Dashboard

## Development

### Getting started

First, install all NPM dependencies:

```sh
npm install
```

Then you can start developing by starting the application via `npm start`.

### Commands

| Command                  | Description                                                                             |
| :----------------------- | :-------------------------------------------------------------------------------------- |
| `npm start`              | Runs the app in the development mode on [http://localhost:3000](http://localhost:3000). |
| `MSW=true npm start`     | Run the app in offline mode which uses MSW to mock requests.                            |
| `npm run build`          | Compiles and bundles the project to `dist/`.                                            |
| `npm run lint`           | Runs linting on entire codebase and prints out results.                                 |
| `npm run test`           | Runs all component tests.                                                               |
| `npm run test:coverage`  | Runs all component tests with coverage.                                                 |
| `npm run generate:types` | Will generate all types for our EVme GraphQL API.                                       |
