# GEMINI Project Guide

This guide provides a comprehensive overview of the project, including its structure, technologies, and development conventions.

## Getting Started

To get the project up and running on your local machine, follow these steps:

**1. Prerequisites:**

*   Node.js (v20 or later recommended)
*   npm (or your preferred package manager)

**2. Clone the Repository:**

```bash
git clone <repository-url>
cd <project-directory>
```

**3. Install Dependencies:**

```bash
npm install
```

**4. Run the Development Server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It uses TypeScript for type safety and Tailwind CSS for styling. The project is a standard Next.js 16 application with the App Router.

## File Structure

The project follows the standard Next.js App Router directory structure:

*   **`/app`**: Contains the core application code, including pages, layouts, and components.
    *   **`layout.tsx`**: The root layout for the application.
    *   **`page.tsx`**: The main page of the application.
    *   **`globals.css`**: Global styles for the application.
*   **`/public`**: Contains static assets such as images and fonts.
*   **`next.config.ts`**: The configuration file for Next.js.
*   **`package.json`**: The project's dependencies and scripts.
*   **`tsconfig.json`**: The configuration file for TypeScript.
*   **`GEMINI.md`**: This file, which provides a guide to the project.

## Development Conventions

*   **Language:** TypeScript
*   **UI Framework:** React with Next.js
*   **Styling:** Tailwind CSS
*   **Linting:** ESLint with the `eslint-config-next` configuration.

## Available Scripts

The following scripts are available in the `package.json` file:

*   `npm run dev`: Runs the application in development mode.
*   `npm run build`: Creates a production-ready build of the application.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using ESLint.

## Dependencies

The project's dependencies are managed in the `package.json` file.

### Main Dependencies

*   **`next`**: The core framework for the application.
*   **`react`**: The JavaScript library for building user interfaces.
*   **`react-dom`**: The package for working with the DOM in React.

### Development Dependencies

*   **`@tailwindcss/postcss`**: The PostCSS plugin for Tailwind CSS.
*   **`@types/node`**, **`@types/react`**, **`@types/react-dom`**: TypeScript type definitions for Node.js, React, and React DOM.
*   **`eslint`**, **`eslint-config-next`**: The linter and its Next.js configuration.
*   **`tailwindcss`**: The utility-first CSS framework.
*   **`typescript`**: The language for the application.

## How to Contribute

We welcome contributions to this project! To contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes** and ensure that the code lints successfully.
4.  **Commit your changes** with a clear and concise commit message.
5.  **Push your changes** to your fork.
6.  **Create a pull request** to the main repository.

Please ensure that your code follows the development conventions outlined in this guide.
