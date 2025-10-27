# Database Schemas & API Documentation

## 📦 Database Schemas

### Cosmos DB Schemas

Located in: `backend-azure/CosmosSchemas/`

#### 1. **Candidates Collection** (`candidates.json`)
- **Partition Key**: `/id`
- **Purpose**: Store candidate profile information
- **Example Document**:
```json
{
  "id": "1",
  "name": "Ananya Gupta",
  "email": "ananya@example.com",
  "experience": 4,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### 2. **Evaluations Collection** (`evaluations.json`)
- **Partition Key**: `/candidateId`
- **Purpose**: Store evaluation scores and results
- **Example Document**:
```json
{
  "id": "1-1698765432000",
  "candidateId": "1",
  "candidate": { "id": 1, "name": "Ananya Gupta" },
  "scored": {
    "overallScore": 82,
    "skills": [
      { "name": "JavaScript", "score": 85 },
      { "name": "React", "score": 80 }
    ],
    "gaps": ["TypeScript", "Docker"],
    "recommendations": ["Focus on TypeScript fundamentals"],
    "meta": { "generatedAt": "2025-10-27T...", "model": "rule-based-v1" }
  },
  "createdAt": "2025-10-27T00:00:00.000Z"
}
```

#### 3. **Reports Collection** (`reports.json`)
- **Partition Key**: `/candidateId`
- **Purpose**: Store complete evaluation reports with feedback
- **Example Document**:
```json
{
  "id": "report-1-1698765432000",
  "candidateId": "1",
  "candidate": { "id": 1, "name": "Ananya Gupta" },
  "scored": { /* evaluation scores */ },
  "feedback": {
    "codeSnippet": "// Practice code...",
    "summary": "Focus on testing and caching",
    "suggestions": ["Write unit tests", "Add Redis caching"]
  },
  "createdAt": "2025-10-27T00:00:00.000Z"
}
```

### MongoDB Schemas (Mongoose)

Located in: `backend-azure/MongoSchemas/`

#### 1. **Candidate Schema** (`Candidate.ts`)
```typescript
{
  id: Number (required, unique),
  name: String (required),
  email: String (required),
  experience: Number (required),
  skills: [String],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### 2. **Evaluation Schema** (`Evaluation.ts`)
```typescript
{
  candidateId: String (indexed),
  scored: Mixed (evaluation results),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### 3. **Report Schema** (`Report.ts`)
```typescript
{
  candidateId: String (indexed),
  candidate: Mixed,
  scored: Mixed,
  feedback: Mixed,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 🔌 API Endpoints

### Base URLs

- **Production (Azure)**: `https://anees-candidate-poc-c2azfjg9ejeygseg.eastus2-01.azurewebsites.net/api`
- **Via Netlify Proxy**: `https://anees-candidatepoc.netlify.app/api`
- **Local Development**: `http://localhost:7071/api`

### 1. Generate Score

**Endpoint**: `POST /generate-score`

**Request Body**:
```json
{
  "candidate": {
    "id": 1,
    "name": "Ananya Gupta",
    "email": "ananya@example.com",
    "experience": 4,
    "skills": ["JavaScript", "React", "Node.js", "SQL"]
  }
}
```

**Response** (200 OK):
```json
{
  "overallScore": 82,
  "skills": [
    { "name": "JavaScript", "score": 86 },
    { "name": "TypeScript", "score": 55 },
    { "name": "React", "score": 86 },
    { "name": "Node.js", "score": 86 },
    { "name": "SQL", "score": 86 },
    { "name": "Python", "score": 40 },
    { "name": "AWS Lambda", "score": 40 },
    { "name": "Azure Functions", "score": 40 },
    { "name": "CI/CD", "score": 40 },
    { "name": "Docker", "score": 40 },
    { "name": "PostgreSQL", "score": 40 },
    { "name": "MongoDB", "score": 40 }
  ],
  "gaps": ["Python", "AWS Lambda", "Azure Functions", "CI/CD", "Docker"],
  "recommendations": [
    "Enroll in a focused course on Python.",
    "Build a weekend project using JavaScript + Python.",
    "Pair with a mentor weekly to review AWS Lambda decisions."
  ],
  "meta": {
    "generatedAt": "2025-10-27T06:30:00.000Z",
    "model": "rule-based-v1"
  }
}
```

---

### 2. Generate Feedback

**Endpoint**: `POST /generate-feedback`

**Request Body**:
```json
{
  "candidate": {
    "id": 1,
    "name": "Ananya Gupta",
    "email": "ananya@example.com",
    "experience": 4,
    "skills": ["JavaScript", "React", "Node.js", "SQL"]
  },
  "score": {
    "overallScore": 82,
    "gaps": ["TypeScript", "Docker"]
  }
}
```

**Response** (200 OK):
```json
{
  "codeSnippet": "// Suggested practice for Ananya Gupta\n// Task: Build a REST API with auth, caching and unit tests\nimport express from 'express';\nconst app = express();\napp.get('/health', (_req, res) => res.json({ ok: true }));\n// TODO: add JWT auth middleware\n// TODO: add Redis caching for /candidates\n// TODO: write unit tests with Vitest/Jest\napp.listen(3000);",
  "summary": "Focus on TypeScript and Docker. Ship a small project in 48h and document trade-offs.",
  "suggestions": [
    "Write unit tests for all endpoints (aim 80%+ coverage).",
    "Add E2E tests for auth flows; include negative cases.",
    "Profile queries and add indexes for slow endpoints."
  ],
  "meta": {
    "generatedAt": "2025-10-27T06:35:00.000Z",
    "model": "rule-based-feedback-v1"
  }
}
```

---

### 3. Generate Report (Future Endpoint)

**Endpoint**: `POST /generate-report`

**Request Body**:
```json
{
  "candidate": { /* candidate object */ },
  "score": { /* score object */ },
  "feedback": { /* feedback object */ }
}
```

**Response**: Combined report with email sent to candidate.

---

## 📮 Postman Collection

### Files Location
- **Collection**: `postman/FullStackFeature.postman_collection.json`
- **Environment**: `postman/FullStackFeature.postman_environment.json`

### How to Use

1. **Import Collection**:
   - Open Postman
   - Click "Import" → Select `FullStackFeature.postman_collection.json`

2. **Import Environment**:
   - Click "Import" → Select `FullStackFeature.postman_environment.json`
   - Select "Candidate PoC Environments" from environment dropdown

3. **Switch Between Environments**:
   - The environment has two configurations:
     - **Local**: `http://localhost:7071/api` (disabled by default)
     - **Production**: Azure Functions URL (enabled by default)
   - Toggle `enabled: true/false` to switch

4. **Test Endpoints**:
   - Select "Generate Score" request
   - Click "Send"
   - Review response in the bottom panel

### Available Requests

1. **Generate Score**
   - Method: `POST`
   - URL: `{{base}}/generate-score`
   - Body: Candidate object with id, name, email, experience, skills

2. **Generate Feedback**
   - Method: `POST`
   - URL: `{{base}}/generate-feedback`
   - Body: Candidate object + optional score object

---

## 🧪 Testing Examples

### Using cURL

**Generate Score**:
```bash
curl -X POST "https://anees-candidatepoc.netlify.app/api/generate-score" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate": {
      "id": 1,
      "name": "Ananya Gupta",
      "email": "ananya@example.com",
      "experience": 4,
      "skills": ["JavaScript", "React", "Node.js"]
    }
  }'
```

**Generate Feedback**:
```bash
curl -X POST "https://anees-candidatepoc.netlify.app/api/generate-feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate": {
      "id": 1,
      "name": "Ananya Gupta",
      "email": "ananya@example.com",
      "experience": 4,
      "skills": ["JavaScript", "React"]
    },
    "score": {
      "overallScore": 75,
      "gaps": ["TypeScript", "Testing"]
    }
  }'
```

---

## 🔐 CORS Configuration

The Azure Functions backend is configured with CORS to allow requests from:
- `https://anees-candidatepoc.netlify.app`
- Localhost (for development)

---

## 📊 Performance Metrics

Based on k6 load testing (see `PERFORMANCE.md`):
- **p95 Latency**: 332ms (target: <500ms) ✅
- **Success Rate**: 100%
- **Throughput**: 12.36 req/s
- **Concurrent Users Tested**: 10

---

## 🏗️ Architecture Notes

### Scoring Algorithm
- **Rule-based** (deterministic, fast, reproducible)
- Scores 12 base technical skills
- Considers candidate's existing skills and experience
- Returns top 5 skills and up to 5 skill gaps
- Generates personalized recommendations

### Feedback Generation
- Uses candidate name in code snippets
- Focuses on identified skill gaps from scoring
- Provides 3 actionable suggestions
- Includes sample code for practice

### Database Strategy
- **Cosmos DB**: Primary data store (serverless, globally distributed)
- **MongoDB**: Alternative schema provided for flexibility
- Both evaluations and reports are stored for audit trail
