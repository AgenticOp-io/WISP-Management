#!/usr/bin/env node
/** Link demo Firebase user to tenant id used by single-tenant frontend build. */
require('dotenv').config({ path: require('path').join(__dirname, '../../backend-services/.env') });
const mongoose = require('mongoose');

const TENANT_ID = process.env.SINGLE_TENANT_ID || '6a166eb07089304417ec967a';
const DEMO_UID = process.env.DEMO_FIREBASE_USER_UID || 'xbQzgkx9FQaqUkaocW8MjVXfUAZ2';
const DEMO_EMAIL = 'demo@wisptools.io';

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI required');
  await mongoose.connect(uri);

  const tenants = mongoose.connection.db.collection('tenants');
  const userTenants = mongoose.connection.db.collection('usertenants');

  let tenant = await tenants.findOne({ _id: new mongoose.Types.ObjectId(TENANT_ID) });
  if (!tenant) {
    const ins = await tenants.insertOne({
      _id: new mongoose.Types.ObjectId(TENANT_ID),
      name: 'demo-wisp',
      displayName: 'WISPTools Demo ISP',
      subdomain: 'wisptools-demo',
      contactEmail: DEMO_EMAIL,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {}
    });
    tenant = await tenants.findOne({ _id: ins.insertedId });
    console.log('Created tenant', TENANT_ID);
  } else {
    console.log('Tenant exists:', tenant.displayName || tenant.name);
  }

  await userTenants.updateOne(
    { userId: DEMO_UID, tenantId: TENANT_ID },
    {
      $set: {
        userId: DEMO_UID,
        tenantId: TENANT_ID,
        role: 'owner',
        status: 'active',
        email: DEMO_EMAIL,
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );
  console.log('Linked user', DEMO_UID, 'to tenant', TENANT_ID);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
