# Candidate Evaluation PoC — Full‑Stack (Next.js + Azure Functions)

A production‑ready proof‑of‑concept showing an end‑to‑end flow:
- **FE (Vercel, Next.js 14 App Router + Tailwind)**: Recruiter dashboard → select candidate → trigger AI scoring + show skill gaps (progress bars & tags) → mini feedback app with Approve/Reject.
- **BE (Azure Functions, TypeScript)**: `/generate-score` returns structured scoring JSON; `/generate-feedback` returns actionable suggestions; background `/generate-report` (for Logic Apps) persists to CosmosDB and sends a transactional email via SendGrid.
- **Background**: Sample Azure Logic Apps workflow calling the report endpoint; Cosmos DB & MongoDB schemas; Postman collection; k6 performance test.

## Monorepo Structure
```
frontend/                # Next.js (Vercel) front-end
backend-azure/           # Azure Functions (TypeScript) back-end
workflows/               # Logic Apps workflow + k6 load test + SendGrid template sample
postman/                 # Postman collection & environment
data/                    # Sample candidate seed data
```

---

## Quick Start (Local Dev)

### 1) Backend (Azure Functions)

```bash
cd backend-azure
npm i
npm run build   # compile TypeScript
npm run start   # starts local functions host on http://localhost:7071
```
Create `local.settings.json` from the provided example and set these keys:
- `COSMOS_ENDPOINT`, `COSMOS_KEY`, `COSMOS_DB_NAME` (optional for local demo — functions work without DB if unset)
- `SENDGRID_API_KEY`, `SENDER_EMAIL` (optional)
- `ALLOWED_ORIGINS` (comma separated list, e.g. `http://localhost:3000`)

### 2) Frontend (Next.js)

```bash
cd frontend
npm i
npm run dev  # http://localhost:3000
```
Create `.env.local` from the example and set:
- `NEXT_PUBLIC_API_BASE=http://localhost:7071/api`

### 3) Try it
- Open http://localhost:3000, select a candidate in the dashboard, click **Evaluate**.
- The FE calls `POST /generate-score` → displays scores and gaps.
- Use **Mini Feedback** to call `POST /generate-feedback` and Approve/Reject.

---

## Deploy

### Backend → Azure Functions (Node/TypeScript)

**Prerequisites:**
```bash
# Install Azure CLI
# Linux (Ubuntu/Debian)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# macOS
brew install azure-cli

# Windows (using winget)
winget install Microsoft.AzureCLI

# Windows (using MSI installer)
# Download from: https://aka.ms/installazurecliwindows
```

```bash
# Install Azure Functions Core Tools
# Linux (Ubuntu/Debian)
sudo apt-get install azure-functions-core-tools-4

# macOS
brew install azure-functions-core-tools@4

# Windows (using npm)
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Windows (using Chocolatey)
choco install azure-functions-core-tools
```

**Deploy:**
- Provision a Functions app (Linux, Node 20 LTS).
- Set Application Settings (same as `local.settings.json`). Include CORS allowed origins.

```bash
cd backend-azure
npm run build
func azure functionapp publish <YOUR_FUNCTION_APP_NAME>
```

Or use GitHub Actions/Azure Pipelines for CI/CD.

### Frontend → Netlify / Vercel
- Import `frontend/` in Netlify or Vercel.
- Set env `NEXT_PUBLIC_API_BASE` to your Functions URL + `/api` (e.g., `https://<app>.azurewebsites.net/api`).
- Deploy.

---

## Cosmos DB & MongoDB
- Example schemas live under `backend-azure/CosmosSchemas` and `backend-azure/MongoSchemas` (Mongoose‑style).
- The app writes to Cosmos if env vars are set; otherwise it operates in stateless mode.

---

## Postman & Load Test

### Postman Collection
- Import `postman/FullStackFeature.postman_collection.json` and the environment file. 
- Hit `/generate-score` and `/generate-feedback` endpoints.

### k6 Performance Test
**Install k6:**

```bash
# Linux (Ubuntu/Debian)
sudo snap install k6

# macOS
brew install k6

# Windows (using Chocolatey)
choco install k6

# Windows (using winget)
winget install k6 --source winget
```

**Run the test:**

```bash
# Test production endpoint
k6 run workflows/k6/test-generate-score.js

# Test local development
BASE_URL=http://localhost:7071/api k6 run workflows/k6/test-generate-score.js
```

- **📊 Performance Results**: See [PERFORMANCE.md](./PERFORMANCE.md) for detailed test results
  - ✅ p95 latency: **332ms** (target: <500ms)
  - ✅ 100% success rate under load
  - ✅ 12.36 requests/second sustained

---

## Performance Notes
- **FE interaction**: <200ms via optimistic UI and minimal payloads
- **BE endpoint p95**: **332ms** in production (Azure Functions East US 2)
- **Tested**: 10 concurrent users over 30 seconds (380 requests, 0% failure rate)
- For production: Enable warm instances, compression, HTTP/2, and Application Insights

---

## Security & SSRF
- Backend strictly validates origin/cors.
- Inputs are schema‑validated. URLs are not fetched server‑side in this demo.
- For production, consider rate limits + auth (e.g., signed JWT from FE).

---

## Tech
- **FE**: Next.js 14 App Router, TypeScript, Tailwind, Framer Motion (mobile-responsive)
- **BE**: Azure Functions v4, TypeScript, @azure/cosmos (optional), @sendgrid/mail (optional).
- **Infra**: Logic Apps sample workflow, SendGrid sample, Postman, k6 test.

##Thanks & Regards,
**Shaik Mohammed Anees**
