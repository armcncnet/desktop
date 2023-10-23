import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
    server: {
        port: 6173
    },
    plugins: [
        vue(),
        monacoEditorPlugin()
    ],
    build: {
        sourcemap: false
    },
    optimizeDeps: {
        exclude: ["punycode"]
    },
})