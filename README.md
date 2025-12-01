# slocal-decor

CSC 307 final project

## Project Blurb

Slocal Decor is a community art and decor exchange built for the SLO/Cal Poly crowd. Users can sign up, post new pieces with photos and dimensions, browse the latest arrivals, save favorites, and reach out to owners to claim or transfer items. The app pairs a React + Vite frontend with a Node/Express + MongoDB backend, giving students a simple way to circulate decor instead of letting it collect dust.

## Class Diagram

[Find here](https://drive.google.com/file/d/1APZ2Zl_hfeeHJQMYh9hpgpd3iSv8Gs61/view?usp=sharing)

## Access Control Diagram

[Find here](https://drive.google.com/file/d/1yIBoLST5h3lNR25slULfy3L7wyctEjFv/view?usp=sharing)

## Sprints

1. Sprint 1
   - [Kanban Board](https://github.com/users/pihujha/projects/2)
   - [Presentation](https://docs.google.com/presentation/d/18lTTzYz0-P9m4Uj7qvVStkkwZPzBWfS8KKvMeLjEdFw/edit?usp=sharing)
2. Sprint 2
   - [Kanban Board](https://github.com/users/pihujha/projects/5)
   - [Presentation](https://www.canva.com/design/DAG4b47p1g8/N2UXPbpEnzFZXpmXhXPRsQ/view?utm_content=DAG4b47p1g8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h601c39c4cb)

## Working UI

[Linked here](https://slocaldecor.my.canva.site/slocal-decor)

## User T&C

[Terms & Conditions - SlocalDecor.pdf](https://github.com/user-attachments/files/23517947/Terms.Conditions.-.SlocalDecor.pdf)

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
