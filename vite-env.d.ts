/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree form id — the part after /f/ in your endpoint. Optional. */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
