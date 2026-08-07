// Shared theme application logic.
//
// Two independent axes are applied to <html>:
// - mode: system/light/dark/oled-dark/her → `.light`/`.dark` (+ inline gray pins for OLED)
// - style: a theme from $lib/themes → `.theme-<id>`
//
// The inline script in src/app.html duplicates a minimal version of this for the
// first paint (it cannot import modules); keep the two in sync.

declare global {
	interface Window {
		applyTheme?: () => void;
	}
}

const THEME_MODE_CLASSES = ['dark', 'light', 'oled-dark'];

const OLED_PINNED_GRAYS = {
	'--color-gray-800': '#101010',
	'--color-gray-850': '#050505',
	'--color-gray-900': '#000000',
	'--color-gray-950': '#000000',
	'--color-black': '#000000'
};

export const applyThemeMode = (mode: string) => {
	let modeToApply = mode === 'oled-dark' ? 'dark' : mode === 'her' ? 'light' : mode;

	if (mode === 'system') {
		modeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	if (!mode.includes('oled')) {
		// Clear the OLED inline pins; inline styles would otherwise override the
		// gray values from tailwind.css and any class-scoped theme style.
		Object.keys(OLED_PINNED_GRAYS).forEach((property) => {
			document.documentElement.style.removeProperty(property);
		});
	}

	THEME_MODE_CLASSES.filter((className) => className !== modeToApply).forEach((className) => {
		document.documentElement.classList.remove(className);
	});

	document.documentElement.classList.add(modeToApply);

	const metaThemeColor = document.querySelector('meta[name="theme-color"]');
	if (metaThemeColor) {
		if (mode.includes('system')) {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
			metaThemeColor.setAttribute('content', systemTheme === 'light' ? '#ffffff' : '#171717');
		} else {
			metaThemeColor.setAttribute(
				'content',
				mode === 'dark'
					? '#171717'
					: mode === 'oled-dark'
						? '#000000'
						: mode === 'her'
							? '#983724'
							: '#ffffff'
			);
		}
	}

	// Hook for custom loader.js overrides (see /static/loader.js)
	if (typeof window !== 'undefined' && window.applyTheme) {
		window.applyTheme();
	}

	if (mode.includes('oled')) {
		Object.entries(OLED_PINNED_GRAYS).forEach(([property, value]) => {
			document.documentElement.style.setProperty(property, value);
		});
		document.documentElement.classList.add('dark');
	}
};

export const getEffectiveThemeStyle = (): string => {
	if (typeof localStorage === 'undefined') {
		return '';
	}
	return localStorage.getItem('themeStyle') ?? localStorage.getItem('instanceThemeStyle') ?? '';
};

// Per-user custom CSS from $settings.customCss; only ever applied to the
// author's own session (unlike the admin CSS served at /static/custom.css).
export const applyUserCustomCss = (css: string) => {
	let styleElement = document.getElementById('user-custom-css');
	if (!styleElement) {
		styleElement = document.createElement('style');
		styleElement.id = 'user-custom-css';
		document.head.appendChild(styleElement);
	}
	styleElement.textContent = css ?? '';
};

export const applyThemeStyle = (id: string) => {
	const root = document.documentElement;

	Array.from(root.classList)
		.filter((className) => className.startsWith('theme-'))
		.forEach((className) => root.classList.remove(className));

	// The regex guard prevents arbitrary class injection (id may come from localStorage)
	if (id && id !== 'default' && /^[a-z0-9-]+$/.test(id)) {
		root.classList.add(`theme-${id}`);
	}
};
