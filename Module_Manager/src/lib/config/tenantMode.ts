/**
 * Single-tenant vs multitenant deployment mode.
 *
 * Default: multitenant behavior (tenant list, selector, setup flows).
 * Set PUBLIC_SINGLE_TENANT_MODE=true and PUBLIC_SINGLE_TENANT_ID to pin one organization.
 *
 * Uses import.meta.env (see publicEnv.ts) so flags work in static CSR builds, not only SSR.
 *
 * @see docs/guides/SINGLE_TENANT_MODE.md
 * @see docs/multitenant-fork/README.md
 */

import { getPublicEnv, isPublicFlagTrue } from './publicEnv';

const DEFAULT_DEMO_TENANT_ID = '6a166eb07089304417ec967a';

/** True only when the mode flag is on and a tenant id is configured (avoids half-configured demo builds). */
export function isSingleTenantMode(): boolean {
	const hasConfiguredId = getConfiguredSingleTenantId() != null;
	if (!hasConfiguredId) return false;
	// If an id is configured, default to single-tenant unless explicitly disabled.
	const mode = getPublicEnv('PUBLIC_SINGLE_TENANT_MODE');
	if (mode == null || String(mode).trim() === '') return true;
	return isPublicFlagTrue('PUBLIC_SINGLE_TENANT_MODE');
}

/** Firestore/Mongo tenant document id for the sole organization (required when single-tenant mode is on). */
export function getConfiguredSingleTenantId(): string | null {
	const id = getPublicEnv('PUBLIC_SINGLE_TENANT_ID');
	if (id == null || String(id).trim() === '') return DEFAULT_DEMO_TENANT_ID;
	return String(id).trim();
}

/** Optional label for UI when you do not want to load display name from the API yet. */
export function getConfiguredSingleTenantDisplayName(): string | null {
	const n = getPublicEnv('PUBLIC_SINGLE_TENANT_DISPLAY_NAME');
	if (n == null || String(n).trim() === '') return null;
	return String(n).trim();
}

export function assertSingleTenantConfigured(): void {
	if (isPublicFlagTrue('PUBLIC_SINGLE_TENANT_MODE') && !getConfiguredSingleTenantId()) {
		console.warn(
			'[tenantMode] PUBLIC_SINGLE_TENANT_MODE is set but PUBLIC_SINGLE_TENANT_ID is empty — multitenant UI until you set the id (see .env.demo.example).'
		);
	}
}
