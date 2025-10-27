import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(95)<100'], // p95 under 100ms
  },
};

export default function () {
  const url = 'http://localhost:7071/api/generate-score';
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
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(0.3);
}
