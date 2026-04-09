# Express TypeScript Server: Analysis & Setup Guide

This document provides a detailed analysis of the current project structure and a step-by-step guide to recreating this "bare metal" server setup.

## Project Analysis

### 1. Technology Stack
- **Framework**: [Express 5.x](https://expressjs.com/en/5x/api.html) (Next generation of Express).
- **Language**: TypeScript with ESM (ECMAScript Modules) support.
- **Development Runtime**: [tsx](https://github.com/privatenumber/tsx) (Direct execution of TS without manual transpilation).
- **Build System**: Clean `tsc` compilation to a `dist/` directory.

### 2. File Structure
```text
.
├── src/
│   └── main.ts         # Application entry point
├── dist/               # Compiled JavaScript (generated on build)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── node_modules/       # Project dependencies
```

### 3. Key Configurations
- **ESM Support**: The `package.json` includes `"type": "module"`, allowing the use of top-level `import/export` statements.
- **Modern Build**: `tsconfig.json` targets `esnext` and uses `moduleResolution: "bundler"`, which is optimized for modern Node.js environments.
- **Fast Dev Loops**: Uses `tsx watch` for automatic restarts on file changes without the overhead of `nodemon` + `ts-node`.

---

## Step-by-Step Recreation Guide

Follow these steps to recreate this setup from scratch.

### Step 1: Initialize the Project
Create a new directory and initialize npm.
```bash
mkdir express-ts-server
cd express-ts-server
npm init -y
```

### Step 2: Set as ESM (Critical)
Open `package.json` and add the `"type": "module"` field. This ensures Node treats `.ts`/`.js` files as ES modules.
```json
{
  "name": "express-ts-server",
  "version": "1.0.0",
  "type": "module",
  ...
}
```

### Step 3: Install Dependencies
Install Express 5 and the necessary TypeScript type definitions.
```bash
# Production dependencies
npm install express

# Development dependencies
npm install -D typescript @types/express @types/node tsx
```

### Step 4: Configure TypeScript
You can generate a `tsconfig.json` using the CLI or create it manually for a cleaner setup.

#### Option A: CLI (Automatic)
Run the following command to generate a pre-configured file with the necessary flags:
```bash
npx tsc --init --rootDir src --outDir dist --module esnext --target esnext --moduleResolution bundler --moduleDetection force --strict true --skipLibCheck true --isolatedModules true --noUncheckedIndexedAccess true --exactOptionalPropertyTypes true --noUncheckedSideEffectImports true
```

#### Option B: Manual (Minimalist)
Create a `tsconfig.json` file in the root directory:
```bash
touch tsconfig.json
```
Populate it with this concise configuration:
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedSideEffectImports": true
  }
}
```

### Step 5: Define Scripts
Update the `scripts` section in `package.json` to include development, build, and production start commands.
```json
"scripts": {
  "dev": "tsx watch src/main.ts",
  "build": "tsc",
  "start": "node dist/main.js"
}
```

### Step 6: Create the Source Code
Create the `src` directory and the main entry point.
```bash
mkdir src
touch src/main.ts
```
Add the boilerplate code to `src/main.ts`:
```typescript
import express, { Request, Response } from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Hello World!",
    status: 200,
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

## Usage Commands

- **Development Mode**: `npm run dev` (Hot reloading enabled).
- **Build for Production**: `npm run build` (Generated files in `dist/`).
- **Production Start**: `npm run start` (Run compiled code).
