import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
    return {
        base: command === 'serve' ? "/wynnsmith/" : (mode === 'github'
            ? '/wynnsmith/'
            : '/gabriel/wynnsmith/'),
        build: {
            outDir: 'dist',
        }
    };
});