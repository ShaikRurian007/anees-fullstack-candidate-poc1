import { Candidate, FeedbackResponse } from './types';

export function generateFeedback(candidate: Candidate, score?: any): FeedbackResponse {
  const primary = (score?.gaps?.[0]) || 'testing';
  const secondary = (score?.gaps?.[1]) || 'database indexing';

  const codeSnippet = `// Suggested practice for ${candidate.name}
// Task: Build a REST API with auth, caching and unit tests
import express from 'express';
const app = express();
app.get('/health', (_req, res) => res.json({ ok: true }));
// TODO: add JWT auth middleware
// TODO: add Redis caching for /candidates
// TODO: write unit tests with Vitest/Jest
app.listen(3000);`;

  return {
    codeSnippet,
    summary: `Focus on ${primary} and ${secondary}. Ship a small project in 48h and document trade-offs.`,
    suggestions: [
      `Write unit tests for all endpoints (aim 80%+ coverage).`,
      `Add E2E tests for auth flows; include negative cases.`,
      `Profile queries and add indexes for slow endpoints.`
    ],
    meta: { generatedAt: new Date().toISOString(), model: 'rule-based-feedback-v1' }
  };
}
