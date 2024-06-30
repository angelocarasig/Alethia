import { config as configBase } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

export const config = createTamagui({
	...configBase,
	// Phone sizes
	phone: { maxWidth: 480 },
	gtPhone: { minWidth: 481 },

	// Tablet sizes
	tablet: { minWidth: 481, maxWidth: 1024 },
	gtTablet: { minWidth: 1025 },

	// Desktop sizes
	desktop: { minWidth: 1025 },
	gtDesktop: { minWidth: 1026 },
});

export default config;

export type Conf = typeof config;

declare module 'tamagui' {
	interface TamaguiCustomConfig extends Conf {}
}
