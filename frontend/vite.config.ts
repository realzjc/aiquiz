import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^@\/(.*)/,          // 正确处理 "@/xxx" 而不影响 "@radix-ui"
        replacement: path.resolve(__dirname, "src") + "/$1",
      },
      // "@": path.resolve(__dirname, "./src"),
    ],
  },
})
