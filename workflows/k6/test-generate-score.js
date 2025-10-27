import http from 'k6/http';
import { check, sleep } from 'k6';

// Use environment variable for BASE_URL or default to production
const BASE_URL = __ENV.BASE_URL || 'https://anees-candidate-poc-c2azfjg9ejeygseg.eastus2-01.azurewebsites.net/api';

export const options = {
  vus: 10, // 10 virtual users
  duration: '30s', // Run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<500'], // p95 under 500ms (relaxed for cold starts)
    http_req_failed: ['rate<0.05'], // Less than 5% failure rate
  },
};

export default function () {
  const url = `${BASE_URL}/generate-score`;
  const payload = JSON.stringify({
    candidate: {
      id: 999,
      name: 'Perf Tester',
      email: 'perf@test.com',
      experience: 3,
      skills: ['JavaScript','React','Node.js']
    }
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  
  check(res, { 
    'status was 200': (r) => r.status === 200,
    'response has overallScore': (r) => JSON.parse(r.body).overallScore !== undefined,
  });
  
  sleep(0.5);
}
