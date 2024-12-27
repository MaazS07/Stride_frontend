
interface ImportMetaEnv {
  VITE_BACKEND_URL: string
  VITE_EMAILJS_PUBLIC_KEY: string
  VITE_EMAILJS_SERVICE_KEY: string
  VITE_EMAILJS_TEMPLATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}