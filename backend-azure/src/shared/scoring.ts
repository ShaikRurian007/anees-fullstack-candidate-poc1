import { Candidate, ScoreResponse } from './types';

// Simple, deterministic scoring to keep p95 fast & reproducible
const BASE_SKILLS = [
  'JavaScript','TypeScript','React','Node.js','SQL','Python',
  'AWS Lambda','Azure Functions','CI/CD','Docker','PostgreSQL','MongoDB'
];

export function scoreCandidate(candidate: Candidate): ScoreResponse {
  const skillScores = BASE_SKILLS.map(name => ({
    name,
    score: candidate.skills.includes(name)
      ? 70 + Math.min(30, Math.round(candidate.experience * 4))
      : Math.max(20, 60 - Math.round(candidate.experience * 5)),
  }));

  const top = skillScores.sort((a,b)=>b.score-a.score).slice(0,5);
  const overall = Math.round(top.reduce((s, x)=>s+x.score, 0)/top.length);

  const gaps = skillScores.filter(s => s.score < 55).slice(0, 5).map(s => s.name);

  const recs = [
    `Enroll in a focused course on ${gaps[0] ?? 'system design'}.`,
    `Build a weekend project using ${top[0]?.name ?? 'React'} + ${gaps[0] ?? 'SQL'}.`,
    `Pair with a mentor weekly to review ${gaps[1] ?? 'architecture'} decisions.`
  ];

  return {
    overallScore: overall,
    skills: skillScores,
    gaps,
    recommendations: recs,
    meta: { generatedAt: new Date().toISOString(), model: 'rule-based-v1' },
  };
}
