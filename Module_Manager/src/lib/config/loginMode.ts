/**
 * Single-use / single-tenant fork: email + password only (no Google, demo visitor, etc.).
 *
 * Enabled when:
 * - Vite mode `single-use` (.env.single-use), or
 * - PUBLIC_SIMPLE_LOGIN=true
 *
 * @see docs/single-tenant-fork/README.md
 */

import { getPublicEnv, isPublicFlagTrue } from './publicEnv';

export function isSimpleLoginOnly(): boolean {
	// Keep checks separate — bundlers can mis-compile `typeof import.meta !== 'undefined' && …`.
	const mode = import.meta.env?.MODE;
	if (mode === 'single-use' || mode === 'demo') return true;
	return isPublicFlagTrue('PUBLIC_SIMPLE_LOGIN');
}

export function isSingleUseForkBuild(): boolean {
	return isSimpleLoginOnly();
}

/** Product title on the minimal login screen */
export function getSingleUseLoginTitle(): string {
	const custom = getPublicEnv('PUBLIC_SINGLE_USE_APP_TITLE');
	if (custom != null && String(custom).trim() !== '') return String(custom).trim();
	const org = getPublicEnv('PUBLIC_SINGLE_TENANT_DISPLAY_NAME');
	if (org != null && String(org).trim() !== '') return String(org).trim();
	return 'WISPTools';
}
