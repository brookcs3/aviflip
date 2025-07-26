# AVIFlip

**AVIFlip** is an experimental template for creating privacy‑first image converters. It provides a React interface and an optional Express wrapper so all image processing happens locally in the browser. The project began as a quick utility for converting AVIF and JPG files and grew into a reusable starting point for similar tools (for example *WebPFlip* and *JPGFlip*).

## Goals
- Run entirely in the browser – no uploaded images
- Offer a simple drag‑and‑drop interface for batch conversion
- Provide a basic Node/Express setup for local development or self‑hosting

## Running the Demo
```bash
npm install
npm run dev
```
This starts an Express server with Vite in middleware mode on [http://localhost:5000](http://localhost:5000). The client code lives in `client/` and the server entry point is `server/index.ts`.

For a production build:
```bash
npm run build
npm start
```
Assets are emitted to `dist/public`.

## Repository Layout
- `client/` – React UI, web worker, and conversion logic
- `server/` – minimal Express wrapper used during development
- `shared/` – small shared types used by the server and client
- `docs/` – architecture notes including a simple Mermaid diagram

Several folders like `webp-flip` or `jpgflip-full` show earlier experiments and variants built from this template.

## Highlight – Conversion Web Worker
The most interesting piece is the `conversion.worker.ts` file which processes files off the main thread. It reads dropped images, converts them in parallel, and posts progress updates back to React. When multiple files are processed it bundles them into a ZIP file before sending them back.

```ts
self.onmessage = async (event) => {
  const { files, type } = event.data;
  // ... convert files, generate ZIP when needed
  self.postMessage({ status: 'success', result: zipBlob });
};
```

See the full implementation in `client/src/workers/conversion.worker.ts`.

## Next Steps
This repository contains several subprojects and prototype scripts. The core `client/` and `server/` directories are runnable, but additional cleanup is required if you intend to publish this as a package. Explore the template script in `create-project-from-template.sh` for generating new converters with different default settings.
