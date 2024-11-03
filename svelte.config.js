import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ strict: false })
	},

	optimizeDeps: {
		include: ['mermaid'],
		exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript"],
	},

	ssr: false

};

export default config;
