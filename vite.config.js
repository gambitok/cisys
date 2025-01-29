import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
    server: {
        host: '127.0.0.1', // Використовуйте '127.0.0.1' для локальної розробки
        port: 5173, // Додайте порт, якщо потрібно
    },
    plugins: [
        topLevelAwait({
            // The export name of top-level await promise for each chunk module
            promiseExportName: "__tla",
            // The function to generate import names of top-level await promise in each chunk module
            promiseImportName: i => `__tla_${i}`
        }),
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
});



