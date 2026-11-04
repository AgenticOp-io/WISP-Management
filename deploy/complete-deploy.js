#!/usr/bin/env node
// Deployment script (GenieACS removed)
// Run with: npm run deploy:complete

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.cyan}[STEP ${step}]${colors.reset} ${colors.bright}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function promptUser(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function checkEnvironment() {
  logStep(1, 'Checking Environment');
  try {
    execSync('firebase --version', { stdio: 'pipe' });
    logSuccess('Firebase CLI available');
  } catch {
    throw new Error('Firebase CLI not found. Install with: npm i -g firebase-tools');
  }
}

async function deployFirebaseFunctions() {
  logStep(2, 'Deploying Firebase Functions');
  const proceed = await promptUser(`${colors.yellow}Deploy Firebase Functions? (y/n): ${colors.reset}`);
  if (proceed.toLowerCase() !== 'y') {
    logWarning('Skipping Firebase Functions deployment');
    return false;
  }
  execSync('firebase deploy --only functions', { stdio: 'inherit' });
  logSuccess('Firebase Functions deployed');
  return true;
}

async function deployWebHosting() {
  logStep(3, 'Deploying Web Hosting');
  const proceed = await promptUser(`${colors.yellow}Deploy web hosting? (y/n): ${colors.reset}`);
  if (proceed.toLowerCase() !== 'y') {
    logWarning('Skipping web hosting deployment');
    return false;
  }
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  logSuccess('Web hosting deployed');
  return true;
}

async function displayResults(firebaseDeployed, hostingDeployed) {
  logStep(4, 'Deployment Complete');

  let projectId = 'lte-pci-mapper';
  let hostingUrl = '';
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '.firebaserc'), 'utf8'));
    projectId = firebaseConfig.projects.default;
    hostingUrl = `https://${projectId}.web.app`;
  } catch {
    logWarning('Could not read Firebase configuration');
  }

  const functionsUrl = `https://us-central1-${projectId}.cloudfunctions.net`;

  log('\n' + '='.repeat(70));
  log(`${colors.green}Deployment Complete${colors.reset}`);
  log('='.repeat(70));
  if (hostingDeployed) log(`\nWeb Application: ${colors.cyan}${hostingUrl}${colors.reset}`);
  if (firebaseDeployed) log(`\nFirebase Functions: ${colors.cyan}${functionsUrl}${colors.reset}`);
  log('\n' + '='.repeat(70));
}

async function main() {
  try {
    log(`${colors.bright}${colors.magenta}🚀 Deployment${colors.reset}`);
    log(`${colors.blue}Deploys Firebase Functions and Web Hosting (GenieACS removed)${colors.reset}\n`);

    await checkEnvironment();
    const firebaseDeployed = await deployFirebaseFunctions();
    const hostingDeployed = await deployWebHosting();
    await displayResults(firebaseDeployed, hostingDeployed);
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
