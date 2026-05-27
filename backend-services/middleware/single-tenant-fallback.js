/**
 * Inject a default tenant id for single-tenant deployments.
 *
 * When SINGLE_TENANT_ID is configured, requests without X-Tenant-ID are pinned
 * to that tenant so legacy/multitenant clients still work.
 */
function singleTenantFallback(req, res, next) {
  const singleTenantId = process.env.SINGLE_TENANT_ID;
  if (!singleTenantId || String(singleTenantId).trim() === '') {
    return next();
  }

  const tenantId = String(singleTenantId).trim();
  const existingHeader = req.headers['x-tenant-id'];
  if (!existingHeader || String(existingHeader).trim() === '') {
    req.headers['x-tenant-id'] = tenantId;
  }

  if (!req.tenantId) {
    req.tenantId = req.headers['x-tenant-id'];
  }

  next();
}

module.exports = singleTenantFallback;
