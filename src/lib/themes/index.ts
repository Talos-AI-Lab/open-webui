import './parchment.css';
import './glacier.css';
import './moss.css';
import './dusk.css';
import './contrast.css';

export type ThemeStyle = {
	id: string; // must match /^[a-z0-9-]+$/; 'default' is reserved for the classic look
	name: string; // English display name, passed through $i18n.t at render
};

export const THEME_STYLES: ThemeStyle[] = [
	{ id: 'default', name: 'Default' },
	{ id: 'parchment', name: 'Parchment' },
	{ id: 'glacier', name: 'Glacier' },
	{ id: 'moss', name: 'Moss' },
	{ id: 'dusk', name: 'Dusk' },
	{ id: 'contrast', name: 'High Contrast' }
];

export const getThemeStyleName = (id: string): string =>
	THEME_STYLES.find((themeStyle) => themeStyle.id === id)?.name ?? 'Default';
