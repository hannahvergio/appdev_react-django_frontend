import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/appdev_react-django_frontend",
  root: ".", 
  server: {
    open: "/index.html",
  },
});


