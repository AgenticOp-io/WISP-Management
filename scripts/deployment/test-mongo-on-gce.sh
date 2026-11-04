#!/usr/bin/env bash
set -euo pipefail
cd /opt/lte-pci-mapper/backend-services
node <<'NODE'
require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGO_FAIL: MONGODB_URI not set');
  process.exit(1);
}
mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(async () => {
    const db = mongoose.connection.db;
    const cols = await db.listCollections().toArray();
    console.log('MONGO_OK collections=', cols.length);
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch((e) => {
    console.error('MONGO_FAIL', e.message);
    process.exit(1);
  });
NODE
