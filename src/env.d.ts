/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

interface ImportMetaEnv {
  readonly PUBLIC_DATABASE: string;
  readonly PUBLIC_BASE_URL: string;
  readonly PUBLIC_FRONTQL_local_host: string;
  readonly PUBLIC_FILE_UPLOAD_URL: string;
  readonly PUBLIC_IMAGE_URL: string;
  readonly PUBLIC_FILE_UPLOAD_ID: string;
  readonly PUBLIC_FILE_UPLOAD_PASS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}