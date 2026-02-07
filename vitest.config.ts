import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom', // enables fetch with relative URLs
    },
})