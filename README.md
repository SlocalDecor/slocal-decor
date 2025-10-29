# slocal-decor

CSC 307 final project

## Working UI

[Linked here](https://slocaldecor.my.canva.site/slocal-decor)

## Contributing

We follow the [Airbnb React/JavaScript Style Guide](https://airbnb.io/javascript/react) using ESLint and Prettier.

After getting your mongo uri add it to a .env file in the backend folder in the following format:

```
MONGO_URI = <connection string>
```

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
