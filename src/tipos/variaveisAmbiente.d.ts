// Tipagem das variáveis expostas pelo Vite (prefixo VITE_).
// Com strictImportMetaEnv, ler uma chave que não está declarada aqui vira erro de compilação.

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_NOME: string;
  readonly VITE_CARGO: string;
  readonly VITE_WHATSAPP?: string;
  readonly VITE_WHATSAPP_MENSAGEM?: string;
  readonly VITE_EMAIL?: string;
  readonly VITE_GITHUB?: string;
  readonly VITE_LINKEDIN?: string;
  readonly VITE_INSTAGRAM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
