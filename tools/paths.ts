import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const SNIPPETS = `${ROOT}snippets/`;
export const WEB = `${ROOT}web/`;
export const DIST = `${ROOT}dist/`;
