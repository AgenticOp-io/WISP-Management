#!/usr/bin/env node
/**
 * Seed demo plan + map assets for single-tenant WISPTools demo.
 * Run: cd backend-services && node scripts/seed-plan-map-demo.js
 */
'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const { PlanProject } = require('../models/plan');
const { UnifiedSite, UnifiedSector } = require('../models/network');

const TENANT_ID = process.env.SINGLE_TENANT_ID || '6a166eb07089304417ec967a';
const CREATED_BY = process.env.DEMO_FIREBASE_USER_UID || 'demo-seed-script';
const TAG = 'plan-map-demo-v1';

const SITES = [
  {
    name: 'Demo Tower West',
    location: { latitude: 39.7392, longitude: -105.0007, city: 'Denver', state: 'CO', country: 'US' }
  },
  {
    name: 'Demo Tower East',
    location: { latitude: 39.7508, longitude: -104.9847, city: 'Denver', state: 'CO', country: 'US' }
  }
];

const MARKETING_ADDRESSES = [
  {
    addressLine1: '1600 Broadway',
    city: 'Denver',
    state: 'CO',
    postalCode: '80202',
    country: 'US',
    latitude: 39.7439,
    longitude: -104.9878,
    source: TAG,
    discoveredAt: new Date()
  },
  {
    addressLine1: '2001 Blake St',
    city: 'Denver',
    state: 'CO',
    postalCode: '80205',
    country: 'US',
    latitude: 39.7536,
    longitude: -104.9942,
    source: TAG,
    discoveredAt: new Date()
  }
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI required');

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30_000 });
  console.log('[seed-plan-map] Connected');

  let plan = await PlanProject.findOne({ tenantId: TENANT_ID, name: 'WISPTools Demo Coverage Plan' });
  if (!plan) {
    plan = await PlanProject.create({
      name: 'WISPTools Demo Coverage Plan',
      description: 'Sample plan for management demo map',
      status: 'active',
      showOnMap: true,
      tenantId: TENANT_ID,
      createdBy: CREATED_BY,
      marketing: {
        addresses: MARKETING_ADDRESSES,
        totalUniqueAddresses: MARKETING_ADDRESSES.length
      },
      location: {
        city: 'Denver',
        state: 'CO',
        country: 'US',
        latitude: 39.7392,
        longitude: -105.0007
      }
    });
    console.log('[seed-plan-map] Created plan:', plan._id.toString());
  } else {
    plan.status = 'active';
    plan.showOnMap = true;
    plan.marketing = plan.marketing || {};
    plan.marketing.addresses = MARKETING_ADDRESSES;
    plan.marketing.totalUniqueAddresses = MARKETING_ADDRESSES.length;
    await plan.save();
    console.log('[seed-plan-map] Updated plan:', plan._id.toString());
  }

  const planId = plan._id.toString();
  const siteIds = [];

  for (const spec of SITES) {
    let site = await UnifiedSite.findOne({ tenantId: TENANT_ID, name: spec.name });
    if (!site) {
      site = await UnifiedSite.create({
        ...spec,
        type: ['tower'],
        status: 'active',
        tenantId: TENANT_ID,
        createdBy: CREATED_BY
      });
      console.log('[seed-plan-map] Created site:', site.name, site._id.toString());
    } else {
      site.planId = undefined;
      site.location = spec.location;
      site.status = 'active';
      await site.save();
      console.log('[seed-plan-map] Updated site:', site.name);
    }
    siteIds.push(site._id);
  }

  const sectorSpecs = [
    { name: 'West Sector A', siteIndex: 0, azimuth: 90, band: '3.5GHz', technology: 'LTE' },
    { name: 'East Sector B', siteIndex: 1, azimuth: 270, band: '3.5GHz', technology: 'LTE' }
  ];

  for (const spec of sectorSpecs) {
    const site = siteIds[spec.siteIndex];
    const loc = SITES[spec.siteIndex].location;
    let sector = await UnifiedSector.findOne({ tenantId: TENANT_ID, name: spec.name });
    if (!sector) {
      sector = await UnifiedSector.create({
        name: spec.name,
        status: 'active',
        technology: spec.technology,
        band: spec.band,
        azimuth: spec.azimuth,
        beamwidth: 65,
        location: loc,
        siteId: site,
        tenantId: TENANT_ID,
        createdBy: CREATED_BY
      });
      console.log('[seed-plan-map] Created sector:', sector.name);
    } else {
      sector.siteId = site;
      sector.planId = undefined;
      sector.location = loc;
      sector.azimuth = spec.azimuth;
      await sector.save();
      console.log('[seed-plan-map] Updated sector:', sector.name);
    }
  }

  await UnifiedSite.updateMany({ tenantId: TENANT_ID }, { $unset: { planId: 1 } });
  await UnifiedSector.updateMany({ tenantId: TENANT_ID }, { $unset: { planId: 1 } });

  const counts = {
    plans: await PlanProject.countDocuments({ tenantId: TENANT_ID }),
    sites: await UnifiedSite.countDocuments({ tenantId: TENANT_ID }),
    sectors: await UnifiedSector.countDocuments({ tenantId: TENANT_ID })
  };
  console.log('[seed-plan-map] Done for tenant', TENANT_ID, counts);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
