# Launching the App

1. Move to the `metromaps` directory, i.e. `cd metromaps`
2. Do `npm install`
3. Start the application with `npm start`

# Prettier Setup

1. Install [`Prettier - Code formatter`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) on VSCode.

   - Launch VS Code Quick Open (`Ctrl + P` on Windows or `Cmd + P` on macOS)
   - Run `ext install esbenp.prettier-vscode`

2. Open `Preferences > Settings` (`Ctrl + ,` on Windows or `Cmd + ,` on macOS)

   - Search for `editor.defaultFormatter` and set it to `Prettier - Code Formatter` or `"esbenp.prettier-vscode"`
   - Search for `editor.formatOnSave` and tick the box or set it to `true`
   - Search for `prettier.requireConfig` and tick the box or set it to `true` to use project-specific Prettier configuration (`.prettierrc` file)
