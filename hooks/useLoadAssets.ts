import { db } from 'db/client';
import { useMigrations as useDrizzleMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '../drizzle/migrations';

import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SplashScreen } from 'expo-router';

export default function useLoadAssets() {
	const [interLoaded, interError] = useFonts({
		Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
		InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf')
	});

	const { success: hasRunMigrations, error: runningMigrationError } = useDrizzleMigrations(
		db,
		migrations
	);

	useEffect(() => {
		if (interError) throw interError;
		if (runningMigrationError) throw runningMigrationError;
	}, [interError, runningMigrationError]);

	useEffect(() => {
		if (interLoaded && hasRunMigrations) {
			SplashScreen.hideAsync();
		}
	}, [interLoaded, hasRunMigrations]);

  return { isLoaded: interLoaded && hasRunMigrations }
}
