# Google Cloud Deployment Guide

Complete guide for deploying the LTE WISP Management Platform with HSS and GenieACS on Google Cloud.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Google Cloud Platform                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Frontend (Firebase Hosting via Cloud Build)          │  │
│  │ - SvelteKit application                              │  │
│  │ - HSS Management UI                                  │  │
│  │ - ACS/CPE Management UI                              │  │
│  │ - PCI Mapper                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Backend Server (GCE VM: 136.112.111.167)            │  │
│  │                                                      │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │ GenieACS (TR-069 ACS)                        │  │  │
│  │  │ - Port 7547 (CWMP)                           │  │  │
│  │  │ - Port 7557 (NBI API)                        │  │  │
│  │  │ - Port 7567 (File Server)                    │  │  │
│  │  │ - Port 3333 (Web UI)                         │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │ HSS Services                                  │  │  │
│  │  │ - Port 3868 (Open5GS HSS - S6a/Diameter)    │  │  │
│  │  │ - Port 3000 (HSS Management API - REST)      │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ MongoDB Atlas (Cloud Database)                       │  │
│  │ - Subscribers                                        │  │
│  │ - Groups & Bandwidth Plans                           │  │
│  │ - GenieACS Data                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

1. **Google Cloud Project**
   - Project ID: `lte-pci-mapper-65450042-bbf71`
   - Billing enabled
   - APIs enabled: Compute Engine, Cloud Build, Firebase

2. **gcloud CLI installed**
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   
   # Initialize and authenticate
   gcloud init
   gcloud auth login
   gcloud config set project lte-pci-mapper-65450042-bbf71
   ```

3. **Backend Server Running**
   - VM: `acs-hss-server` (136.112.111.167)
   - OS: Ubuntu 22.04 or 24.04
   - SSH access configured

## 🚀 Deployment Steps

### Step 1: Deploy Backend Services (HSS API + GenieACS)

#### 1.1 SSH into Backend Server
```bash
ssh root@136.112.111.167
```

#### 1.2 Install GenieACS
```bash
# Run the clean GenieACS installation script
bash clean-install-genieacs.sh
```

**Verify GenieACS:**
```bash
systemctl status genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui
curl http://localhost:7557/devices
```

#### 1.3 Deploy HSS Management API
```bash
# Deploy the Node.js HSS Management API
bash deploy-hss-api.sh
```

**Verify HSS API:**
```bash
systemctl status hss-api
curl http://localhost:3000/health
curl http://localhost:3000/dashboard/stats
```

#### 1.4 Verify All Services
```bash
# Check all services
netstat -tulpn | grep -E ':(3000|3333|3868|7547|7557|7567)'

# Or with ss
ss -tulpn | grep -E ':(3000|3333|3868|7547|7557|7567)'
```

Expected output:
```
tcp  0  0.0.0.0:3000   LISTEN  (hss-api)
tcp  0  0.0.0.0:3333   LISTEN  (genieacs-ui)
tcp  0  0.0.0.0:3868   LISTEN  (open5gs-hssd)
tcp  0  0.0.0.0:7547   LISTEN  (genieacs-cwmp)
tcp  0  0.0.0.0:7557   LISTEN  (genieacs-nbi)
tcp  0  0.0.0.0:7567   LISTEN  (genieacs-fs)
```

### Step 2: Deploy Frontend via Cloud Build

#### 2.1 From Your Development Machine
```bash
# Clone the repository (if not already)
git clone https://github.com/theorem6/lte-pci-mapper.git
cd lte-pci-mapper

# Deploy frontend
bash deploy-frontend-now.sh
```

#### 2.2 Manual Cloud Build Trigger (Alternative)
```bash
gcloud builds submit \
  --config=deploy-frontend-production.yaml \
  --project=lte-pci-mapper-65450042-bbf71 \
  --region=us-central1 \
  .
```

#### 2.3 Monitor Build Progress
```bash
# View build logs
gcloud builds log --region=us-central1 --stream

# Or view in console
open https://console.cloud.google.com/cloud-build/builds
```

#### 2.4 Verify Deployment
Once the build completes, your frontend will be live at:
- **Production:** https://lte-pci-mapper-65450042-bbf71.web.app
- **Firebaseapp:** https://lte-pci-mapper-65450042-bbf71.firebaseapp.com

Test the connection:
```bash
curl https://lte-pci-mapper-65450042-bbf71.web.app
```

## ✅ Post-Deployment Verification

### 1. Test Backend Services

**GenieACS API:**
```bash
curl http://136.112.111.167:7557/devices
curl http://136.112.111.167:7557/tasks
```

**HSS Management API:**
```bash
curl http://136.112.111.167:3000/health
curl http://136.112.111.167:3000/dashboard/stats
curl http://136.112.111.167:3000/bandwidth-plans
curl http://136.112.111.167:3000/groups
curl http://136.112.111.167:3000/subscribers
```

### 2. Test Frontend Integration

1. **Open the Frontend:**
   - Navigate to: https://lte-pci-mapper-65450042-bbf71.web.app
   - Login with Firebase Authentication

2. **Navigate to HSS Module:**
   - Go to "Modules" → "HSS & Subscriber Management"
   
3. **Test Functionality:**
   - ✅ Dashboard loads and shows stats
   - ✅ Can create bandwidth plans
   - ✅ Can create subscriber groups
   - ✅ Can add individual subscribers
   - ✅ Can bulk import subscribers via CSV

### 3. Test GenieACS Integration

1. **Navigate to ACS/CPE Management:**
   - Go to "Modules" → "ACS CPE Management"
   
2. **Verify Connection:**
   - Devices list should load from backend
   - Can view device details
   - Can create tasks

## 🔧 Configuration Files

### Backend Configuration (On VM)

**GenieACS Config:** `/opt/genieacs/genieacs.env`
```bash
GENIEACS_MONGODB_CONNECTION_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
GENIEACS_CWMP_PORT=7547
GENIEACS_NBI_PORT=7557
GENIEACS_FS_PORT=7567
GENIEACS_UI_PORT=3333
```

**HSS API Config:** `/opt/hss-api/.env`
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
NODE_ENV=production
```

### Frontend Configuration (In Cloud Build)

Created dynamically in `deploy-frontend-production.yaml`:
```env
PUBLIC_GENIEACS_NBI_URL=http://136.112.111.167:7557
PUBLIC_GENIEACS_CWMP_URL=http://136.112.111.167:7547
VITE_HSS_API_URL=http://136.112.111.167:3000
```

## 🔐 Security Considerations

### 1. Firewall Rules (Configure in GCP Console)

**Required Ingress Rules:**
```bash
# GenieACS CWMP (for CPE devices to connect)
Port 7547 - Source: CPE device IPs

# GenieACS NBI API (internal only)
Port 7557 - Source: Internal/VPN only

# HSS Management API (internal only)
Port 3000 - Source: Internal/VPN only

# GenieACS Web UI (internal only)
Port 3333 - Source: Internal/VPN only

# Open5GS HSS S6a (for MME connections)
Port 3868 - Source: MME IPs
```

**Configure via gcloud:**
```bash
# Allow CWMP from anywhere (CPE devices)
gcloud compute firewall-rules create allow-genieacs-cwmp \
  --allow=tcp:7547 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=acs-server

# Allow internal API access (replace with your IP)
gcloud compute firewall-rules create allow-internal-apis \
  --allow=tcp:3000,tcp:7557,tcp:3333 \
  --source-ranges=YOUR_OFFICE_IP/32 \
  --target-tags=acs-server

# Allow MME S6a connections
gcloud compute firewall-rules create allow-hss-s6a \
  --allow=tcp:3868 \
  --source-ranges=MME_IP/32 \
  --target-tags=acs-server
```

### 2. MongoDB Atlas Security

**Whitelist Backend Server IP:**
1. Go to MongoDB Atlas Console
2. Network Access → Add IP Address
3. Add: `136.112.111.167`

### 3. HTTPS/SSL (Recommended for Production)

**Option 1: Use Cloud Load Balancer**
```bash
# Create SSL certificate
gcloud compute ssl-certificates create wisp-ssl-cert \
  --domains=wisp.yourdomain.com

# Create HTTPS load balancer pointing to backend VM
# (See GCP Load Balancer documentation)
```

**Option 2: Use Let's Encrypt on VM**
```bash
# Install certbot
apt-get install certbot

# Get certificate
certbot certonly --standalone -d wisp.yourdomain.com

# Configure nginx as reverse proxy with SSL
```

## 📊 Monitoring & Logging

### View Cloud Build Logs
```bash
gcloud builds log --region=us-central1 --stream
```

### View Backend Service Logs
```bash
# SSH into server
ssh root@136.112.111.167

# View HSS API logs
journalctl -u hss-api -f

# View GenieACS logs
journalctl -u genieacs-cwmp -f
journalctl -u genieacs-nbi -f

# View Open5GS HSS logs
journalctl -u open5gs-hssd -f
```

### Set Up Cloud Logging (Optional)
Install Logging Agent on VM:
```bash
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
bash add-logging-agent-repo.sh
apt-get update
apt-get install google-fluentd
```

## 🔄 Updating the Application

### Update Backend Services
```bash
# SSH into server
ssh root@136.112.111.167

# Pull latest code
cd /path/to/repo
git pull origin main

# Restart services
systemctl restart hss-api
systemctl restart genieacs-{cwmp,nbi,fs,ui}
```

### Update Frontend
```bash
# From your development machine
git pull origin main
bash deploy-frontend-now.sh
```

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Check 1: Backend services are running**
```bash
ssh root@136.112.111.167
systemctl status hss-api genieacs-nbi
```

**Check 2: Firewall rules allow connections**
```bash
gcloud compute firewall-rules list
```

**Check 3: CORS is enabled**
The HSS API has CORS enabled by default. Verify in `/opt/hss-api/server.js`:
```javascript
app.use(cors());
```

### GenieACS Can't Connect to MongoDB

**Check MongoDB connection:**
```bash
# Test from server
mongo "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/test"
```

**Check MongoDB Atlas IP whitelist:**
- Add `136.112.111.167` to MongoDB Atlas Network Access

### Build Fails in Cloud Build

**Check build logs:**
```bash
gcloud builds log --region=us-central1
```

**Common issues:**
- Node.js version mismatch
- Missing dependencies
- Build timeout (increase in YAML)

## 📞 Support

- **Documentation:** See `FRONTEND_BACKEND_CONNECTION.md`
- **Backend API:** `deploy-hss-api.sh`
- **GenieACS:** `clean-install-genieacs.sh`
- **Frontend Build:** `deploy-frontend-production.yaml`

---

## ✅ Deployment Checklist

- [ ] Backend server running (136.112.111.167)
- [ ] GenieACS installed and running
- [ ] HSS Management API deployed
- [ ] MongoDB Atlas IP whitelisted
- [ ] Firewall rules configured
- [ ] Frontend deployed via Cloud Build
- [ ] Can access frontend at Firebase Hosting URL
- [ ] HSS module working in frontend
- [ ] Can create bandwidth plans
- [ ] Can create subscriber groups
- [ ] Can add subscribers
- [ ] GenieACS API accessible from frontend

**All done! Your LTE WISP Management Platform is live on Google Cloud!** 🎉

