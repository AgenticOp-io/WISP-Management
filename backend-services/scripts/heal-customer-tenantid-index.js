#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(line);
    if (!m || line.trim().startsWith("#")) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}
const mongoose = require("mongoose");
const { Customer } = require("../models/customer");

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (!uri) throw new Error("missing-mongodb-uri");
  console.log("connecting", String(uri).replace(/\/\/([^@]+)@/, "//***@").slice(0, 80));
  await mongoose.connect(uri);
  const unset = await Customer.collection.updateMany({ leadHash: null }, { $unset: { leadHash: "" } });
  console.log("unset null leadHash", unset.modifiedCount);
  const idxs = await Customer.collection.indexes();
  for (const idx of idxs) {
    const keys = Object.keys(idx.key || {});
    if (keys.length === 2 && keys.includes("tenantId") && keys.includes("leadHash") && idx.unique) {
      console.log("DROPPING", idx.name);
      await Customer.collection.dropIndex(idx.name);
    }
  }
  await Customer.collection.createIndex(
    { tenantId: 1, leadHash: 1 },
    {
      unique: true,
      name: "tenantId_1_leadHash_1",
      partialFilterExpression: { leadHash: { $type: "string" } },
    },
  );
  console.log("recreated partial unique leadHash index");
  console.log("AFTER", JSON.stringify(await Customer.collection.indexes(), null, 2));
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
