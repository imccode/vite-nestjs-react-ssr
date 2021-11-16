import { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

export const viteConfig: UserConfig = {
  root: process.cwd(),
  plugins: [react()],
}

export default viteConfig
