# React + Vite

## OctoFit API configuration

In Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` with the Codespace name (without a port suffix):

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

The frontend builds API URLs as `https://<codespace-name>-8000.app.github.dev/api/<resource>/`. Restart the Vite server after changing `.env.local`. If the variable is unset, requests safely fall back to `http://localhost:8000` for local development.

Users and Workouts accept a plain array response or a paginated response with an array in `results`, `data`, `items`, or `docs`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
