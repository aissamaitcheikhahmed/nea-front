/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_API_SECRET?: string;
  /** Local dev: set to http://localhost:3000 while `vercel dev` runs — avoids Vite proxy dropping large uploads */
  readonly VITE_API_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
