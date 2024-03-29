/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			// https://uicolors.app/create
			colors: {}
		}
	}
};

module.exports = config;
