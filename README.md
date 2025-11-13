# slocal-decor

CSC 307 final project

## Class Diagram

https://drive.google.com/file/d/1APZ2Zl_hfeeHJQMYh9hpgpd3iSv8Gs61/view?usp=sharing

## Access Control Diagram

https://drive.google.com/file/d/1yIBoLST5h3lNR25slULfy3L7wyctEjFv/view?usp=sharing

## Sprints

1. Sprint 1 : https://github.com/users/pihujha/projects/2
2. Sprint 2 : https://github.com/users/pihujha/projects/5

## Working UI

[Linked here](https://slocaldecor.my.canva.site/slocal-decor)

## Contributing

1. After getting your mongo uri add it to a .env file in the backend folder in the following format:

```
MONGO_URI = <connection string>
```

2. Linter:

We follow the [Airbnb React/JavaScript Style Guide](https://airbnb.io/javascript/react) using ESLint and Prettier.

### Code Style

- 2-space indentation
- Use double quotes
- Always include semicolons
- Run `npm run lint` before committing
- Use `npm run format` to auto-format code

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-react
   ```
2. Run these:
   ```
   npm run lint
   npm run format
   ```
