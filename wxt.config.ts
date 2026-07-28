import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Waitplay',
    description: 'A Chrome extension for intentional AI-wait breaks.',
    action: {
      default_title: 'Waitplay',
    },
  },
  modules: ['@wxt-dev/module-react'],
});

