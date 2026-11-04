// System Management API
// Platform admin only - controls backend services and system

const express = require('express');
const { execSync } = require('child_process');
const os = require('os');
const router = express.Router();

// Use reusable admin middleware
const { requireAuth, requireAdmin: requireAdminMiddleware } = require('../middleware/admin-auth');

// All system routes require authentication
router.use(requireAuth);

// Platform admin middleware - only platform_admin role allowed
const requirePlatformAdmin = requireAdminMiddleware({ allowedRoles: ['platform_admin'] });

/**
 * Get all services status (PM2 + systemd)
 * GET /services/status
 */
router.get('/services/status', requirePlatformAdmin, (req, res) => {
  try {
    console.log('[Services Status] Fetching all services...');
    const services = [];
    
    // Get PM2 services
    try {
      const pm2Output = execSync('pm2 jlist', { encoding: 'utf8' });
      const pm2Processes = JSON.parse(pm2Output);
      
      pm2Processes.forEach(p => {
        services.push({
          name: p.name,
          displayName: p.name,
          status: p.pm2_env.status,
          uptime: Date.now() - p.pm2_env.pm_uptime,
          memory: p.monit.memory,
          cpu: p.monit.cpu,
          restarts: p.pm2_env.restart_time,
          port: getServicePort(p.name),
          canControl: true,
          type: 'pm2'
        });
      });
    } catch (e) {
      console.error('Error getting PM2 services:', e);
    }
    
    // MongoDB is cloud-based (MongoDB Atlas), not on this server
    
    console.log(`[Services Status] Returning ${services.length} services`);
    res.json({ success: true, services });
  } catch (error) {
    console.error('[Services Status] Error:', error);
    res.status(500).json({ error: 'Failed to get services status' });
  }
});

/**
 * Get system resources
 * GET /resources
 */
router.get('/resources', requirePlatformAdmin, (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    // Get disk usage
    let diskInfo = null;
    try {
      const dfOutput = execSync('df -B1 / | tail -1', { encoding: 'utf8' });
      const parts = dfOutput.trim().split(/\s+/);
      diskInfo = {
        total: parseInt(parts[1]),
        used: parseInt(parts[2]),
        available: parseInt(parts[3]),
        percent: parseInt(parts[4])
      };
    } catch (e) {
      // Disk info not available
    }
    
    res.json({
      success: true,
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        percent: Math.round((usedMem / totalMem) * 100)
      },
      cpu: {
        cores: os.cpus().length,
        percent: getCpuUsage()
      },
      disk: diskInfo,
      uptime: os.uptime(),
      loadAvg: os.loadavg(),
      hostname: os.hostname()
    });
  } catch (error) {
    console.error('[System Resources] Error:', error);
    res.status(500).json({ error: 'Failed to get system resources' });
  }
});

/**
 * Restart a specific service
 * POST /services/:serviceName/restart
 */
router.post('/services/:serviceName/restart', requirePlatformAdmin, (req, res) => {
  try {
    const { serviceName } = req.params;
    
    console.log(`[System Management] Restarting service: ${serviceName}`);
    
    execSync(`pm2 restart ${serviceName}`, { encoding: 'utf8' });
    
    res.json({ success: true, message: `Service ${serviceName} restarted` });
  } catch (error) {
    console.error(`[Service Restart] Error:`, error);
    res.status(500).json({ error: 'Failed to restart service' });
  }
});

/**
 * Stop a service
 * POST /services/:serviceName/stop
 */
router.post('/services/:serviceName/stop', requirePlatformAdmin, (req, res) => {
  try {
    const { serviceName } = req.params;
    
    console.log(`[System Management] Stopping service: ${serviceName}`);
    
    execSync(`pm2 stop ${serviceName}`, { encoding: 'utf8' });
    
    res.json({ success: true, message: `Service ${serviceName} stopped` });
  } catch (error) {
    console.error(`[Service Stop] Error:`, error);
    res.status(500).json({ error: 'Failed to stop service' });
  }
});

/**
 * Start a service
 * POST /services/:serviceName/start
 */
router.post('/services/:serviceName/start', requirePlatformAdmin, (req, res) => {
  try {
    const { serviceName} = req.params;
    
    console.log(`[System Management] Starting service: ${serviceName}`);
    
    execSync(`pm2 start ${serviceName}`, { encoding: 'utf8' });
    
    res.json({ success: true, message: `Service ${serviceName} started` });
  } catch (error) {
    console.error(`[Service Start] Error:`, error);
    res.status(500).json({ error: 'Failed to start service' });
  }
});

/**
 * Restart all PM2 services
 * POST /system/restart-all
 */
router.post('/system/restart-all', requirePlatformAdmin, (req, res) => {
  try {
    console.log('[System Management] Restarting all PM2 services');
    execSync('pm2 restart all', { encoding: 'utf8' });
    
    res.json({ success: true, message: 'All services restarted' });
  } catch (error) {
    console.error('[Restart All] Error:', error);
    res.status(500).json({ error: 'Failed to restart all services' });
  }
});

/**
 * Reboot the VM
 * POST /system/reboot
 */
router.post('/system/reboot', requirePlatformAdmin, (req, res) => {
  try {
    console.log('[System Management] ?? REBOOTING VM');
    
    // Send response before rebooting
    res.json({ success: true, message: 'VM reboot initiated. System will be back online in 1-2 minutes.' });
    
    // Reboot after 2 seconds (gives time for response to be sent)
    setTimeout(() => {
      execSync('sudo reboot');
    }, 2000);
  } catch (error) {
    console.error('[Reboot] Error:', error);
    res.status(500).json({ error: 'Failed to reboot VM' });
  }
});

/**
 * Helper functions
 */
function getServicePort(serviceName) {
  const portMap = {
    'hss-api': 3000
  };
  return portMap[serviceName] || null;
}

function getCpuUsage() {
  try {
    const output = execSync('top -bn1 | grep "Cpu(s)"', { encoding: 'utf8' });
    const match = output.match(/([0-9.]+)\s*id/);
    if (match) {
      return Math.round(100 - parseFloat(match[1]));
    }
  } catch (error) {
    // Fallback to load average
    const load = os.loadavg()[0];
    const cpus = os.cpus().length;
    return Math.round((load / cpus) * 100);
  }
  return 0;
}

module.exports = router;

