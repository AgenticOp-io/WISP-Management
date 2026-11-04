#!/usr/bin/env node
/**
 * Create or reset a demo Firebase Auth user (default: wisptools-production).
 * Uses Application Default Credentials (gcloud auth application-default login).
 *
 * Usage:
 *   node scripts/create-demo-user.js
 *   node scripts/create-demo-user.js demo@example.com MyPassword123
 */

const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID || 'wisptools-production';
const email = process.argv[2] || 'demo@wisptools.io';
const password = process.argv[3] || process.env.DEMO_PASSWORD;

if (!password || password.length < 6) {
  console.error('Password must be at least 6 characters');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId
  });
}

const auth = admin.auth();

(async () => {
  let user;
  try {
    user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, {
      password,
      emailVerified: true,
      displayName: 'WISPTools Demo'
    });
    console.log('UPDATED_EXISTING_USER');
    console.log('uid:', user.uid);
  } catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await auth.createUser({
      email,
      password,
      emailVerified: true,
      displayName: 'WISPTools Demo'
    });
    console.log('CREATED_NEW_USER');
    console.log('uid:', user.uid);
  }
  console.log('email:', email);
  console.log('project:', projectId);
  console.log('');
  console.log('Next: link tenant —');
  console.log(`  set DEMO_FIREBASE_USER_UID=${user.uid}`);
  console.log('  npm run demo:seed');
})().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
