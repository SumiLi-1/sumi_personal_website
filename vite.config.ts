import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';
 
function withTrailingSlash(path: string | undefined) {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig({
  // GitHub Actions supplies this as either `/` (a user site) or `/repo-name/`
  // (a project site), so asset URLs work at both kinds of Pages address.
  base: withTrailingSlash(process.env.VITE_BASE_PATH),
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
