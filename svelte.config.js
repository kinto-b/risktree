import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			// to serve static files on GH pages
			base: '/risktree'
		}
	},

	optimizeDeps: {
		include: ['mermaid'],
		exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript"],
	},

};

export default config;
