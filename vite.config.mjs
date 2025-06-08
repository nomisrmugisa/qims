import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables - use VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      open: true,
      port: env.VITE_PORT || 3000, // Use env variable if available
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      'process.env': {}, // For compatibility with some libraries
      global: 'window'
    },
    resolve: {
      alias: {
        // Example alias:
        '@': path.resolve(__dirname, './src')
      }
    },
    base: env.VITE_APP_BASE_NAME || '/', // Fallback to root
    plugins: [react(), jsconfigPaths()],
    optimizeDeps: {
      include: ['@mui/material', '@mui/icons-material'] // Explicitly optimize these
    }
  };
});